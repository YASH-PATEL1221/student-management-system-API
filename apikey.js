const crypto = require("crypto");

let mykey = crypto.createHash("sha256").update("1").digest("hex");

function GetApiKey(){
    return mykey;
}

module.exports = GetApiKey;