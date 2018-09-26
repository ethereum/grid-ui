import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider } from "react-redux";

import { BrowserRouter as Router } from "react-router-dom";
import App from './App'
import Popup from './Popup'

import store from "./API/ReduxStore";

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

const root = document.getElementById('root')

// retrieve popup name
var urlParams = getUrlVars()
let popupName = urlParams["name"]

switch (urlParams["app"]) {
  case "popup":
    ReactDOM.render(<Provider store={store}><Popup name={popupName} /></Provider>, root)
    break;
  case undefined:
  default:
    ReactDOM.render(
      <Router>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    ,root)
    break;
}