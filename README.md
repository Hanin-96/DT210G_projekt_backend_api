# DT210G Fördjupad frontend-utveckling Projekt API
Detta repository innehåller kod för API Webbtjänst skapad med ramverket Hapi.

## API Länk
En liveversion av APIet finns tillgängligt i Render: https://dt210g-bokio-api.onrender.com/.

## Databas
APIet använder NoSQL MongoDB och Mongose. Databasen innehåller följande struktur på data som skapas i ett schema i modulen Mongoose:

```
Review
    reviewText: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    status: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    recommend: {
        type: Boolean,
        required: false,
    },
    like: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookId: {
        type: String,
        required: true,
        trim: true
    },

    created: {
        type: Date,
        default: Date.now
    },

});
```

```
User:

    firstname: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },

});

```
## Användning av HTTP metoder

### User:

| Metod   | Ändpunkt     | Beskrivning                       |
| ------- | ------------ | --------------------------------- |
| GET     | /userpage | Hämtar privat data för användare   |
| GET     | /logout | Loggar ut användare  |
| POST    | /register     | Registrera ny användare |
| POST    | /login     | Loggar in användare |


### Review:

| Metod   | Ändpunkt     | Beskrivning                       |
| ------- | ------------ | --------------------------------- |
| GET     | /reviews       | Hämtar alla recensioner  |
| GET     | /reviews/book/{id}       | Hämtar recensioner utifrån book Id  |
| GET     | /reviews/{_id}       | Hämtar recensioner utifrån user Id  |
| POST    | /review       | Skapa ny recension |
| DELETE     | /review/{_id}    | Tar bort recension utifrån review Id    |
| PUT     | /review/{_id}    | Uppdaterar recension utifrån review Id    |
| PATCH     | /review/{_id}/like    | Uppdaterar recension med gilla markering   |

### Book:

| Metod   | Ändpunkt     | Beskrivning                       |
| ------- | ------------ | --------------------------------- |
| GET     | /books        | Hämtar böcker utifrån sök query  |
| GET    | /book/{bookId}   | Hämtar bok utifrån book Id |



