export interface Stats {
    version: string;
    version_id: number;
    total_elements: number;
}
export type ElementColor = "sky" |
    "brown" |
    "orange" |
    "blue" |
    "navy" |
    "silver" |
    "purple" |
    "maroon" |
    "gray" |
    "green" |
    "lime" |
    "yellow" |
    "olive" |
    "white" |
    "tan" |
    "black" |
    "red" |
    "lavender" |
    "pink" |
    "magenta";
export interface IElementNoId {
    /** Name of this element. */
    display: string;
    /** Color/Catagory of this element. */
    color: ElementColor;
    /** UNIX Timestamp of when the element was created. */
    createdOn?: number;
    /** Name of the creator of this element. */
    creator?: string;
    /** Note from the creator of the element. */
    note?: string;
}
export interface IElement extends IElementNoId {
    /** UUIDv4 representing this element. */
    id: string;
}
export interface ICombo {
    /** Two UUIDv4s concatinated with a `+` of the elements used to make this */
    recipe: string;
    /** What comes out of this combination (UUID). */
    result: string;
}
export interface IComboWithElement {
    /** Two UUIDv4s concatinated with a `+` of the elements used to make this */
    recipe: string;
    /** What comes out of this combination (UUID). */
    result: IElement;
}
export interface ISuggestion {
    id: string;
    recipe: string;
    results: {
        name: string;
        variants: [
            {
                display: string;
                color: ElementColor;
                votes: string[];
                downvotes: string[];
            }
        ];
        totalVotes: number;
    }[];
}
export interface ISuggestionRequest {
    display: string;
    color: ElementColor;
}

export const ELEMENT_WATER_ID = "ccab3cd7-0c42-4404-9816-0382e3e6701f";
export const ELEMENT_FIRE_ID = "c2663138-a8eb-4365-a793-607d157f92a6";
export const ELEMENT_EARTH_ID = "dee291b1-5865-4161-abb3-e769bb11df18";
export const ELEMENT_AIR_ID = "c058434b-a594-4e46-916c-02b43dbe0728";