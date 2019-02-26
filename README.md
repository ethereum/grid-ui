<p align="center">
  <a href="https://circleci.com/gh/ethereum/mist-ui"><img src="https://img.shields.io/circleci/project/github/ethereum/mist-ui/master.svg" alt="Build Status"></a>
</p>

## Mist-UI

### Project Goals

- improved security and easier maintenance
- rapid development, faster iterations and releases
- improved testability
- removal of electron API references from UI components
- allows to run the app in a browser, electron or [tau](https://github.com/PhilippLgh/tau) window
- separation of electron shell application and user interface
- independent release, versioning and packaging of host application (Mist) and dapp (MistUI, WalletUI)
- introduction of an app namespace and removal of global variables
- reducing the amount of custom build scripts required to produce distributables
- a popular technology to encourage the community to contribute
- no network connection or full node required to run and develop the UI

### Contributing

There are many ways to get involved with this project. Get started [here](/docs/CONTRIBUTING.md).

### Development

```
git clone https://github.com/ethereum/mist-ui.git
cd mist-ui
yarn

Start in 2 terminals:
yarn run start -> start dev server for react with hot reloading
yarn run electron:dev -> load the app from the dev server into an electron window
```

#### Using local ethereum-react-components

To develop in `mist-ui` using your local copy of `ethereum-react-components`:

1. cd `ethereum-react-components`
1. `npm link`
1. cd `mist-ui`
1. `npm link ethereum-react-components`

After making changes in `ethereum-react-components`, run `yarn` for a fresh build to be picked up by `mist-ui`.
