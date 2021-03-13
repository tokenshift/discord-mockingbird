require('dotenv').config()

const client = require('./client')

client.login(process.env.DISCORD_BOT_TOKEN);