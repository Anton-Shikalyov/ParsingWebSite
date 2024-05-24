const express = require('express');
const { parseFunction } = require('./parse');

const app = express();
const url = 'https://www.tus.si/#s2';


app.listen(3000, async () => {
    console.log("Server working...");
    await parseFunction(url);
});