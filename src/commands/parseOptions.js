const defaults = require('defaults')

module.exports = function (interaction, defs = {}) {
  let options = (interaction.data.options || []).reduce((options, option) => {
    options[option.name] = option.value
    return options
  }, {})

  return defaults(options, defs)
}