import React, { Component } from 'react'

import {i18n} from '../API'

import iconPath from '../icons/icon.png'

class UpdateAvailable extends Component {
  constructor(){
    super()
  }
  render() {
    let appIconPath = iconPath
    let mode = 'mist'

    let restart = false

    // from Session data object:
    let name = '[name]'
    let version = '[version]'
    let downloadUrl = '[download url]'
    let checksum = '[checksum]'

    return (
      <div className="popup-windows update-available row">
        <div className="col col-3">
          <img className={"left-overlay" + mode} src={appIconPath} />
        </div>
        <div className="col col-8 text">
          <h1>
          {i18n.t("mist.popupWindows.updateAvailable.newVersionAvailable", {
            name: name,
            version: version
          })}
          </h1>
          <p>
            <br />
            <ul className="no-bullets">
              <li>{i18n.t("mist.popupWindows.updateAvailable.version")}: <strong> {version} </strong></li>
              <li>{i18n.t("mist.popupWindows.updateAvailable.downloadURL")}: <strong> {downloadUrl}</strong></li>
              <li>{i18n.t("mist.popupWindows.updateAvailable.checksum")}: <strong> {checksum} </strong></li>
            </ul>
          </p>
        </div>
        <footer>
          <div class="dapp-modal-buttons">
            <button class="cancel" type="button">
              {i18n.t("mist.popupWindows.updateAvailable.skipUpdate")}
            </button>
            <button class="ok dapp-primary-button">
              {restart
              ? i18n.t("mist.popupWindows.updateAvailable.downloadAndRestart")
              : i18n.t("mist.popupWindows.updateAvailable.download")
              }
            </button>
          </div>
        </footer>
      </div>
    )
  }
}

export default UpdateAvailable