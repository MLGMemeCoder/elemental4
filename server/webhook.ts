import { IElementNoId, ICombo, IComboWithElement } from "../shared/api-1-types";
import { COLOR } from "./constants";
import { getElementData } from "./database";
import { request } from "https";

const discord_webhook_url = "/api/webhooks/498333916055339009/2DGxxYEm6642ZQmcAVv7EUG1lx_jNHRzDzcl-6Nrag7wQfBWXPz9-Ii3gZafbebZPWsi";

export async function webhookOnComboCreate(elem: ICombo) {
    const a = await getElementData(elem.recipe.split("+")[0]);
    const b = await getElementData(elem.recipe.split("+")[1]);
    const result = await getElementData(elem.result);

    const body = {
        embeds: [
            {
                title: result.display,
                color: parseInt(COLOR[result.color].substr(1), 16),
                timestamp: new Date().toISOString(),
                description: `${a.display} + ${b.display} => ${result.display}`
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
