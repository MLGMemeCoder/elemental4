// Handles raw elements, getting, setting
// with the database
import { IElement, IElementNoId, Stats, ICombo, ISuggestionRequest, ISuggestion } from '../shared/api-1-types';
import { elementNameToStorageID } from '../shared/shared';
import { connect, table, row, Connection } from 'rethinkdb';
import { RETHINK_LOGIN } from './constants';

let conn: Connection = null;
export async function initDatabase() {
    conn = await connect(RETHINK_LOGIN);
    console.info("Rethink Connection Created.");
}

export async function writeElement(elem: IElementNoId) {
    const out = await table('elements').insert([elem]).run(conn);
    return out.generated_keys[0];
}

export async function writeCombo(elem: ICombo) {
    const out = await table('combos').insert([elem]).run(conn);
    return out.generated_keys[0];
}

export async function getElementData(id: string): Promise<IElement | undefined> {
    const res = await table('elements').filter(row('id').eq(id)).coerceTo("array").run(conn)
    return res[0];
}

export async function getComboData(id1: string, id2: string): Promise<ICombo> {
    const res = await table('combos').filter(row('recipe').eq(id1+"+"+id2)).coerceTo("array").run(conn)
    return res[0];
}

export async function getGameStats(): Promise<Stats> {
    return {
        version: '0.1.1',
        version_id: 1,
        total_elements: await table("elements").count().run(conn)
    }
}

export async function suggestElement(recipe: string, suggest: ISuggestionRequest, voter: string) {
    const count = await table('suggestions').filter(row('recipe').eq(recipe)).count().run(conn);
    if(count === 0) {
        // Add a complete new suggestion.
        await table('suggestions').insert([{
            recipe,
            results: [
                {
                    name: elementNameToStorageID(suggest.display),
                    totalVotes: 1,
                    variants: [
                        {
                            color: suggest.color,
                            display: suggest.display,
                            downvotes: [],
                            votes: [voter]
                        }
                    ]
                }
            ]
        } as ISuggestion]).run(conn);
    } else {
        const res = (await table('suggestions').filter(row('recipe').eq(recipe)).coerceTo("array").run(conn))[0] as ISuggestion;
        const name = elementNameToStorageID(suggest.display);
        let find_name = res.results.find(x => x.name === name);
        if(!find_name) {
            res.results.push({
                name,
                totalVotes: 1,
                variants: [
                    {
                        color: suggest.color,
                        display: suggest.display,
                        downvotes: [],
                        votes: [voter]
                    }
                ]
            });
        } else {
            let find_vari = find_name.variants.find(x => x.display === suggest.display && x.color === suggest.color);
            find_name.totalVotes++;
            if (find_vari) {
                find_vari.votes.push(voter);
                find_name.variants.forEach((x, ind) => {
                    if (x.display === suggest.display && x.color === suggest.color) {
                        find_name.variants[ind] = find_vari;
                    }
                });
            } else {
                find_name.variants.push({
                    color: suggest.color,
                    display: suggest.display,
                    downvotes: [],
                    votes: [voter]
                });
            }
            res.results.forEach((x, ind) => {
                if (x.name === name) {
                    res.results[ind] = find_name;
                }
            });
        }
        await table('suggestions').filter(row('recipe').eq(recipe)).replace(res).run(conn);
    }
}

export async function getComboSuggestions(id1: string, id2: string): Promise<ISuggestionRequest[]> {
    const res = await table('suggestions').filter(row('recipe').eq(id1 + "+" + id2)).run(conn)
    const arr = await res.toArray();
    return arr;
}
