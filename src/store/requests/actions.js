import Clef from './clefService'

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

export function createRequestListeners(client, dispatch) {
  client.on('request', data => onClientRequest(data, client, dispatch))
  client.on('signerNotification', data =>
    onClientNotification(data, client, dispatch)
  )
}

export function removeRequestListeners(client) {
  client.removeAllListeners('request')
  client.removeAllListeners('signerNotification')
}

export function clearRequests(client) {
  return async (dispatch, getState) => {
    const queue = getState().requests.queue.filter(
      r => r.client === client.name
    )
    if (queue.length === 0) {
      return
    }
    dispatch({
      type: '[REQUESTS]:QUEUE:CLEAR',
      payload: { clientName: client.name }
    })
  }
}

export function clearRequestNotifications(client) {
  return async (dispatch, getState) => {
    const notifications = getState().requests.notifications.filter(
      n => n.client === client.name
    )
    if (notifications.length === 0) {
      return
    }
    dispatch({
      type: '[REQUESTS]:NOTIFICATIONS:CLEAR_ALL',
      payload: { clientName: client.name }
    })
  }
}
