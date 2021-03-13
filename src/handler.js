const client = require('./client')
const commands = require('./commands')
const parseOptions = require('./commands/parseOptions')
const log = require('./log')

async function handler (interaction) {
  let { id, name } = interaction.data

  name = name.toLowerCase()

  const command = commands[name]

  log.info(`Processing "${name}" command`, {
    command: interaction.data
  })

  if (command) {
    await command.handler(client, interaction)
  } else {
    commands.dynamic.handler(client, interaction)
  }
}

module.exports = handler