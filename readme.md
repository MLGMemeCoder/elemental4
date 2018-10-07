# Elemental 4

## Building
The game is seperated onto two parts, server (server folder) and client (game folder). They are almost two seperate
projects, but the server is required to be running for the game to work.

To begin, you will need nodejs installed (with npm), and run `npm i -D`. This installs all dependencies
and all typing files, and the typescript compiler.

### Setting up RethinkDB
Download an install a [RethinkDB Database Server](https://rethinkdb.com) and have it running. If you change
the port it is hosted on you need to update the `.env` file.

### Generating self signed SSL certificate
In order to run the HTTPS server, you need to generate a certificate.

- **If on windows:** Install git if it is not already installed, and open a git bash.
- **If on mac or linux:** Install openssh if it is not already installed

- Run `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout keys/private.key -out keys/certificate.crt`

This will generate the `private.key` and the `certificate.crt` files, and in the same place the `.env` file
points to.

### Compiling the Client
The client is contained in the `game` directory, to compile it you can run `npx webpack`.

If you want to work on the client, you will want to set Webpack into watch mode, this is done by adding `-w` to
the terminal command (example `npx webpack -w`). Now you can make changes without recompiling, as its done automatically for
you. You only have to refresh the page to refresh changes.

### Compiling and Running the Server
The server is contained in the `server` directory, to compile it you can run `npx tsc -p server`.

Next, make sure that the client is compiled, *[see Compiling and Running the Client](#Compiling-and-Running-the-Client)*

Afterwards, you can run `node .` and the server will start up and be accessable at [HTTP localhost:80](http://localhost:80/), or [HTTPS localhost:443](https://localhost:443/).

If you want to work on the server, you will want to set TypeScript into watch mode, this is done by adding `-w` to
the terminal command (example `npx tsc -p server -w`). Now you can make changes without recompiling, as its done automatically for
you. You only have to Ctrl+C and re-enter `node .` each time to refresh changes.
