import React, { Component } from 'react'

import { i18n } from '../API'

import iconPath from '../icons/icon.png'

class UpdateAvailable extends Component {
  render() {
    const appIconPath = iconPath
    const mode = 'mist'

    const restart = false

    // from Session data object:
    const name = '[name]'
    const version = '[version]'
    const downloadUrl = '[download url]'
    const checksum = '[checksum]'

    return (
      <div className="popup-windows update-available row">
        <div className="col col-3">
          <img
            alt="app icon"
            className={`left-overlay ${mode}`}
            src={appIconPath}
          />
        </div>
        <div className="col col-8 text">
          <h1>
            {i18n.t('mist.popupWindows.updateAvailable.newVersionAvailable', {
              name,
              version
            })}
          </h1>
          <div>
            <br />
            <ul className="no-bullets">
              <li>
                {i18n.t('mist.popupWindows.updateAvailable.version')}:{' '}
                <strong> {version} </strong>
              </li>
              <li>
                {i18n.t('mist.popupWindows.updateAvailable.downloadURL')}:{' '}
                <strong> {downloadUrl}</strong>
              </li>
              <li>
                {i18n.t('mist.popupWindows.updateAvailable.checksum')}:{' '}
                <strong> {checksum} </strong>
              </li>
            </ul>
          </div>
        </div>
        <footer>
          <div className="dapp-modal-buttons">
            <button className="cancel" type="button">
              {i18n.t('mist.popupWindows.updateAvailable.skipUpdate')}
            </button>
            <button className="ok dapp-primary-button">
              {restart
                ? i18n.t('mist.popupWindows.updateAvailable.downloadAndRestart')
                : i18n.t('mist.popupWindows.updateAvailable.download')}
            </button>
          </div>
        </footer>
      </div>
    )
  }
}

export default UpdateAvailable
