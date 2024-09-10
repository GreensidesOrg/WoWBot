const blizzardAPIToken = require("../wowapiauth.js");
const namespace = "profile-us"


async function getCharacterEquipmentSummary(server, name) {
    server = String(server).toLowerCase();
    name = String(name).toLowerCase();
    const link = `https://us.api.blizzard.com/profile/wow/character/${server}/${name}/equipment`;
    const token = await blizzardAPIToken.getBlizzardAPIToken();
    let gear = [];
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
                for (i=0; i < data.equipped_items.length; i++){
                    let slotName = data.equipped_items[i].slot.name['en_US'];
                    let itemName = data.equipped_items[i].name['en_US'];
                    let itemLevel = data.equipped_items[i].level.value
                    gear.push({type: slotName, name: itemName, level: itemLevel});            
                }
                return gear;
            case 400:
                gear = {
                    "validResponse" : false,
                    "reason" : "Bad request"
                }
                break;
            case 401:
                gear = {
                    "validResponse" : false,
                    "reason" : "Bad request"
                }
                break; 
            case 403:
                gear = {
                    "validResponse" : false,
                    "reason" : "Forbidden"
                }
                break; 
            case 404:
                gear = {
                    "validResponse" : false,
                    "reason" : "Data not found"
                }
                break; 
            case 415:
                gear = {
                    "validResponse" : false,
                    "reason" : "Unsupported media type"
                }
                break; 
            case 429:
                gear = {
                    "validResponse" : false,
                    "reason" : "Rate limit exceeded"
                }
                break; 
            case 500:
                gear = {
                    "validResponse" : false,
                    "reason" : "Internal server error"
                }
                break; 
            case 502:
                gear = {
                    "validResponse" : false,
                    "reason" : "Bad gateway"
                }
                break; 
            case 503:
                gear = {
                    "validResponse" : false,
                    "reason" : "Service unavailable"
                }
                break; 
            case 504:
                gear = {
                    "validResponse" : false,
                    "reason" : "Gateway timeout"
                }
                break;
           
        }
        return gear['reason'];
        
    }catch(error){
        console.error(error);
    }
    
    
}


module.exports = {getCharacterEquipmentSummary}