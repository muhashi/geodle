# Geodle
## A Wordle-like game that tests knowledge about the world's countries

![image](https://github.com/user-attachments/assets/91c473e6-2e45-47d2-a85e-30fab38b2b51)

[Try the game out here](https://geodle.me)! Built with TypeScript, React, Material UI, and Vite. 

### Attributions

Country demographic data used is from [samayo](https://github.com/samayo/country-json) under MIT license.

### Deployment

If you want to host this on your own domain, fork/clone the repo and run `npm install` at the root. In `package.json` change the `homepage` attribute and the `--cname` option in the `deploy` script to whatever domain you are hosting on. Run `npm run start` to make sure it compiles correctly, and then after committing to your repo run `npm run deploy` to deploy it to Github Pages.

### Updating Wordlist/Dataset

Scripts exist for updating the wordlist and dataset. Ensure `npm install` has been run before running these scripts.

- `node update-wordlist.js`: Updates the wordlist of countries, and randomly shuffles the data. Countries with any missing data will be excluded.
- `node update-country-data.js`: Updates datasets used in the game with the latest values.
