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
  }

  onConnect(plugin, dispatch) {
    if (plugin.type === 'client') {
      ClientService.watchForPeers(plugin, dispatch)
      ClientService.startBlockSubscriptions(plugin, dispatch)
    }
  }

  newStateListener = (plugin, dispatch) => newState => {
    dispatch(onConnectionUpdate(plugin.name, newState.toUpperCase()))
    switch (newState) {
      case 'connected':
        this.onConnect(plugin, dispatch)
        break
      case 'stopping':
        this.removeListeners(plugin)
        break
      default:
        break
    }
  }

  pluginErrorListener = (plugin, dispatch) => error => {
    dispatch(addPluginError(plugin.name, error))
  }

  setAppBadgeListener = (plugin, dispatch) => ({ appId, count }) => {
    dispatch(setAppBadges(plugin, { [appId]: count }))
  }

  createListeners(plugin, dispatch) {
    plugin.on('newState', this.newStateListener(plugin, dispatch))
    plugin.on('pluginError', this.pluginErrorListener(plugin, dispatch))
    plugin.on('setAppBadge', this.setAppBadgeListener(plugin, dispatch))
  }

  removeListeners(plugin) {
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
