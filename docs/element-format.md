# Element Format
Elements are stored in a JSON format as follows.

-**id**: `string`; UUIDv4 representing this element.
-**display**: `string`; Name of this element.
-**color**: `ElementColor`; Color/Catagory of this element.
-**createdOn?**: `number`; UNIX Timestamp of when the element was created.
-**creator?**: `string`; Name of the creator of this element.
-**note?**: `string`; Note from the creator of the element.

This is referred to as an `IElement`.

# Combination Format
Combinations are stored in a JSON format as follows:

-**recipe**: `string`; Two UUIDv4s concatinated with a `+` of the elements used to make this.
-**result**: `IElement`; What comes out of this combination.

This is referred to as an `ICombo`.