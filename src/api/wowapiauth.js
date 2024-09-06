const config = require("../../config.json");




//gettin auth token to make calls
const BLIZZARD_AUTH_API = "https://oauth.battle.net/token?grant_type=client_credentials"

const getBlizzardAPIToken = async () => {
    const credentials = Buffer.from(`${config.apiId}:${config.apiToken}`).toString('base64');
  
    const data = await fetch(BLIZZARD_AUTH_API, {
      method: 'POST',
      headers: { Authorization: `Basic ${credentials}` },
    }).then((response) => response.json());
    return data.access_token;
  };


module.exports = {getBlizzardAPIToken}