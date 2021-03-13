require('dotenv').config()

const discord = require('discord.js')

const commands = require('./commands')
const log = require('./log')

const client = new discord.Client()

client.on('error', (err) => {
  log.error(`Error: ${err}`, { error: err })
})

client.on('ready', async () => {
  log.info(`Logged in as ${client.user.tag}`, {
    user: client.user.tag
  })

  for (const command of Object.values(commands)) {
    if (command.name == null) {
      continue
    }

    log.debug(`Registering command "${command.name}"`)
    client.api.applications(client.user.id).commands.post({
      data: {
          name: command.name,
          description: command.description,
          options: command.options
      }
    })
  }

  client.ws.on('INTERACTION_CREATE', require('./handler'))

  await client.user.setActivity('/help', { type: 'WATCHING' })
})

module.exports = client