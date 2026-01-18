const express = require('express');
const cookieParser = require('cookie-parser');




const app = express();
app.use(express.json());
app.use(cookieParser());



app.get('/', (req, res) => {
    res.status(200).json({
        message: "Auth service is running"
    });
})

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);


module.exports = app;