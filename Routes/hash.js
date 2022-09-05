const bcryptjs = require("bcryptjs");

module.exports = function(password){
    const hash = bcryptjs.hashSync(password,10);
    console.log(hash);
    return hash;
}