//Importerar koppling till model
const User = require("../models/user.model");

//JWT autentisering
const Jwt = require('@hapi/jwt');


//Lägger till ny user
exports.addNewUser = async (request, h) => {
    try {
        const user = new User(request.payload);
        const newUser = await user.save();
        return h.response({
            message: "Ny användare har lagrats:",
            newUser: newUser
        }).code(201);
    } catch (err) {
        return h.response({ message: 'Något gick fel på serversidan' }).code(500);
    }
}

//Loggar in user
exports.loginUser = async (request, h) => {
    try {
        const { username, password } = request.payload;

        const user = await User.findOne({ username });

        if (!user) {
            return h.response({ error: "Fel Användarnamn/Lösenord" }).code(400);
        }

        //Kontroll av lösenord
        const passwordMatch = await user.comparePassword(password);

        //console.log(request.payload);

        //Om lösenord ej stämmer
        if (!passwordMatch) {
            return h.response({ error: "Fel Användarnamn/Lösenord" }).code(400);

        } else {

            //Skapa token för inloggning ifall lösenord stämmer
            const payload = { username: username };

            //Generera token
            const token = generateToken(user);

            const response = {
                message: "Användare är inloggad",
                token: token,
                user: user
            }

            console.log("user", user)
            //console.log("Du är inloggad");
            return h
                .response({ message: 'Du är inloggad' })
                //Skapar http Cookie
                .state('jwt', token)
        }

    } catch (error) {
        return h.response({ error: "Server fel " + error }).code(500);
    }
}

//Hämtar secret data om token finns
exports.getUserPage = async (request, h) => {
    try {
        //Hämtar token från cookie
        const token = request.state.jwt;

        console.log("Hämtar token", token)
        if (!token) {
            return h.response({ message: "Ingen token hittades" }).code(401);
        }

        // Decode token för att hämta user
        const decodedToken = Jwt.token.decode(token);

        //Kontrollerar om användaren inte finns med i payload i cookien
        if (!decodedToken.decoded || !decodedToken.decoded.payload || !decodedToken.decoded.payload.user) {
            return h.response({ message: "Användare finns inte..." }).code(401);
        }

        //Om användare finns, hämta username
        const username = decodedToken.decoded.payload.user.username;

        const userId = decodedToken.decoded.payload.user._id;

        //console.log("decodedtoken:", decodedToken)
        //console.log("user:", userId)

        //console.log("user från decoded token:", username)


        if (!username) {
            return h.response({ message: "Användare hittades inte" }).code(404);
        }

        return h.response({
            message: "Du har tillgång till secret data",
            username: username,
            userId: userId
        }).code(200);

    } catch (err) {
        return h.response({ message: 'Något gick fel på serversidan' }).code(500);
    }

}

//Loggar ut användare
exports.logoutUser = async (request, h) => {
    try {
        //Ta bort/rensa cookie jwt
        h.unstate('jwt');
        return h.response({ message: "Du är nu utloggad" }).code(200)
    } catch (err) {
        return h.response({ message: 'Det gick inte att logga ut' }).code(500);
    }
}

//Generera ny token
const generateToken = (user) => {
    const token = Jwt.token.generate(
        { user },
        { key: process.env.JWT_SECRET_KEY, algorithm: 'HS256' },
        { expiresIn: '30min' }
    );
    return token;
}