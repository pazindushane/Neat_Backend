const router = require('express').Router();
const verify = require('../middleware/verifyToken-middleware');
const connection = require('../database/db');
const dotenv = require('dotenv')
dotenv.config();
const Joi = require('joi');
const schema = require('../model/category');

router.post('/add', verify, async (req, res) => {
    try {
        const result = Joi.validate(req.body, schema.schema);
        if (result.error) {
            res.status(401).json({
                responseCode: '422',
                responseMsg: 'Validation Error',
                content: result.error.details[0].message
            });
        } else {
            var sql1 = "SELECT * FROM category where category_name=?";
            connection.query(sql1, [req.body.category_name], await function (err, rows) {
                if (err) throw err
                if (rows[0] != null) {
                    res.status(401).json({
                        responseCode: '200',
                        responseMsg: 'Success',
                        content: "This Category" + " ( category_name:" + req.body.category_name + " )" + " Is Already In Store"
                    });
                } else {
                    var sql = "INSERT INTO category (category_name,status) VALUES (?,?)";
                    connection.query(sql, [req.body.category_name, req.body.status], function (err, rows) {
                        if (!err) {
                            res.status(200).json({
                                responseCode: '200',
                                responseMsg: 'Success',
                                content: "Category" + " ( category_name:" + req.body.category_name + " )" + " Is Added!"
                            });
                        } else {
                            throw err
                        }
                    })
                }
            })

        }

    } catch (err) {
        console.log(err)
        res.status(401).json({
            responseCode: '401',
            responseMsg: 'Error',
            content: 'internal server error'
        });
    }

})

router.post('/update', verify, async (req, res) => {

    try {
        const result = Joi.validate(req.body, schema.schema);
        if (result.error) {
            res.status(401).json({
                responseCode: '422',
                responseMsg: 'Validation Error',
                content: result.error.details[0].message
            });
        } else {
            var sql1 = "SELECT * FROM category where category_name=?";
            connection.query(sql1, [req.body.category_name], await function (err, rows) {
                if (err) throw err
                console.log(rows)
                if (rows[0] != null) {
                    var sql2 = "UPDATE category SET status=? where category_name=?";
                    connection.query(sql2, [req.body.status, req.body.category_name], function (err, rows) {
                        if (!err) {
                            res.status(200).json({
                                responseCode: '200',
                                responseMsg: 'Success',
                                content: "This category" + " ( category_name:" + req.body.category_name + " )" + " Is Updated"
                            });
                        }
                    })
                } else {
                    res.status(404).json({
                        responseCode: '404',
                        responseMsg: 'Not Found',
                        content: "This category" + " ( category_name:" + req.body.category_name + " )" + " Is Not Already In Store"
                    });

                }
            })
        }
    } catch (error) {
        res.status(401).json({
            responseCode: '401',
            responseMsg: 'Error',
            content: 'internal server error'
        });
    }

})

router.delete('/delete/:id', verify, async (req, res) => {

    try {
        var sql1 = "SELECT * FROM category where category_name=?";
        connection.query(sql1, [req.params.id], await function (err, rows) {
            if (err) throw err
            if (rows[0] != null) {

                var sql = "Delete from category where category_name=?";
                connection.query(sql, [req.params.id], function (err, rows) {
                    if (!err) {
                        res.status(200).json({
                            responseCode: '200',
                            responseMsg: 'Success',
                            content: "This category" + " ( category_name:" + req.params.id + " )" + " Is Deleted!"
                        });
                    } else {
                        throw err
                    }
                })
            } else {
                res.status(404).json({
                    responseCode: '404',
                    responseMsg: 'Not Found',
                    content: "This category" + " ( category_name:" + req.params.id + " )" + " Is Not Already In Store"
                });
            }
        });

    } catch (e) {
        res.status(401).json({
            responseCode: '401',
            responseMsg: 'Error',
            content: 'internal server error'
        });
        console.log('====================================');
        console.log(e);
        console.log('====================================');
    }
})


router.get('/getAllComponets', async (req, res) => {

    try {
        // const limit=req.params.limit;
        // const page=req.params.page;
        // const pageNumber=page*limit;
        var sql = "SELECT * FROM category";

        connection.query(sql, await function (err, rows) {
            res.status(200).json({
                responseCode: '200',
                responseMsg: 'Success',
                content: rows
            });
        })
    } catch (error) {
        res.status(401).json({
            responseCode: '401',
            responseMsg: 'Error',
            content: 'internal server error'
        });
    }
})

module.exports = router