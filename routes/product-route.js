const router = require('express').Router();
const verify = require('../middleware/verifyToken-middleware');
const connection = require('../database/db');
const dotenv = require('dotenv')
dotenv.config();
const nodemailer = require("nodemailer");
const Joi = require('joi');
const schema = require('../model/product');
const {LONG} = require("mysql/lib/protocol/constants/types");

router.post('/mail', async (req, res) => {
    const {contactFormName}= req.body;
    const {contactFormNumber}= req.body;
    const {contactFormEmail}= req.body;
    const {contactFormMessage}= req.body;
    console.log(req.body);
    res.status(200).send({"message": "Data received"});
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'shanepazindu7399@gmail.com',
            pass: 'my password'
        },
    });

    const msg ={

        from:  '"Brag tech" <shanepazindu7399@gmail.com>', // sender address
        to: 'shanepazindu7399@gmail.com', // list of receivers

        subject: "Angular Bragtech Form", // Subject line
        text: "Contact Form ", // plain text body
        html: `Name: ${contactFormName} , Mail id: ${contactFormEmail} , Mobile Number: ${contactFormNumber} , Message: ${contactFormMessage}`,

        // html body
    }
    // send mail with defined transport object
    const info = await transporter.sendMail(msg);
})

router.post('/add', async (req, res) => {

    try {
            var sql1 = "SELECT * FROM product where product_id=?";
            connection.query(sql1, [req.body.product_id], await function (err, rows) {
                if (err) throw err
                if (rows[0] != null) {
                    res.status(401).json({
                        responseCode: '200',
                        responseMsg: 'Success',
                        content: "This Product" + " ( product_id:" + req.body.product_id + " )" + " Is Already In Store"
                    });
                } else {
                    var sql = "INSERT INTO product (product_name, description, details, image_path, pan_size, dimension, netweight, power_supply, status, category_name) VALUES (?,?,?,?,?,?,?,?,?,?)";
                    connection.query(sql, [req.body.product_name, req.body.description,JSON.stringify(req.body.details),req.body.image_path,req.body.pan_size,req.body.dimension,req.body.netweight,req.body.power_supply, req.body.status, req.body.category_name], function (err, rows) {
                        if (!err) {
                            res.status(200).json({
                                responseCode: '200',
                                responseMsg: 'Success',
                                content: "Product" + " ( product_id:" + req.body.product_id + " )" + " Is Added!"
                            });
                        } else {
                            throw err
                        }
                    })
                }
            })

        // }

    } catch (err) {
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
            var sql1 = "SELECT * FROM product where product_name=?";
            connection.query(sql1, [req.body.product_name], await function (err, rows) {
                if (err) throw err
                console.log(rows)
                if (rows[0] != null) {
                    var sql2 = "UPDATE product SET description=?, details=?, image_path=?,  pan_size=?, dimension=?, netweight=?, power_supply=?, status=?, category_name=? where product_name=?";
                    connection.query(sql2, [req.body.description, req.body.details, req.body.image_path, req.body.pan_size, req.body.dimension, req.body.netweight, req.body.power_supply,  req.body.status, req.body.category_name, req.body.product_name], function (err, rows) {
                        if (!err) {
                            res.status(200).json({
                                responseCode: '200',
                                responseMsg: 'Success',
                                content: "This product" + " ( product_name:" + req.body.product_name + " )" + " Is Updated"
                            });
                        }
                    })
                } else {
                    res.status(404).json({
                        responseCode: '404',
                        responseMsg: 'Not Found',
                        content: "This product" + " ( product_name:" + req.body.product_name + " )" + " Is Not Already In Store"
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
        var sql1 = "SELECT * FROM product where product_id=?";
        connection.query(sql1, [req.params.id], await function (err, rows) {
            if (err) throw err
            if (rows[0] != null) {

                var sql = "Delete from product where product_id=?";
                connection.query(sql, [req.params.id], function (err, rows) {
                    if (!err) {
                        res.status(200).json({
                            responseCode: '200',
                            responseMsg: 'Success',
                            content: "This product" + " ( product_id:" + req.params.id + " )" + " Is Deleted!"
                        });
                    } else {
                        throw err
                    }
                })
            } else {
                res.status(404).json({
                    responseCode: '404',
                    responseMsg: 'Not Found',
                    content: "This product" + " ( product_id:" + req.params.id + " )" + " Is Not Already In Store"
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

router.get('/search/:id', async (req, res) => {

    try {
        var sql = "SELECT * FROM product WHERE category_name LIKE '%" + req.params.id + "%'";
        connection.query(sql, [req.params.id], await function (err, rows) {
            if(err) throw new Error
            if (rows[0] != null) {
                res.status(200).json({
                    responseCode: '200',
                    responseMsg: 'Success',
                    content: rows
                });
            } else {
                res.status(200).json({
                    responseCode: '200',
                    responseMsg: 'Success',
                    content: null
                });
            }

        })
    } catch (error) {
        res.status(401).json({
            responseCode: '401',
            responseMsg: 'Error',
            content: 'internal server error'
        });
    }
})

router.get('/searchbyPr/:id', async (req, res) => {

    try {
        var sql = "SELECT * FROM product WHERE product_id LIKE '%" + req.params.id + "%'";
        connection.query(sql, [req.params.id], await function (err, rows) {
            if(err) throw new Error
            if (rows[0] != null) {
                res.status(200).json({
                    responseCode: '200',
                    responseMsg: 'Success',
                    content: rows
                });
            } else {
                res.status(200).json({
                    responseCode: '200',
                    responseMsg: 'Success',
                    content: null
                });
            }

        })
    } catch (error) {
        res.status(401).json({
            responseCode: '401',
            responseMsg: 'Error',
            content: 'internal server error'
        });
    }
})

router.get('/totalCount', async (req, res) => {

    try {
        var sql = "Select count(product_id)  AS NofProducts from product ";
        connection.query(sql, await function (err, rows) {

            res.status(200).json({
                responseCode: '200',
                responseMsg: 'Success',
                content: rows[0]
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

router.get('/getAllComponets/:page/:limit', async (req, res) => {

    try {
        const limit=req.params.limit;
        const page=req.params.page;
        const pageNumber=page*limit;
        var sql = "SELECT * FROM product LIMIT "+ limit +" OFFSET "+pageNumber+";";

        connection.query(sql, await function (err, rows) {
            // console.log(JSON.parse(rows[3].model))
            // console.log(JSON.parse(rows[3].details))
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

router.post('/img/add', async (req, res) => {

    try {
        var sql1 = "SELECT * FROM images where image_id=?";
        connection.query(sql1, [req.body.image_id], await function (err, rows) {
            if (err) throw err
            if (rows[0] != null) {
                res.status(401).json({
                    responseCode: '200',
                    responseMsg: 'Success',
                    content: "This Image" + " ( image_id:" + req.body.image_id + " )" + " Is Already In Store"
                });
            } else {
                var sql = "INSERT INTO images (image_path, product_name) VALUES (?,?)";
                connection.query(sql, [req.body.image_path, req.body.product_name], function (err, rows) {
                    if (!err) {
                        res.status(200).json({
                            responseCode: '200',
                            responseMsg: 'Success',
                            content: "Image" + " ( image_id:" + req.body.image_id + " )" + " Is Added!"
                        });
                    } else {
                        throw err
                    }
                })
            }
        })

        // }

    } catch (err) {
        res.status(401).json({
            responseCode: '401',
            responseMsg: 'Error',
            content: 'internal server error'
        });
    }

})

router.post('/model/add', async (req, res) => {

    try {
        var sql1 = "SELECT * FROM model where model_id=?";
        connection.query(sql1, [req.body.model_id], await function (err, rows) {
            if (err) throw err
            if (rows[0] != null) {
                res.status(401).json({
                    responseCode: '200',
                    responseMsg: 'Success',
                    content: "This Model" + " ( model_id:" + req.body.model_id + " )" + " Is Already In Store"
                });
            } else {
                var sql = "INSERT INTO model (model_name, capacity,readability,calibration_weight,product_name) VALUES (?,?,?,?,?)";
                connection.query(sql, [req.body.model_name, req.body.capacity, req.body.readability, req.body.calibration_weight, req.body.product_name], function (err, rows) {
                    if (!err) {
                        res.status(200).json({
                            responseCode: '200',
                            responseMsg: 'Success',
                            content: "Model" + " ( model_id:" + req.body.model_id + " )" + " Is Added!"
                        });
                    } else {
                        throw err
                    }
                })
            }
        })

        // }

    } catch (err) {
        res.status(401).json({
            responseCode: '401',
            responseMsg: 'Error',
            content: 'internal server error'
        });
    }

})

router.get('/searchimg/:id', async (req, res) => {

    try {
        var sql = "SELECT * FROM images WHERE product_name LIKE '%" + req.params.id + "%'";
        connection.query(sql, [req.params.id], await function (err, rows) {
            if(err) throw new Error
            if (rows[0] != null) {
                res.status(200).json({
                    responseCode: '200',
                    responseMsg: 'Success',
                    content: rows
                });
            } else {
                res.status(200).json({
                    responseCode: '200',
                    responseMsg: 'Success',
                    content: null
                });
            }

        })
    } catch (error) {
        res.status(401).json({
            responseCode: '401',
            responseMsg: 'Error',
            content: 'internal server error'
        });
    }
})

router.get('/searchmodel/:id', async (req, res) => {

    try {
        var sql = "SELECT * FROM model WHERE product_name LIKE '%" + req.params.id + "%'";
        connection.query(sql, [req.params.id], await function (err, rows) {
            if(err) throw new Error
            if (rows[0] != null) {
                res.status(200).json({
                    responseCode: '200',
                    responseMsg: 'Success',
                    content: rows
                });
            } else {
                res.status(200).json({
                    responseCode: '200',
                    responseMsg: 'Success',
                    content: null
                });
            }

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
