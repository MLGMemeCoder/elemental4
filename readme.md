# Elemental 5
Elemental 5 is a fan made recreation of [Elemental 4](https://elemental.davecode.me/). Elemental 4 was shut down, so I'm thinking of making elemental 5. Since people mainly create elements by merging with themselves, I will start with "It's time to stop" and you can only merge that with itself!

## Building
The game is seperated onto two parts, server (server folder) and client (game folder). They are almost two seperate
projects, but the server is required to be running for the game to work.

To begin, you will need nodejs installed (with npm), and run `npm i -D`. This installs all dependencies
and all typing files, and the typescript compiler.

### Setting up RethinkDB
Download an install a [RethinkDB Database Server](https://rethinkdb.com) and have it running. If you change
the port it is hosted on you need to update the `.env` file.

### Generating self signed SSL certificate
In order to run the HTTPS server, you need to generate a certificate. **If you want to run the production version on an actual domain, you must aquire one, not generate your own. This can be done with a tool like [Let's Encrypt](https://letsencrypt.org/).**

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

### Things you may want to change to run Elemental 4
- [This part of constants.ts references the domain it's running on, which you will need to change](https://github.com/imdaveead/elemental4/blob/24867fff7d88a385230298e9bc7949584ee01f04/server/constants.ts#L57)
- To get google authentication working you will need to set that up, and put the client ID in [this file](https://github.com/imdaveead/elemental4/blob/ee92fa292f29d16f423cdd833ceac3893e594ced/server/googleapi.ts#L3).
- The "vote threshold" in the `.env` file.
