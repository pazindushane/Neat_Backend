const express = require('express');
const auth=require('./routes/auth-route');
const product=require('./routes/product-route');
const category=require('./routes/category-route');
const index = express();
var cors = require('cors');

index.use(cors())
index.use(express.json());
index.use(express.urlencoded({
    extended: true
}));

index.use('/api/v1/token',auth);
index.use('/api/v1/product',product);
index.use('/api/v1/category',category);


index.listen(5000, () => console.log('server is started!'));