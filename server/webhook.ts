import { IElementNoId, ICombo, IComboWithElement } from "../shared/api-1-types";
import { COLOR, BASE_URL, ENABLE_HTTPS } from "./constants";
import { getElementData } from "./database";
import { request } from "https";

const discord_webhook_url = "/api/webhooks/505877623709237249/rY2bE9d4t0N4uaMjZtj5HJ8xnHOzcDyn_nbGomJB5_XPR9PImQqQsRh_xbBEi73ugQaS";

export async function webhookOnComboCreate(elem: ICombo) {
    const a = await getElementData(elem.recipe.split("+")[0]);
    const b = await getElementData(elem.recipe.split("+")[1]);
    const result = await getElementData(elem.result);
    const elemUrl = ((ENABLE_HTTPS) ? 'https':'http')+BASE_URL+'/#viewelement=';
    
    const body = {
        username: 'New Element',
        embeds: [
            {
                title: result.display,
                url: elemUrl+result.id
                color: parseInt(COLOR[result.color].substr(1), 16),
                timestamp: new Date().toISOString(),
                description: `[${a.display}](`+elemUrl+a.id+`) + [${b.display}](`+elemUrl+b.id+`)`+(result.id%25) ? `\n**Mile stone: ${result.id}th element**`:``
            }
        ]
    };

    const req = request({
        host: "discordapp.com",
        path: discord_webhook_url,
        method: "POST",
    });

    req.write(JSON.stringify(body));
    req.end();
}
