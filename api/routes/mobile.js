const express = require('express')
const mongoose = require('mongoose');
const { route } = require('./products');
const router = express.Router()

//Schemas
const Product = require('../models/product')
 
//Functions
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

router.get('/products', (req, res, next) => {
    Product.find().select('productName productPrice _id').exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        productName: doc.productName,
                        productPrice: doc.productPrice,
                        productId: doc._id,
                        request: {
                            method: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Sorry! There is a problem with the server',
                error: err
            });
        })
});

//POST A NEW PRODUCT
router.post('/products', (req, res, next) => {
    console.log(req.body)
    if (isEmpty(req.body)) {
        res.status(400).json({
            message: '¡There is an error with your request!',
            status: 400
        });
    }
    
    const newProduct = new Product({
        _id: new mongoose.Types.ObjectId(),
        productName: req.body.productName,
        productPrice: req.body.productPrice,
    })

    newProduct.save().then(result => {
        res.status(201).json({
            message: 'New product posted succesfully',
            status: 201,
            createdProduct: {
                productName: result.productName,
                productPrice: result.productPrice,
                productId: result._id,
                productImage: result.productImage,
                request: {
                    method: 'GET',
                    url: 'http://localhost:3000' + result._id
                }
            }
        })
    })
        .catch(err => {
            res.status(500).json({
                message: '¡Sorry! ¡Couldt post new product!',
                status: 500
            })
        })
});

//UPDATE ONE PRODUCT
router.patch('/products/:productId', (req, res, next) => {
    if (isEmpty(req.body)) {
        res.status(400).json({
            message: '¡There is an error with your request!',
            status: 400
        });
    }
    const productId = req.params.productId

    Product.updateOne({_id: productId}, {$set: {productName: req.body.productName, productPrice: req.body.productPrice}}).exec()
    .then(result => {
        res.status(200).json({
            message: '¡Product updated successfully!',
            status: 200
        });
    })
    .catch(err => {
        res.status(500).json({
            message: '¡Sorry! ¡Could not edit product!',
            status: 500
        })
    })
});

//DELETE ONE PRODUCT
router.delete('/products/:productId', (req, res, next) => {
    const productId = req.params.productId
    Product.remove({_id: productId}).exec()
    .then(result => {
        //console.log(result)
        res.status(200).json({
            message: '¡Product deleted successfuly!',
            status: 200
        });
    })
    .catch(err => {
        res.status(500).json({
            message: 'Sorry! Could not delete product',
            status: 500
        });
    })
});

module.exports = router;