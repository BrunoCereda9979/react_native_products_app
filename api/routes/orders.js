const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth')

//Schemas
const Product = require('../models/product')
const Order = require('../models/order');
const { map } = require('../../app');

router.get('/', checkAuth, (req, res, next) => {
    Order.find().select('product quantity _id')
    .populate('product')
    .then(orders => {
        const response = {
            count: orders.length,
            orders: orders.map(order => {
                return {
                    orderId: order._id,
                    productId: order.product,
                    quantity: order.quantity,
                    request: {
                        method: 'GET',
                        description: 'Get more information about a single order',
                        url: 'http://localhost:3000/orders/' + order._id
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
});

router.get('/:orderId', checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId).select('_id product quantity')
    .populate('product')
    .then(order => {
        if (order) {
            res.status(200).json({
                order: order,
                request: {
                    method: 'GET',
                    description: 'Get information about all the orders',
                    url: 'http://localhost:3000/orders'
                }
            })
        }
        else {
            res.status(404).json({
                message: 'Sorry! Order not found...'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Sorry! There is a problem with the server...',
            error: err
        })
    })
});

router.post('/', checkAuth, (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    })
    order.save()
    .then(result => {
        res.status(201).json({
            message: 'New order created successfully!',
            createdOrder: {
                orderId: result._id,
                orderProduct: result.product,
                quantity: result.quantity
            },
            request: {
                method: 'GET',
                description: 'Get more information about a single order',
                url: 'http://localhost:3000/orders/' + result._id
            }
        }) 
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
    Order.remove({_id: req.params.orderId}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted successfully!',
            request: {
                method: 'POST',
                description: 'Create a new order',
                url: 'http://localhost:3000/orders',
                body: {
                    productId: 'Object Id',
                    quantity: 'Number'
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            message: 'Sorry! There is a problem with the server...',
            error: err
        });
    })
});

module.exports = router;