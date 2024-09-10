const blizzardAPIToken = require("../wowapiauth.js");
const namespace = "profile-us"

async function calculateIlvl(toon) {
    let gearCount = 0;
    let ilvlSum = 0;
    for (i=0; i < toon.length; i++)
    {
        if(!(toon[i].type == "Shirt" || toon[i].type == "Tabard")){
            gearCount++;
            ilvlSum += toon[i].level;
        }

    }
    return (ilvlSum / gearCount).toFixed(2);
    
}


module.exports = {calculateIlvl}