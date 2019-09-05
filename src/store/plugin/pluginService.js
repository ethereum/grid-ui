import ClientService from './clientService'
import { addPluginError, onConnectionUpdate, setAppBadges } from './actions'

class PluginService {
  async start(plugin, release, flags, config) {
    await plugin.start(release, flags, config)
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
      ClientService.watchForPeers(plugin, dispatch)
      ClientService.startBlockSubscriptions(plugin, dispatch)
    }
  }

  createListeners(plugin, dispatch) {
    this.newStateListener = newState => {
      dispatch(onConnectionUpdate(plugin.name, newState.toUpperCase()))
      if (newState === 'connected') {
        this.onConnect(plugin, dispatch)
      } else if (newState === 'stopping') {
        if (plugin.type === 'client') {
          ClientService.clearPeerCountInterval()
        }
      }
    }

    this.pluginErrorListener = error =>
      dispatch(addPluginError(plugin.name, error))

    this.setAppBadgeListener = ({ appId, count }) =>
      dispatch(setAppBadges(plugin, { [appId]: count }))

    plugin.on('newState', this.newStateListener)
    plugin.on('pluginError', this.pluginErrorListener)
    plugin.on('setAppBadge', this.setAppBadgeListener)
  }

  removeListeners(plugin) {
    plugin.removeListener('newState', this.newStateListener)
    plugin.removeListener('pluginError', this.pluginErrorListener)
    plugin.removeListener('setAppBadge', this.setAppBadgeListener)
    if (plugin.type === 'client') {
      ClientService.clearPeerCountInterval()
      ClientService.clearSyncingInterval(plugin)
      ClientService.unsubscribeNewHeadsSubscription(plugin)
    }
  }
}

export default new PluginService()
