import React, { Component } from 'react'
import "../normalize.css"

import DappItem from './DappItem'

export default class DappOverview extends Component {
  constructor(props) {
    super(props)
  }
  render(){
    let suggested = [
      {
        name: 'Crypto Kitties',
        banner: 'https://www.cryptokitties.co/images/kitty-eth.svg',
        description: 'Lorem Ipsum dolor amet sun Lorem Ipsum dolor amet sun Lorem Ipsum dolor amet sun',
        url: 'https://www.cryptokitties.co/'
      }
    ]
    return (
      <main className="dapps">
        <h1><strong>Dapps</strong> Overview</h1>

        <h2>Connected</h2>
        <section className="card-container dapps">
        </section>

        <h2>Suggested</h2>
        <section className="card-container dapps">
        {
          suggested.map(dapp => {
            return <DappItem dapp={dapp}></DappItem>
          })
        }
        </section>
      </main>
    )
  }
}