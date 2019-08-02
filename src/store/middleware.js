import { Grid } from '../API'

// eslint-disable-next-line
export const saveSettings = store => next => async action => {
  if (action.type === 'PLUGIN:SET_CONFIG') {
    const settings = Grid.Config.getItem('settings')
    const newSettings = Object.assign({}, settings)
    newSettings[action.payload.clientName] = action.payload.config
    Grid.Config.setItem('settings', newSettings)
  }

  if (action.type === 'PLUGIN:SET_FLAGS') {
    const flags = Grid.Config.getItem('flags')
    const newFlags = Object.assign({}, flags)
    newFlags[action.payload.clientName] = action.payload.flags
    Grid.Config.setItem('flags', newFlags)
  }

  if (action.type === 'PLUGIN:SELECT') {
    const settings = Grid.Config.getItem('settings')
    const newSettings = Object.assign({}, settings)
    newSettings.selected = action.payload.clientName
    Grid.Config.setItem('settings', newSettings)
  }

  if (action.type === 'PLUGIN:SELECT_TAB') {
    const settings = Grid.Config.getItem('settings')
    const newSettings = Object.assign({}, settings, {
      selectedTab: action.payload.tab
    })
    Grid.Config.setItem('settings', newSettings)
  }

  return next(action)
}
