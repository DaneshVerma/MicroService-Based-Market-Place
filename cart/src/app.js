const express = require('express');
const cartRoutes = require('./routes/cart.routes');
const cookieParser = require('cookie-parser');


const app = express();

app.use(express.json());
app.use(cookieParser());



app.get('/', (req, res) => {
    res.status(200).json({
        message: "Cart service is running"
    });
})

app.use('/api/cart', cartRoutes);





module.exports = app;