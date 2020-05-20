# Gondor

A platform for internal tools at Coding Blocks, hosted at https://tools.codingblocks.com. This project is part of boss, please check for [issues here](https://github.com/coding-blocks/gondor/labels/BOSS). For any queries regarding setup or contribution, feel free to join [discord](https://discord.gg/wNFXjh) and post in #gondor channel.

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

This project uses OneAuth as a single sign on server. For authentication it is required for OneAuth to be either running locally or to have a client application created [here](https://account.codingblocks.com/users/me/clients).

(optional) Please follow the instructions [here](https://github.com/coding-blocks/oneauth) to setup up OneAuth locally.


### Setup SymLinks(Symbolic Links) for Windows


**Create Symbolic Links Using Command Prompt**
Note: though I’m showing this in Windows 10, the commands shown here are applicable to Windows Vista and up.

**Step-1:**
To start, press “Win + X,” and then select the option “Command Prompt (Admin)” to open the Command Prompt with admin rights.


![Command Prompt (Admin)](https://www.maketecheasier.com/assets/uploads/2017/01/create-symlinks-win10-select-command-prompt.jpg.webp)

**Step-2:**
Use the below command format to create a symlink for a file.


```
mklink Link Target
```

**Step-3:**
In my case, I want to create a symlink in the E drive for a text file located on the F drive, so the command looks something like this.


```
mklink "E:\Path\Symlink_File.txt" "F:\Real_File.txt"
```

![](https://www.maketecheasier.com/assets/uploads/2017/01/create-symlinks-win10-for-files.jpg.webp)


**Step-4:**
This path is called a “Link.” The second path belongs to the actual file on your disk and is called “Target.”
Once the symlink has been created, this is how it looks in the File Explorer. Though the icon looks like a regular shortcut, it is a symlink.


![](https://www.maketecheasier.com/assets/uploads/2017/01/create-symlinks-win10-symlink-for-file-created.jpg.webp)


**Step-5:**
Along with individual files, you can create symlinks for entire directories. To do that, use the below command. The switch /D allows you create a symlink for a directory or folder.


```
mklink /D "E:\Path\Symlink_Books" "F:\Books"
```


![](https://www.maketecheasier.com/assets/uploads/2017/01/create-symlinks-win10-for-folders.jpg.webp)


**Step-6:**
As soon as you execute the command, the symlink will be created for the target directory. You can use it to access all the files and folders inside the real folder. If you ever want to, you can delete the symbolic link like any other file or folder. Just select the symlink and press the delete key on your keyboard and you are good to go.


![](https://www.maketecheasier.com/assets/uploads/2017/01/create-symlinks-win10-symlink-for-folder-created.jpg.webp)


It is that simple to create symbolic links in Windows 10.



**Config for OneAuth Client App**

```
domain = http://localhost:3000
default url = http://localhost:3000
callback url = http://localhost:3000/api/login/callback
```

If you have setup OneAuth locally, then [create a client application](https://github.com/coding-blocks/oneauth/wiki/Explicit-Authentication), get the `ONEAUTH_CLIENT_ID` & `ONEAUTH_CLIENT_SECRET` and add it to your `.env`.

Otherwise, similarly create a client application for authentication [here](https://account.codingblocks.com/users/me/clients), get the `ONEAUTH_CLIENT_ID` & `ONEAUTH_CLIENT_SECRET` and add it to your `.env`.

**Add Env Vars**

```bash
#.env
ONEAUTH_URL=http://localhost:3838 #include only if oneauth setup locally
ONEAUTH_CLIENT_ID=<client_id>
ONEAUTH_CLIENT_SECRET=<client_scret>
```

### Running Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

There are multiple tools used to make developer experience smooth. You can suggest your ideas in form of issues.

### Seed Users

If you don't have a local OneAuth setup and want to seed database with random users, you can use the command below. The caveat is that you won't be able to login through their accounts. But you may impersonate them using your own account *(admin role required)*.
```bash
npx babel-node api/bin/seedUsers.js
```

### Update User Role

Applications has 3 user roles with different [AuthorizationPolicy](https://github.com/coding-blocks/gondor/blob/master/api/services/AuthorizationPolicy/index.js) attached to them. Due to missing user management feature in the UI, use the following script to update the role of any user.
```bash
 npx babel-node api/bin/updateRole <username> <role(Admin, Member, User)>
```

### Impersonate User

During local development setup, it takes a lot of time to login and log out of different user profile for testing various features. To solve this problem there exists the impersonate user functionality.

If your logged in user is an Admin, you can add a cookie named `iuid` with the value of any other user's id. On reload you will be logged in as the other user. Removing the cookie and reloading will login you back as the original user.

The same functionality can be used for debugging on production.

## Learn More

Take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features.
- [Graphql](https://graphql.org/learn/) - learn graphql specification.
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - learn about graphql api server.
- [Apollo Client](https://www.apollographql.com/docs/react) - learn about graphql react client.
- [DataLoader](https://www.youtube.com/watch?v=OQTnXNCDywA) - learn how to fix N+1 query problem.
- [ReactStrap](https://reactstrap.github.io/) - learn bootstrap components for react.
