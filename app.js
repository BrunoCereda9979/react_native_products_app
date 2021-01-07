const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

//Routes
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders') //----->DESCONTINUADA
const userRoutes = require('./api/routes/users')
const mobileRoutes = require('./api/routes/mobile')
const { urlencoded, json } = require('body-parser')

//Database
mongoose.connect('mongodb+srv://yopues:dejameentrar@nodeprojectscluster.susko.mongodb.net/{dbName:NodeProjectsCluster}?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

//Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Route Handling
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes) //------> DESCONTINUADA
app.use('/mobile', mobileRoutes)

//Error Handling
app.use((req, res, next) => {
    error = new Error('Not found')
    error.status = 404
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message 
        }
    });
});

module.exports = app;