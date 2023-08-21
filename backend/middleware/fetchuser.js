const jwt = require('jsonwebtoken');
require("dotenv").config();
JWT_TOKEN= process.env.JWT_TOKEN
let localStorage = require('local-storage');

function fetchUser(req, res, next) {
    const token = localStorage.get("token");
    // const token = req.headers.authorization.split(' ')[1]
    console.log(token);
    if (!token) {
        res.status(401).send("Please authenticate first");
    }
    try {
        const data = jwt.verify(token, JWT_TOKEN);
        console.log(data);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send(jwt.verify("Got token but have issue"));
    }



}





module.exports = fetchUser;