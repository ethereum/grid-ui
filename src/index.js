import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import App from './App'
import Popup from './Popup'

// see https://github.com/facebook/create-react-app/issues/1084#issuecomment-273272872
// Copied from http:jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
function getUrlVars() {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

var urlParams = getUrlVars()

function renderPopup(name) {
  ReactDOM.render(<Popup name={name}/>, document.getElementById('root'))
}

switch (urlParams["app"]) {
  case "popup":
    renderPopup(urlParams["name"])
    break;
  case undefined:
  default:
    ReactDOM.render(<App />, document.getElementById('root'))
    break;
}
