const db = require('../db')
const log = require('../log')
const parseOptions = require('./parseOptions')

module.exports.name = 'list'
module.exports.description = 'List all known responses to a command.'
module.exports.options = [{
  name: 'command',
  description: 'The command to list responses for.',
  type: 3,
  required: true
}]

module.exports.handler = async function (client, interaction) {
  log.debug('listCommand', interaction)

  let { guild_id, channel_id } = interaction
  let { command } = parseOptions(interaction)
  command = command.toLowerCase().trim()

  let responses = await db.find({
    type: 'response',
    guildId: guild_id,
    channelId: { $in: [null, channel_id] },
    command: command
  })

  if (responses.length == 0) {
    await client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: `I don't know that one.`
        }
      }
    })
  } else {
    let responseList = responses.map((res, i) => `${i+1}: ${res.response}`)

    await client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: responseList.join('\n')
        }
      }
    })
  }
}