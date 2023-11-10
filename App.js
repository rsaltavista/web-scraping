//necessary imports 

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

//this allows Express to serve static files in the current directory. It helped me to run the project with the node App.js command.
app.use(express.static(__dirname)); 


const port = 3000;

app.use(express.json());

//This is where we make the request for the Brazilian Amazon address, as Amazon blocks some requests.

app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword;
    const url = `https://www.amazon.com.br/s?k=${keyword}`;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const products = [];

        const productSelector = '.s-result-item';

        $(productSelector).each((index, element) => {
            const product = {};

            product.title = $(element).find('h2').text();
            product.rating = $(element).find('.a-icon-alt').text();
            product.reviews = $(element).find('.s-underline-link-text .a-size-base').text();
            product.image = $(element).find('img').attr('src');

            products.push(product);
        });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});