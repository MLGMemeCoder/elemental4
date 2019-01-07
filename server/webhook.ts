import { IElementNoId, ICombo, IComboWithElement } from "../shared/api-1-types";
import { COLOR, BASE_URL, ENABLE_WEBHOOK, WEBHOOK_URL } from "./constants";
import { getElementData } from "./database";
import { request } from "https";

export async function webhookOnComboCreate(elem: ICombo) {
    if(!ENABLE_WEBHOOK) return;

    const a = await getElementData(elem.recipe.split("+")[0]);
    const b = await getElementData(elem.recipe.split("+")[1]);
    const result = await getElementData(elem.result);
    const elemUrl = 'https://'+BASE_URL+'/#viewelement=';
    
    const body = {
        username: 'New Element',
        embeds: [
            {
                title: result.display,
                url: elemUrl+result.id,
                color: parseInt(COLOR[result.color].substr(1), 16),
                timestamp: new Date().toISOString(),
                description: `[${a.display}](${elemUrl+a.id}) + [${b.display}](${elemUrl+b.id})` + ((parseInt(result.id)%25===0) ? `\n**Mile stone: ${result.id}th element**`:''),
                footer: { text: 'Element #'+result.id }
            }
        ]
    };

    const req = request({
        host: "discordapp.com",
        path: WEBHOOK_URL,
        method: "POST",
        headers: {
             'Content-Type': 'application/json'
         }
    });

    req.write(JSON.stringify(body));
    req.end();
}
