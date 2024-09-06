const blizzardAPIToken = require("./wowapiauth.js");
const namespace = "profile-us"


async function getCharacterEquipmentSummary(server, name) {
    server = String(server).toLowerCase();
    name = String(name).toLowerCase();
    const link = `https://us.api.blizzard.com/profile/wow/character/${server}/${name}/equipment`;
    const token = await blizzardAPIToken.getBlizzardAPIToken();
    const toon = [];
    try{

        const data = await fetch(link, {
            method: 'GET',
            headers: {
                "Battlenet-Namespace": namespace,
                "Authorization" : `Bearer ${token}`,
            }
        }).then((response) => response.json());
        
        for (i=0; i < data.equipped_items.length; i++){
            let slotName = data.equipped_items[i].slot.name['en_US'];
            let itemName = data.equipped_items[i].name['en_US'];
            let itemLevel = data.equipped_items[i].level.value
            toon.push({type: slotName, name: itemName, level: itemLevel});            
        }
        console.log(`Gear summary created for ${name}.`);
        console.log(toon);
        return toon;
    }catch(error){
        console.error(error);
    }
    
    
}


async function calculateIlvl(toon) {
    let gearCount = 0;
    let ilvlSum = 0;
    for (i=0; i < toon.length; i++)
    {
        if(toon[i].type == "Shirt" || toon[i].type == "Tabard"){
            console.log(`not using a calc for: ${toon[i].type}`);
        }
        else{
            gearCount++;
            ilvlSum += toon[i].level;
        }

    }
    console.log("ilvl:", (ilvlSum / gearCount).toFixed(2));
    
}


module.exports = {getCharacterEquipmentSummary, calculateIlvl}