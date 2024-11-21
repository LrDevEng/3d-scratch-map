import { NextResponse } from 'next/server';
import { Client } from 'pg';
import { checkAuthentication } from '../../../../../util/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // always run dynamically

type FollowerNotificationParams = {
  params: Promise<{
    currentUserId: string;
  }>;
};

type NotificationResponse = {
  operation: string;
  id: number;
  user_id1: number;
  user_id2: number;
  status: number;
};

// --- Resources SSE ---------------------------------------------------------
// https://michaelangelo.io/blog/server-sent-events
// https://vercel.com/blog/an-introduction-to-streaming-on-the-web
// https://vercel.com/docs/limits/overview#websockets

// --- DB --------------------------------------------------------------------
// Postgres connection with 'pg' library (supports listen/notify out of the box)
// Using one global client for all endpoints
const postgresClient = new Client({
  user: process.env.PGUSERNAME,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432,
  ssl: true,
});

// Connect to postgres client
await postgresClient.connect();

// Listen to the postgres notifications on 'follower_updates' channel
await postgresClient.query('LISTEN follower_updates;');

export async function GET(
  request: Request,
  { params }: FollowerNotificationParams,
): Promise<NextResponse<ReadableStream | { error: string }>> {
  // --- Auth ------------------------------------------------------------------
  // Authentication
  const { user } = await checkAuthentication('/followers');

  // Authorization: Check if the current user id matches the endpoint
  const userEndpoint = Number((await params).currentUserId);
  if (user.id !== userEndpoint) {
    return NextResponse.json({ error: 'Not authorized.', status: 401 });
  }

  // --- SSE -------------------------------------------------------------------
  // Create stream, writer and encoder (utilizing web streams)
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // Clean up if client ends connection
  const { signal } = request;
  signal.addEventListener('abort', () => {
    // Close writer
    writer.close().catch((error) => console.log(error));
    console.log('Follower notification closed on endpoint: ', userEndpoint);

    // After adding one global connection from the server to postgres, closing the postgres client is not required anymore
    // postgresClient.end().catch((error) => console.log(error));
  });

  // Send data to the stream
  function sendNotification(msg: string) {
    writer
      .write(encoder.encode(`data: Event ${msg}\n\n`))
      .catch((error) => console.log(error));
  }

  // Event listener for postgres notifications
  postgresClient.on('notification', (msg) => {
    if (msg.payload) {
      const msgBody: NotificationResponse = JSON.parse(msg.payload);
      if (
        msgBody.user_id1 === userEndpoint ||
        msgBody.user_id2 === userEndpoint
      ) {
        // console.log('Postgres follower_updates notification: ', msgBody);
        sendNotification(
          JSON.stringify({ followerStatusChange: msgBody.operation }),
        );
      }
    }
  });

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
