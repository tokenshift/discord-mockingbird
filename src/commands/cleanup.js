const client = require('../client')
const db = require('../db')
const log = require('../log')

/**
 * Cleans up "orphan" dynamic commands for a guild--i.e. any defined commands
 * that don't have any memorized responses any more.
 */
module.exports = async function (client, interaction) {
  let commands = await client.api
    .applications(client.user.id)
    .guilds(interaction.guild_id)
    .commands.get()

  for (let command of commands) {
    let count = await db.count({
      type: 'response',
      guildId: interaction.guild_id,
      command: command.name
    })

    log.debug(`Deleting "${command.name}" command`, {
      command: command,
      guildId: interaction.guild_id
    })

    if (count == 0) {
      await client.api
        .applications(client.user.id)
        .guilds(interaction.guild_id)
        .commands(command.id)
        .delete()
    }
  }
}