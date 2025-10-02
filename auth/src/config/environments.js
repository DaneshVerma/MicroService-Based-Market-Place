const {config} = require('dotenv');
config()

const _config={
    MONGO_URI:process.env.MONGO_URI
}

module.exports = _config