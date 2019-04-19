<p align="center">
 <img src="https://user-images.githubusercontent.com/47108/54441038-4094fc80-4712-11e9-835f-f3896a444cbd.png" width="661" />
</p>

<p align="center">
  <a href="https://circleci.com/gh/ethereum/grid-ui"><img src="https://img.shields.io/circleci/project/github/ethereum/grid-ui/master.svg" alt="Build Status"></a>
</p>

## Grid UI

[![ethpkg status](http://api.ethpkg.org/badge/gh/ethereum/grid-ui)](http://ethpkg.org/gh/ethereum/grid-ui)

### What is Grid?

“Often referred to […] as “digital frontier", the Grid was made to provide an experimental platform where all forms of research could be carried out at unparalleled speeds.” - [Tron Movie](https://tron.fandom.com/wiki/Grid)

One way to describe Ethereum Grid is a platform to run experiments, create prototypes (and hackathon projects) or develop fully working apps for the many available clients in the ecosystem.
Another description could be that Ethereum Grid is the control center for all kinds of clients and Ethereum core binaries.

With Grid, clients can be downloaded, configured, and started all in one place. But even more than this, Grid serves as an Ethereum provider, which means that once a client is configured and started, DApps can connect to Grid and share the connection to the Ethereum network.

It is ideal for people who want to run a full node, have a convenient and secure way to update their binaries, and don't want to rely on centralized 3rd party services.

Grid can host and launch other interfaces and the functionality can be extended and adjusted through apps and plugins.

### Contributing

There are many ways to get involved with this project. Get started [here](/docs/CONTRIBUTING.md).

### Development

```
git clone https://github.com/ethereum/grid-ui.git
cd grid-ui
yarn

Start in 2 terminals:
yarn run start -> start dev server for react with hot reloading
yarn run electron:dev -> load the app from the dev server into an electron window
```

#### Using local ethereum-react-components

To develop in `grid-ui` using your local copy of `ethereum-react-components`:

1. cd `ethereum-react-components`
1. `npm link`
1. cd `grid-ui`
1. `npm link ethereum-react-components`

After making changes in `ethereum-react-components`, run `yarn` for a fresh build to be picked up by `grid-ui`.
