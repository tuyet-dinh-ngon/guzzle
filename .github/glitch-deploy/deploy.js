const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/pear-fancy-lantern|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/pinnate-dapper-lillipilli|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/fog-smart-mahogany|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/trite-brazen-sailboat|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/thinkable-rose-rest|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/equal-capable-playroom|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/rustic-coherent-brachiosaurus|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/gregarious-elderly-ballcap|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/frequent-spectacular-idea|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/aluminum-adventurous-barnacle|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/violet-hypnotic-powder|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/curvy-booming-centaur|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/balsam-oasis-tibia|https://01656bb9-52ab-498b-9992-8e0608c1f00e@api.glitch.com/git/roan-onyx-phalange`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();