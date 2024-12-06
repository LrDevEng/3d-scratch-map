# Terra Scratch

Terra Scratch is not only a travel diary application. It is a social community of travel enthusiast journaling about their feelings, experiences and adventures while exploring our beautiful planet.

Join the community today. Scratch countries you have visited off the map by creating journeys and diaries. Upload your best images and keep your memories forever. Share those valuable moments with your friends or follow them on their journeys.

In combination with its stunning 3D map of the earth, Terra Scratch offers a truly unique journaling experience.

Bon voyage.

## Technologies

- Next.js
- Node.js
- PostgreSQL
- TypeScript/JavaScript
- HTML/CSS
- Tailwind CSS
- Google Gemini
- RESTful APIs
- Cloudinary API
- Server Sent Events (SSE)
  - PostgreSQL's LISTEN/NOTIFY design pattern
  - EventSource
- Jest
- Playwright
- drawSQL

### 3D Technologies

- [three.js](https://threejs.org/)
- [react-three/fiber](https://docs.pmnd.rs/) (r3f)
- [react-three/drei](https://docs.pmnd.rs/)
- [three-conic-polygon-geometry](https://github.com/vasturiano/three-conic-polygon-geometry)
- [three-geojson-geometry](https://github.com/vasturiano/three-geojson-geometry)

## Impressions

Check out the deployed version here: https://terra-scratch.vercel.app/

Database design: https://drawsql.app/teams/myteam-1160/diagrams/finalproject

### Landing page

![final-project-screenshot-07](https://github.com/user-attachments/assets/5d1ae419-a14c-42ba-874b-227ccd5c33f8)

### Interactive 3D globe

![final-project-screenshot-01](https://github.com/user-attachments/assets/18d2575a-7028-4b77-9656-91887811c8fc)

### Journey form

![final-project-screenshot-04](https://github.com/user-attachments/assets/b42bad19-c8aa-4d2c-9e4b-5aa134e322b9)

### Created journey

![final-project-screenshot-02](https://github.com/user-attachments/assets/2625dca8-d901-4a82-87ff-5be8cbdb2dc9)

### Created diary

![final-project-screenshot-03](https://github.com/user-attachments/assets/ddbacd29-c48e-4296-a4a8-8c36c365967a)

### Follower overview

![final-project-screenshot-06](https://github.com/user-attachments/assets/8e284845-809d-4a3c-9bb4-b0ebc5cf0b3e)

### User profile

![final-project-screenshot-05](https://github.com/user-attachments/assets/a99c01bf-21ee-4331-81e3-4c1c90638755)

## Getting started (locally)

Clone the main branch of this repository to your local machine and navigate into the cloned project folder.

### Install dependencies using pnpm

Open a CLI in the project folder and run:

```bash
pnpm install
```

### Start database

Setup the database as mentioned below. To start the database run:

```bash
postgres
```

### Populate database

The database is populated with migrations (using the ley library, which is a dependency of this project). Run the following command to populate the database:

```bash
pnpm migrate up
```

### Run local development server

You can start a local development version of the project on 'localhost:3000' by running the following command. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```bash
pnpm dev
```

## Database Setup

If you don't have PostgreSQL installed yet, follow the instructions from the PostgreSQL step in [UpLeveled's System Setup Instructions](https://github.com/upleveled/system-setup/blob/master/readme.md).

Copy the `.env.example` file to a new file called `.env` (ignored from Git) and fill in the necessary information.

Then, connect to the built-in `postgres` database as administrator in order to create the database:

### Windows

If it asks for a password, use `postgres`.

```bash
psql -U postgres
```

### macOS

```bash
psql postgres
```

### Linux

```bash
sudo -u postgres psql
```

Once you have connected, run the following to create the database:

```sql
CREATE DATABASE <database name>;
CREATE USER <user name> WITH ENCRYPTED PASSWORD '<user password>';
GRANT ALL PRIVILEGES ON DATABASE <database name> TO <user name>;
\connect <database name>
CREATE SCHEMA <schema name> AUTHORIZATION <user name>;
```

Quit `psql` using the following command:

```bash
\q
```

On Linux, it is [best practice to create an operating system user for each database](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_and_using_database_servers/using-postgresql_configuring-and-using-database-servers#con_postgresql-users_using-postgresql), to ensure that the operating system user can only access the single database and no other system resources. A different password is needed on Linux because [passwords of operating system users cannot contain the user name](https://github.com/upleveled/system-setup/issues/74). First, generate a random password and copy it:

```bash
openssl rand -hex 16
```

Then create the user, using the database user name from the previous section above. When you are prompted to create a password for the user, paste in the generated password.

```bash
sudo adduser <user name>
```

Once you're ready to use the new user, reconnect using the following command.

**Windows and macOS:**

```bash
psql -U <user name> <database name>
```

**Linux:**

```bash
sudo -u <user name> psql -U <user name> <database name>
```

## Testing

To execute tests install jest for unit testing and playwright for integration testing and run the following commands in your CLI.

### Jest

```bash
pnpm jest
```

### Playwright

```bash
pnpm exec playwright test
pnpm exec playwright test --ui
```
