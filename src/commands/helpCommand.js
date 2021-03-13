module.exports.name = 'help'
module.exports.description = 'Display Mockingbird help.'

module.exports.handler = async function (client, interaction) {
  await client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data: {
        embeds: [{
          title: 'Mockingbird Help',
          description: require('./helpText.json')
        }]
      }
    }
  })
}