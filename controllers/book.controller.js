const Review = require("../models/review.model");

//Användning av .env fil för användning av variabler
require("dotenv").config();

//Google Api nyckel
const bookKey = process.env.GOOGLE_API_KEY_BOOKS;

//Hämta böcker
exports.getBooks = async (request, h) => {
    try {

        const { title } = request.query;

        if (!title) {
            return h.response({ message: "Ange titel att söka på" }).code(400);
        }

        const query = `intitle:${title}`;


        console.log("Sökquery:", query);


        if (!query) {
            return h.response({ message: "Det finns ingen sökparameter" }).code(400);
        }


        //const bookSearch = request.params.query;
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&key=${bookKey}`);

        if (!response.ok) {
            throw new Error("Misslyckades, kunde inte hämta böcker...")
        }

        const data = await response.json();

        // Filtrera utifrån titel på books
        const filteredBooks = data.items?.map(item => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            description: item.volumeInfo.description ? item.volumeInfo.description : "Beskrivning är inte tillgänglig",
            thumbnail: item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail
                ? item.volumeInfo.imageLinks.thumbnail
                : "Bild är inte tillgänglig",
            infoLink: item.volumeInfo.infoLink
        })) || [];

        return h.response(filteredBooks);


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

    const bookInfo = data.items.map(item => ({
        title: item.volumeInfo.title,
        description: item.volumeInfo.description ? item.volumeInfo.description : "Beskrivning är inte tillgänglig",
        thumbnail: item.volumeInfo.imageLinks.thumbnail ? item.volumeInfo.imageLinks.thumbnail : "Bild är inte tillgänglig",
        authors: item.volumeInfo.authors[0]
    }));

    console.log("Bokinformation:", bookInfo)

    return h.response(data);
}




