export const initialState = {
  queue: [],
  selectedIndex: 0,
  notifications: []
}

const requests = (state = initialState, action) => {
  switch (action.type) {
    case '[REQUESTS]:QUEUE:ADD_REQUEST': {
      const { request } = action.payload
      const queue = [...state.queue, request]
      const newState = {
        ...state,
        queue
      }
      return newState
    }
    case '[REQUESTS]:QUEUE:SELECT_REQUEST': {
      const { index } = action.payload
      const newState = {
        ...state,
        selectedIndex: index
      }
      return newState
    }
    case '[REQUESTS]:QUEUE:REQUEST_DONE': {
      const { id, nextSelected } = action.payload
      const newState = {
        ...state,
        selectedIndex: nextSelected,
        queue: state.queue.filter(request => request.id !== id)
      }
      return newState
    }
    case '[REQUESTS]:NOTIFICATIONS:ADD': {
      const { notification } = action.payload
      const notifications = [...state.notifications, notification]
      const newState = {
        ...state,
        notifications
      }
      return newState
    }
    case '[REQUESTS]:NOTIFICATIONS:CLEAR': {
      const { index } = action.payload
      const newState = {
        ...state,
        notifications: state.notifications.filter(
          (n, nIndex) => nIndex !== index
        )
      }
      return newState
    }
    default:
      return state
  }
}

export default requests
