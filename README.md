# Gondor
A platform for internal tools at Coding Blocks, hosted at https://tools.codingblocks.com.

## Setup

### Installing Dependencies

```bash
yarn
```

### Setting Up Database

Follow the postgresql guidelines, [download](https://www.postgresql.org/download/) an install postgres v9.6.

**Create Database**
```bash
psql -U postgres
> create database gondor;
> \q
```

**Update Env Vars**
```bash
touch .env

#.env
DB_HOST=127.0.0.1 #optional
DB_USERNAME=postgres #or any other postgres username 
DB_NAME=gondor #optional
DB_PASSWORD= #postgres user password if any
```

**Run Migrations**
```bash
yarn sequelize db:migrate
```

### Setting Up OneAuth

This project uses OneAuth as a signle sign on server. For authentication it is required for this project to be running locally.  Please follow the instructions [here](https://github.com/coding-blocks/oneauth) to setup up OneAuth.

Once OneAuth is setup successfully on your system, [create a client application](https://github.com/coding-blocks/oneauth/wiki/Explicit-Authentication) and get the `ONEAUTH_CLIENT_ID` and `ONEAUTH_CLIENT_SECRET` and add it to your `.env`.
```bash
#.env
ONEAUTH_URL=http://localhost:3838 #or any other address where oneauth is running.
ONEAUTH_CLIENT_SECRET=<client_id>
ONEAUTH_CLIENT_SECRET=<client_scret>
```

### Running Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

Take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features.
- [Graphql](https://graphql.org/learn/) - learn graphql specififcation.
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - learn about graphql api server.
- [Apollo Client](https://www.apollographql.com/docs/react) - learn about graphql react client.
- [DataLoader](https://www.youtube.com/watch?v=OQTnXNCDywA) - learn how to fix N+1 query problem.
