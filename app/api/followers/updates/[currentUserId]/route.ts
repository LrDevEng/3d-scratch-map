import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(): Promise<NextResponse<ReadableStream>> {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // Postgres connection
  const postgresClient = new Client({
    user: process.env.PGUSERNAME,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: 5432,
  });

  // Connect to postgres client
  await postgresClient.connect();

  // Listen to the postgres notifications on 'follower_updates' channel
  await postgresClient.query('LISTEN follower_updates;');

  function sendNotification(msg: string) {
    writer
      .write(encoder.encode(`data: Event ${msg}\n\n`))
      .catch((error) => console.log(error));
  }

  // Event listener for PostgreSQL notifications
  postgresClient.on('notification', (msg) => {
    console.log(msg);
    sendNotification(msg.payload ? msg.payload : ''); // Send the payload of the notification to the client
  });

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}

// export async function GET(req, res) {
//   // Get current user id from endpoint
//   // const userId = (await params).currentUserId;

//   // Set headers for SSE
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.flushHeaders();

//   // PostgreSQL connection
//   const client = new Client({
//     user: process.env.PGUSERNAME,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     password: process.env.PGPASSWORD,
//     port: 5432,
//   });

//   await client.connect();

//   // Listen to the PostgreSQL notifications on 'follower_updates' channel
//   await client.query('LISTEN follower_updates;');

//   // Function to send the notifications to the client over SSE
//   const sendNotification = (message) => {
//     res.write(`data: ${message}\n\n`);
//   };

//   // Event listener for PostgreSQL notifications
//   client.on('notification', (msg) => {
//     console.log(msg);
//     sendNotification(msg.payload ? msg.payload : ''); // Send the payload of the notification to the client
//   });

//   // Handle client disconnection (optional)
//   req.on('close', () => {
//     client.end().catch((error) => console.log(error));
//     res.end();
//   });
// }
