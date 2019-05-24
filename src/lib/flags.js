export const generateFlags = (userConfig, nodeSettings) => {
  if (!Array.isArray(nodeSettings)) throw 'Settings must be an Array instance'
  const userConfigEntries = Object.keys(userConfig)
  let flags = []

  userConfigEntries.map(entry => {
    let flag
    let configEntry = nodeSettings.find(setting => setting.id === entry)
    let flagString = configEntry.flag

    if (flagString) {
      flag = flagString.replace(/%s/, userConfig[entry]).split(' ')
    } else if (configEntry.options) {
      const options = configEntry.options
      const selectedOption = options.find(
        option =>
          userConfig[entry] === option.value || userConfig[entry] === option
      )
      if (typeof selectedOption['flag'] !== 'string') {
        throw `Option "${selectedOption.value ||
          selectedOption}" must have the "flag" key`
      }
      flag = selectedOption.flag.replace(/%s/, userConfig[entry]).split(' ')
    } else {
      throw `Config entry "${entry}" must have the "flag" key`
    }
    flags = flags.concat(flag)
  })

  return flags.filter(flag => flag.length > 0)
}
