// process everything for production build
const fs = require('fs');
if(!fs.existsSync("./game/views.min/")) {
    fs.mkdirSync("./game/views.min")
}