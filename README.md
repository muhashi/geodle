# Geodle
## A Wordle-like game that tests knowledge about the world's countries

![image](https://github.com/user-attachments/assets/faf45c4f-b449-4986-9e07-26a58a76beea)

[Try the game out here](https://geodle.me)! Built with TypeScript, React, Material UI, and Vite. 

### Attributions

Country demographic data used is from [samayo](https://github.com/samayo/country-json) under MIT license.

### Deployment

If you want to host this on your own domain, fork/clone the repo and run `npm install` at the root. In `package.json` change the `homepage` attribute and update the CNAME file to whatever domain you are hosting on. Run `npm run start` to make sure it compiles correctly.

### Updating Wordlist

Scripts exist for updating the wordlist and dataset. Ensure `npm install` has been run before running these scripts.

- `node update-wordlist.js`: Updates the wordlist of countries, and randomly shuffles the data. Countries with any missing data will be excluded.
