import Clef from './clefService'
import { Mist } from '../../API'

export const selectRequest = index => {
  return {
    type: '[REQUESTS]:QUEUE:SELECT_REQUEST',
    payload: { index }
  }
}

export const addRequest = (data, client) => {
  return async (dispatch, getState) => {
    const request = { ...data, client }
    Clef.notifyRequest(request)
    // Remove unneeded jsonrpc value
    // if (request.jsonrpc) {
    //   delete request.jsonrpc
    // }
    dispatch({
      type: '[REQUESTS]:QUEUE:ADD_REQUEST',
      payload: { request }
    })
    const { queue } = getState().requests
    // If request is ui_onInputRequired, priortize its selection
    if (request.method === 'ui_onInputRequired') {
      dispatch(selectRequest(queue.length - 1))
    }
  }
}

export const requestDone = id => {
  return async (dispatch, getState) => {
    const { requests } = getState()
    const { selectedIndex } = requests
    let nextSelected = selectedIndex - 1
    if (nextSelected < 0) {
      nextSelected = 0
    }
    dispatch({
      type: '[REQUESTS]:QUEUE:REQUEST_DONE',
      payload: { id, nextSelected }
    })
  }
}

export const addNotification = notification => {
  Clef.notifyNotification(notification)
  return {
    type: '[REQUESTS]:NOTIFICATIONS:ADD',
    payload: { notification }
  }
}

export const clearNotification = index => {
  return {
    type: '[REQUESTS]:NOTIFICATIONS:CLEAR',
    payload: { index }
  }
}

const onClientRequest = (data, client, dispatch) => {
  dispatch(addRequest(data, client.name))
}

const onClientNotification = (data, client, dispatch) => {
  const type = data.method === 'ui_showError' ? 'error' : 'info'
  let { text } = data.params[0]
  const { info } = data.params[0]
  if (data.method === 'ui_onSignerStartup') {
    const httpAddress = info.extapi_http
    const ipcAddress = info.extapi_ipc
    text = 'Clef signer started on '
    if (httpAddress !== 'n/a') {
      text += ` ${httpAddress}`
    }
    if (ipcAddress !== 'n/a') {
      text += ` ${ipcAddress}`
    }
  }
  const notification = { type, text, info, client: client.name }
  dispatch(addNotification(notification))
}

export function createListeners(client, dispatch) {
  client.on('request', data => onClientRequest(data, client, dispatch))
  client.on('notification', data =>
    onClientNotification(data, client, dispatch)
  )
}

export function removeListeners(client) {
  client.removeAllListeners('request')
  client.removeAllListeners('notification')
}
