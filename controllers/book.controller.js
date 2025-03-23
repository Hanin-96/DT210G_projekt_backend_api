const Review = require("../models/review.model");

//Användning av .env fil för användning av variabler
require("dotenv").config();

//Google Api nyckel
const bookKey = process.env.GOOGLE_API_KEY_BOOKS1;

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

        console.log(response);
        if (!response.ok) {
            throw new Error("Misslyckades, kunde inte hämta böcker...")
        }

        const data = await response.json();
        console.log("data books backend:", data)

        // Filtrera utifrån titel på books
        const filteredBooks = data.items?.map(item => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo?.authors || [],
            description: item.volumeInfo.description ? item.volumeInfo.description : "",
            thumbnail: item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail
                ? item.volumeInfo.imageLinks.thumbnail
                : "",
            pageCount: item.volumeInfo.pageCount,
            infoLink: item.volumeInfo.infoLink
        })) || [];

        return h.response(filteredBooks);


    } catch (error) {
        return h.response({ error: error.message }).code(500);

    }
}

//Hämta specifik bok med bookId
exports.getBookById = async (request, h) => {
    const { bookId } = request.params;

    if (!bookId) {
        console.error("bookId saknas...");
        return h.response({ error: "bookId saknas..." }).code(400);
    }

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${bookKey}`);

    if (!response.ok) {
        throw new Error("Misslyckades, kunde inte hämta boken...")
    }

    const data = await response.json();

    const bookInfo = {
        id: data.id,
        title: data.volumeInfo?.title || "Ingen titel",
        description: data.volumeInfo?.description || "",
        thumbnail: data.volumeInfo?.imageLinks?.thumbnail || "",
        pageCount: data.volumeInfo?.pageCount || 0,
        authors: data.volumeInfo?.authors || [],
        infoLink: data.volumeInfo?.infoLink || ""
    };

    console.log("Bokinformation:", bookInfo)

    return h.response(bookInfo);
}




