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