# Elemental 4 API v1
In order to do networking, there needs to be some kind of API to talk to the server and
the client game. I have made the entire api system public, so you can use it to create
apps, or just see whats going on.

When programming an api user, **always check every case**, or else an unexpected error
may happen.

## Getting an element information
**HTTP Request:** `GET /api/v1/element/<uuid>`

Pass `<uuid>` as the unique id of the element.

### Possible return options
- Element exists.
    - You will be retured an [IElement](element-format.md) object as JSON
- Element does not exist
    - Returns the text "null"
- HTTP 500: Server Error
    - In this case you should warn the user that a server error has happened.

## Getting a combination information
**HTTP Request:** `GET /api/v1/combo/<uuid>+<uuid>`

Pass the two `<uuid>`s as the two unique ids of the elements you want to combine.

### Possible return options
- Combo exists.
    - You will be retured an [ICombo](element-format.md) object as JSON
- Combo does not exist
    - Returns the text "null"
- HTTP 500: Server Error
    - In this case you should warn the user that a server error has happened.

## Creating an element suggestion
**HTTP Request** `PUT /api/v1/suggestion/<elem1>+<elem2>`

## Getting element's suggestions
**HTTP Request** `GET /api/v1/suggestion/<elem1>+<elem2>`

## Downvoting an element suggestion
**HTTP Request** `PATCH /api/v1/downvote/<suggestion-uuid>`
