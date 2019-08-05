import ClientService from './clientService'
import { addPluginError, onConnectionUpdate } from './actions'

class PluginService {
  start(plugin, release, flags, config, dispatch) {
    plugin.start(release, flags, config)
    if (plugin.type === 'client') ClientService.watchForPeers(plugin, dispatch)
  }

  resume(plugin, dispatch) {
    if (plugin.type === 'client') ClientService.watchForPeers(plugin, dispatch)
    dispatch(onConnectionUpdate(plugin.name, plugin.state))

    // `resume` is called for 'STARTED', 'STARTING', and 'CONNECTED' states.
    // If plugin starts as 'CONNECTED', manually trigger `onConnect`.
    if (plugin.state === 'CONNECTED') {
      this.onConnect(plugin, dispatch)
    }
  }

  stop(plugin) {
    plugin.stop()
    this.removeListeners(plugin)
  }

  onConnect(plugin, dispatch) {
    if (plugin.type === 'client') {
      ClientService.startBlockSubscriptions(plugin, dispatch)
    }
  }

  createListeners(plugin, dispatch) {
    this.newStateListener = newState => {
      dispatch(onConnectionUpdate(plugin.name, newState.toUpperCase()))
      if (newState === 'connected') {
        this.onConnect(plugin, dispatch)
      }
    }

    this.pluginErrorListener = error =>
      dispatch(addPluginError(plugin.name, error))

    plugin.on('newState', this.newStateListener)
    plugin.on('pluginError', this.pluginErrorListener)
  }

  removeListeners(plugin) {
    plugin.removeListener('newState', this.newStateListener)
    plugin.removeListener('pluginError', this.pluginErrorListener)
    if (plugin.type === 'client') {
      ClientService.clearPeerCountInterval()
      ClientService.unsubscribeSyncingSubscription(plugin)
      ClientService.unsubscribeNewHeadsSubscription(plugin)
    }
  }
}

export default new PluginService()
