This project is a "fork" / re-write of ethereum/Mist's user interface
It was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app), is 100% written in React and removes the meteor framework dependency.

### Project Goals
- improved security and easier maintenance
- rapid development, faster iterations and releases
- improved testability
- removal of electron API references from UI components
- allows to run the app in a browser, electron or [tau](https://github.com/PhilippLgh/tau) window 
- separation of electron shell application and user interface
- independant release, versioning and packaging of host application (Mist) and dapp (MistUI, WalletUI)
- introduction of an app namespace and removal of global variables
- reducing the amount of custom build scripts required to produce distributables
- a popular technology to encourage the community to contribute
- no network connection or full node required to run and develop the UI

### Run
```
if not installed:
npm install -g less

git clone https://github.com/PhilippLgh/mist-ui-react.git
cd mist-ui-react
yarn


Start in 3 terminals:
yarn run watch-css  -> compile less to css and watch for changes (less + react compat workaround)
yarn run start -> start dev server for react with hot relaoding
yarn run shell:electron -> load the app from the dev server into an electron window
```
