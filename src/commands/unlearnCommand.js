const db = require('../db')
const log = require("../log")
const cleanup = require('./cleanup')
const parseOptions = require("./parseOptions")

module.exports.name = 'unlearn'
module.exports.description = 'Unlearn a memorized response.'
module.exports.options = [{
  name: 'command',
  description: 'The command to unlearn a response to.',
  type: 3,
  required: true
}, {
  name: 'number',
  description: 'The response number to unlearn.',
  type: 4,
  required: false
}, {
  name: 'all',
  description: 'Remove all known responses to the command.',
  type: 5,
  required: false
}]

module.exports.handler = async function (client, interaction) {
  let { guild_id, channel_id } = interaction
  let { command, number, all } = parseOptions(interaction, {
    number: 1
  })

  command = command.toLowerCase().trim()

  if (all) {
    let count = await db.remove({
      type: 'response',
      guildId: guild_id,
      command: command
    }, { multi: true })

    if (count > 0) {
      await cleanup(client, interaction)

      await client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: 'Consider them gone.'
          }
        }
      })
    } else {
      await client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: `I don't know that one.`
          }
        }
      })
    }

    return
  }

  let responses = await db.find({
    type: 'response',
    guildId: guild_id,
    channelId: { $in: [null, channel_id] },
    command: command
  })

  if (number > responses.length) {
    await client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: `I don't know that one.`
        }
      }
    })

    return
  }

  let response = responses[number-1]
  log.debug('Removing response', response)
  await db.remove({ _id: response._id })
  await cleanup(client, interaction)

  // TODO: Kick off a cleanup for this guild here, to remove the command itself
  // if that's the last response for this command.

  await client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data: {
        content: 'Consider it gone.'
      }
    }
  })
}