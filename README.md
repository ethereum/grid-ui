<p align="center">
 <img src="https://user-images.githubusercontent.com/47108/54441038-4094fc80-4712-11e9-835f-f3896a444cbd.png" width="661" />
</p>

<p align="center">
  <a href="https://circleci.com/gh/ethereum/grid-ui"><img src="https://img.shields.io/circleci/project/github/ethereum/grid-ui/master.svg" alt="Build Status"></a>
</p>

# Ethereum Grid

Grid is a desktop application that allows you to securely download, configure and use various clients and tools in the Ethereum ecosystem. Download the [latest version](https://grid.ethereum.org/).

![](https://imgur.com/T3Tt65P.jpg)

See this [introductory post](https://medium.com/ethereum-grid/introducing-ethereum-grid-1e65e7fb771e) to learn more about the motivations behind the project. Release announcements and tutorials are released on the project [Medium publication](https://medium.com/ethereum-grid).

## Development

This repo is the web application hosted by [Grid](https://github.com/ethereum/grid).

### Quick Start

Clone, install dependencies, and start the application:

```
git clone https://github.com/ethereum/grid-ui.git
cd grid-ui
yarn && yarn start
```

This will serve the application at `localhost:3080`, but little can be done without the [Grid](https://github.com/ethereum/grid) electron wrapper:

```
git clone https://github.com/ethereum/grid.git
cd grid
yarn && yarn start:dev
```

### Contributing

There are many ways to get involved with this project. Get started [here](/docs/CONTRIBUTING.md).
