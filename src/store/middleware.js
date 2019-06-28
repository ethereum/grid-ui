import { Grid } from '../API'

// eslint-disable-next-line
export const saveSettings = store => next => async action => {
  if (action.type === 'CLIENT:SET_CONFIG') {
    const settings = await Grid.Config.getItem('settings')
    const newSettings = Object.assign({}, settings)
    newSettings[action.payload.clientName] = action.payload.config
    await Grid.Config.setItem('settings', newSettings)
  }

  return next(action)
}
