import { Grid } from '../../API'
import { clefStarted, clefStopped } from './actions'

const { clef } = Grid

class ClefService {
  start(dispatch) {
    clef.start()
    dispatch(clefStarted())
    this.removeListeners()
  }

  stop(dispatch) {
    clef.stop()
    dispatch(clefStopped())
    this.createListeners()
  }

  createListeners() {
    clef.on('approveTx', this.approveTx.bind(this))
    clef.on('approveSignData', this.approveSignData.bind(this))
    clef.on('approveListing', this.approveListing.bind(this))
    clef.on('approveNewAccount', this.approveNewAccount.bind(this))
    clef.on('showInfo', this.showInfo.bind(this))
    clef.on('showError', this.showError.bind(this))
    clef.on('onApprovedTx', this.onApprovedTx.bind(this))
    clef.on('onSignerStartup', this.onSignerStartup.bind(this))
    clef.on('onInputRequired', this.onInputRequired.bind(this))
  }

  removeListeners() {
    clef.removeListener('approveTx', this.approveTx)
    clef.removeListener('approveSignData', this.approveSignData)
    clef.removeListener('approveListing', this.approveListing)
    clef.removeListener('approveNewAccount', this.approveNewAccount)
    clef.removeListener('showInfo', this.showInfo)
    clef.removeListener('showError', this.showError)
    clef.removeListener('onApprovedTx', this.onApprovedTx)
    clef.removeListener('onSignerStartup', this.onSignerStartup)
    clef.removeListener('onInputRequired', this.onInputRequired)
  }
}

export default new ClefService()
