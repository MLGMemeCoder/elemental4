# breakdown of code

# server
## index.ts
Entry point, starts up all services.
## api/*.ts
Folder containing all API versions
Handling /api/*
## constants.ts
Handles configuration and constants
## documentation.ts
Handles compling markdown documentation
## element.ts
Handles game data with the database
## server.ts
Handles HTTP Stuff

# shared
## api-1-types.ts
Type information about API returns.
## shared.ts
Utility code both sides can use.
