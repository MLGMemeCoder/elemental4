
require("fs").writeFileSync("./.env", `# Web Server
HTTP_PORT=80
HTTPS_PORT=443

HTTPS_KEY=keys/private.key
HTTPS_CERT=keys/certificate.crt

# Rethink DB Server
RETHINK_DB=elem4
RETHINK_HOST=localhost
RETHINK_PORT=28015

# Other
VOTES_TO_ADD_ELEMENT=5
SERVE_MINIFY_BUILD=false

# enter the part, if the url is in this format
# /api/webhooks/<ID>/<TOKEN>
# enter in "<ID>/<TOKEN>"
DISCORD_WEBHOOK_KEY=null

# Enabling/Disabling modules
ENABLE_HTTP=true
ENABLE_HTTPS=false
ENABLE_DATABASE=false
ENABLE_DISCORD_WEBHOOK=false
`);