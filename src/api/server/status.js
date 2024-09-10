const blizzardAPIToken = require("../wowapiauth.js");
const namespace = "dynamic-us"


async function serverStatus(server) {
    server = String(server).toLowerCase();
    const link = `https://us.api.blizzard.com/data/wow/search/connected-realm?status.type=UP&realms.name.en_US=${server}&orderby=id&_page=1`;
    const token = await blizzardAPIToken.getBlizzardAPIToken();
    let status;
    try{

        const response = await fetch(link, {
            method: 'GET',
            headers: {
                "Battlenet-Namespace": namespace,
                "Authorization" : `Bearer ${token}`,
            }
        });
        //console.log(response);
        let data = await response.json();
        switch(await response.status){
            case 200:
                if(data.results.length > 0){
                    status = data.results[0].data.status.type;
                    return status
                }
                else{
                    status = {
                        "validResponse" : true,
                        "reason" : "Server does not exist"
                    }
                    return status['reason'];
                }
            case 400:
                status = {
                    "validResponse" : false,
                    "reason" : "Bad request"
                }
                break;
            case 401:
                status = {
                    "validResponse" : false,
                    "reason" : "Bad request"
                }
                break; 
            case 403:
                status = {
                    "validResponse" : false,
                    "reason" : "Forbidden"
                }
                break; 
            case 404:
                status = {
                    "validResponse" : false,
                    "reason" : "Data not found"
                }
                break; 
            case 415:
                status = {
                    "validResponse" : false,
                    "reason" : "Unsupported media type"
                }
                break; 
            case 429:
                status = {
                    "validResponse" : false,
                    "reason" : "Rate limit exceeded"
                }
                break; 
            case 500:
                status = {
                    "validResponse" : false,
                    "reason" : "Internal server error"
                }
                break; 
            case 502:
                status = {
                    "validResponse" : false,
                    "reason" : "Bad gateway"
                }
                break; 
            case 503:
                status = {
                    "validResponse" : false,
                    "reason" : "Service unavailable"
                }
                break; 
            case 504:
                status = {
                    "validResponse" : false,
                    "reason" : "Gateway timeout"
                }
                break;
           
        }
        return status['reason'];
        
    }catch(error){
        console.error(error);
    }
    
    
}


module.exports = {serverStatus}