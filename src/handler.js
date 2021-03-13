const client = require('./client')
const commands = require('./commands')
const log = require('./log')

async function handler (interaction) {
  let { id, name, args } = interaction.data
  name = name.toLowerCase()

  const command = commands[name]

  log.info(`Processing "${name}" command`, {
    command: {
      id,
      name,
      args
    }
  })

  if (command) {
    await command.handler(client, interaction)
  } else {
    commands.dynamic.handler(client, interaction)
  }
}

module.exports = handler