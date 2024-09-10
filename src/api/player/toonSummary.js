const blizzardAPIToken = require("../wowapiauth.js");
const namespace = "profile-us"


async function getToonSummary(server, name) {
    server = String(server).toLowerCase();
    name = String(name).toLowerCase();
    const link = `https://us.api.blizzard.com/profile/wow/character/${server}/${name}`;
    const token = await blizzardAPIToken.getBlizzardAPIToken();
    let toon;
    try{

        const response = await fetch(link, {
            method: 'GET',
            headers: {
                "Battlenet-Namespace": namespace,
                "Authorization" : `Bearer ${token}`,
            }
        });
        let data = await response.json();
        switch(await response.status){
            case 200:
                toon = {
                    classAndSpec:  `${data.active_spec.name.en_US} ${data.character_class.name.en_US}`,
                    faction:  data.faction.name.en_US,
                    gender:  data.gender.name.en_US,
                    race:  data.race.name.en_US,
                    guild:  data.guild.name,
                    level:  data.level,
                }
                return await toon;
            case 400:
                toon = {
                    "validResponse" : false,
                    "reason" : "Bad request"
                }
                break;
            case 401:
                toon = {
                    "validResponse" : false,
                    "reason" : "Bad request"
                }
                break; 
            case 403:
                toon = {
                    "validResponse" : false,
                    "reason" : "Forbidden"
                }
                break; 
            case 404:
                toon = {
                    "validResponse" : false,
                    "reason" : "Data not found"
                }
                break; 
            case 415:
                toon = {
                    "validResponse" : false,
                    "reason" : "Unsupported media type"
                }
                break; 
            case 429:
                toon = {
                    "validResponse" : false,
                    "reason" : "Rate limit exceeded"
                }
                break; 
            case 500:
                toon = {
                    "validResponse" : false,
                    "reason" : "Internal server error"
                }
                break; 
            case 502:
                toon = {
                    "validResponse" : false,
                    "reason" : "Bad gateway"
                }
                break; 
            case 503:
                toon = {
                    "validResponse" : false,
                    "reason" : "Service unavailable"
                }
                break; 
            case 504:
                toon = {
                    "validResponse" : false,
                    "reason" : "Gateway timeout"
                }
                break;
           
        }
        return toon['reason'];
        
    }catch(error){
        console.error(error);
    }
    
    
}


module.exports = {getToonSummary}