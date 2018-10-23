export interface Stats {
    version: string;
    version_id: number;
    // total_elements: number;
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
    /** Name without extra detail */
    name_identifier: string;
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
export interface IElementRequest {
    display: string;
    color: ElementColor;
}
export interface ISuggestion {
    id: string;
    recipe: string;
    results: {
        name: string;
        variants: (
            IElementRequest
            & {
                votes: string[];
                downvotes: string[];
            }
        )[];
        totalVotes: number;
    }[];
}
export interface ISuggestionRequest {
    display: string;
    color: ElementColor;
}
export interface IColorMap {
    "sky": "#bbdefb",
    "brown": "#5d4037",
    "orange": "#ff7043",
    "blue": "#2196f3",
    "navy": "#303f9f",
    "silver": "#bdbdbd",
    "purple": "#7b1fa2",
    "maroon": "#b71c1c",
    "gray": "#424242",
    "green": "#4caf50",
    "lime": "#76ff03",
    "yellow": "#ffee58",
    "olive": "#afb42b",
    "white": "#ffffff",
    "tan": "#d3b8ae",
    "black": "#212121",
    "red": "#ef5350",
    "lavender": "#b39ddb",
    "pink": "#ff80ab",
    "magenta": "#e040fb",
}