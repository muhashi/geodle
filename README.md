# Geodle
## A Wordle-like game for testing knowledge about the world's countries

![image](https://user-images.githubusercontent.com/105213357/174512109-1ade041b-5bc7-466d-ba37-13c4787e7fd6.png)

### Repo Content

[Try the game out here](https://geodle.me)! This is a modified `create-react-app` app, with additions of `eslint` and `PropTypes`. And the `gh-pages` module for deploying the build to Github Pages.

### Attributions

Country demographic data used is from [samayo](https://github.com/samayo/country-json) under MIT license.

### How to host it yourself

If you want to host this on your own domain, fork/clone the repo and run `npm install` at the root. In `package.json` change the `homepage` attribute to whatever domain you are hosting on. Run `npm run start` to make sure it compiles correctly, and then after committing to your repo run `npm run deploy` to deploy it to Github Pages.
