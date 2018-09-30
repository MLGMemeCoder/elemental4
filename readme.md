# Elemental 4

## Building
The game is seperated onto two parts, server (server folder) and client (game folder). They are almost two seperate
projects, but the server is required to be running for the game to work.

To begin, you will need nodejs installed (with npm), and run `npm i -D`. This installs all dependencies
and all typing files, and the typescript compiler. You may also want to run `npm i -g typescript` to install
TypeScript globally, which lets you run it in the terminal in any project.

### Compiling and Running the Server
The server is contained in the `server` directory, to compile it you can run `npx tsc -p server`, or just
`tsc -p server` if you installed TypeScript globally.

Next, make sure that the client is compiled, *[see Compiling and Running the Client](#Compiling-and-Running-the-Client)*

Afterwards, you can run `node server` and the server will start up and be accessable at [HTTP localhost:8080](http://localhost:8080/),
and a `.data` folder will be generated. You can now work on the client without restarting the server.

If you want to work on the server, you will want to set TypeScript into watch mode, this is done by adding `-w` to
the terminal command (example `npx tsc -p server -w`). Now you can make changes without recompiling, as its done automatically for
you. You only have to Ctrl+C and re-enter `node server` each time to refresh changes.

### Compiling and Running the Client
The server is contained in the `game` directory, to compile it you can run `npx tsc -p game`, or just
`tsc -p game` if you installed TypeScript globally.

Afterwards, you can run the server program, and then the game will be accessable at [HTTP localhost:8080](http://localhost:8080/).

If you want to work on the client, you will want to set TypeScript into watch mode, this is done by adding `-w` to
the terminal command (example `npx tsc -p game -w`). Now you can make changes without recompiling, as its done automatically for
you. You only have to refresh the page to refresh changes.
