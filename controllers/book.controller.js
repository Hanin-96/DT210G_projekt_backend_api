const Review = require("../models/review.model");

//Användning av .env fil för användning av variabler
require("dotenv").config();

//Google Api nyckel
const bookKey = process.env.GOOGLE_API_KEY_BOOKS;

//Hämta böcker
exports.getBooks = async (request, h) => {
    try {

        let query = "";

        //Sök query
        const { title, author, bookId } = request.query;

        if (title) {
            query += `intitle:${title}`;
        }

        if (author) {
            query += `inauthor:${author}`;
        }

        if (bookId) {
            query += `id:${bookId}`;
        }

        const bookSearch = request.params.query;
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookSearch}&key=${bookKey}`);

        if (!response.ok) {
            throw new Error("Misslyckades, kunde inte hämta böcker...")
        }

        const data = await response.json();
        console.log("Data", data)
        return h.response(data);

    } catch (error) {
        return h.response({ error: error.message }).code(500);

    }
}

//Hämta specifik bok med bookId
exports.getBookById = async (request, h) => {
    const { bookId } = request.params

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookId}&key=${bookKey}`);

    if (!response.ok) {
        throw new Error("Misslyckades, kunde inte hämta boken...")
    }

    const data = await response.json();
    console.log("Bokdata", data)
    console.log("Bokdata items", data.items)
    return h.response(data);
}




