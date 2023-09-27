const express = require('express');
const app = express();
const { createClient } = require('redis');

const redisClient = createClient();

const getAllProducts = async() => {
    const time = Math.random() * 5000;
    return new Promise((resolve) => {
        setTimeout(() => {
           resolve(["Produto 1","Produto 2"]) ;
        }, time);
    });
};

app.get('/', async (req, res) => {
    const productsFromCache = await redisClient.get('getAllProducts');
    if(productsFromCache){
        res.send(JSON.parse(productsFromCache));
    };
    const products = await getAllProducts();
    await redisClient.set("getAllProducts", JSON.stringify(products));
    res.send(products);
});

const startup = async() => {
    await redisClient.connect();
    app.listen(3000, '0.0.0.0', () => {
        console.log('server running on port 3000...');
    });
};

startup();