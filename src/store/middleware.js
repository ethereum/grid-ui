import { Grid } from '../API'

// eslint-disable-next-line
export const saveSettings = store => next => async action => {
  if (action.type === 'CLIENT:SET_CONFIG') {
    const settings = await Grid.Config.getItem('settings')
    settings[action.payload.clientName] = action.payload.config
    await Grid.Config.setItem('settings', settings)
  }

  return next(action)
}
