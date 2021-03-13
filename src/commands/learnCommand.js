const db = require('../db')
const parseOptions = require("./parseOptions")

module.exports.name = 'learn'
module.exports.description = 'Learn a new command and response.'
module.exports.options = [{
  name: 'command',
  description: 'The command to respond to.',
  type: 3,
  required: true
}, {
  name: 'response',
  description: 'The response to memorize.',
  type: 3,
  required: true
}, {
  name: 'channel',
  description: 'Whether the response should only be memorized in this channel.',
  type: 5,
  required: false
}]

module.exports.handler = async function (client, interaction) {
  let { command, response, channel } = parseOptions(interaction, {
    channel: false
  })

  command = command.toLowerCase().trim()
  response = response.trim()
  let channelId = channel ? interaction.channel_id : null

  // Can't override the `help`, `learn`, `list`, or `unlearn` commands.
  const protectedCommands = [
    'help',
    'learn',
    'list',
    'unlearn',
  ]

  if (protectedCommands.includes(command)) {
    await client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: `I'm afraid I can't do that, Dave. "${command}" is a built-in command.`
        }
      }
    })

    return
  }

  // Record the new response in the database.
  await db.insert({
    type: 'response',
    guildId: interaction.guild_id,
    channelId,
    command,
    response
  })

  // Add the (maybe) new command to the guild.
  await client.api.applications(client.user.id).guilds(interaction.guild_id).commands.post({
    data: {
        name: command,
        description: `Hey Mockingbird, "${command}!"`,
        options: [{
          name: 'number',
          description: 'Specific response number to use.',
          type: 4,
          required: false
        }]
    }
  })

  // Acknowledge the command.
  await client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data: {
        content: `Learned "${command}".`
      }
    }
  })
}