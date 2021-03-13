const db = require('../db')
const log = require("../log")
const parseOptions = require("./parseOptions")

module.exports.handler = async function (client, interaction) {
  let { guild_id, channel_id, data: { name } } = interaction
  let { number } = parseOptions(interaction)
  name = name.toLowerCase().trim()

  let responses = await db.find({
    type: 'response',
    guildId: guild_id,
    channelId: { $in: [null, channel_id] },
    command: name
  }).sort({added: 1, response: 1, command: 1})

  let index
  if (number) {
    index = number - 1
  } else {
    index = Math.floor(Math.random() * responses.length)
  }

  if (index >= responses.length) {
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

  let response = responses[index]

  await client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data: {
        content: response.response
      }
    }
  })
}