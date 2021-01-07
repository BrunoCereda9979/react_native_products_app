const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middlewares/check-auth')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpeg') {
        //Accept File
        cb(null, true);
    } 
    else {
        //Reject File
        cb(null, false);
    }
}

const uploadFile = multer({storage: storage, limits: {fileSize: 1024 * 1024 * 5, fileFilter: fileFilter}})

//Schemas
const Product = require('../models/product')

//Routes
//POST A NEW PRODUCT
router.post('/', checkAuth, (req, res, next) => {
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

//GET ALL PRODUCTS
router.get('/', (req, res, next) => {
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

//GET ONE PRODUCT
router.get('/:productId', (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).select('productName productPrice _id').exec()
    .then(doc => {
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    method: 'GET',
                    url: 'http://localhost:3000/products',
                    status: 200
                }
            });
        }
        else {
            res.status(404).json({
                message: 'The product does no exist!',
                status: 404
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Sorry! Couldt get the product...',
            status: 500
        })
    })
});

//UPDATE ONE PRODUCT
router.patch('/:productId', checkAuth, (req, res, next) => {
    const productId = req.params.productId

    Product.update({_id: productId}, {$set: {productName: req.body.productName, productPrice: req.body.productPrice}}).exec()
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
router.delete('/:productId', checkAuth, (req, res, next) => {
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