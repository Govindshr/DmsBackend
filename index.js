const express = require("express");
const mongoose = require("mongoose");
const fs = require('fs')
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv")
var bcrypt = require('bcryptjs');
const { ObjectId } = require("mongoose").Types;
const path =require("path")
dotenv.config()
const app = express();
app.use(express.json());
app.use(cors());
let imagepath = path.join(__dirname,"./uploads")
app.use(express.static(imagepath))
require("./db_api/config")
const { Registration, FeeDetails, ClassDetails, OrderDetails, SweetOrderDetails, Expence,ExtraSweets } = require("./db_api/schema")

app.listen((2025), () => {
    console.log("app is running on port 2025")
})
//>>>>>>>>>funtions start......................


const upload = multer({

    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads")
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + ".jpg")
        }
    })
}).single("image");
app.post("/profile", upload, (req, res) => {
    res.send("file upload")
});

const bcryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log(hashedPassword)
    return hashedPassword;
}
const decryptPassword = async (getpassword, userpassword) => {
    const validPass = await bcrypt.compare(getpassword, userpassword)
    return validPass;
}


//<<<<<<<<< function end..........................

//*............................................INFINITE......................................................**//

//<<<<<<<<< API Start..........................

app.post("/registration", upload, async (req, res) => {
    console.log("http://localhost:2000/registration")

    try {

        // let profile_image = req.file.image ? req.file.image : ""
        let name = req.body.name ? req.body.name : ""
        let mobile_number = req.body.mobile_number ? req.body.mobile_number : ""
        let email = req.body.email ? req.body.email : ""
        let password = req.body.password ? req.body.password : ""


        // let file = profile_image.fieldname + "-" + Date.now() + ".jpg"
        let bPassword = await bcryptPassword(password)
        let saveData = {
            // profile_image: "http://localhost:2222/uploads/" + file,
            name: name,
            mobile_number: mobile_number,
            email: email,
            password: bPassword,


        }
        let result = await Registration.create(saveData)

        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Registered Successfully",
                data: result
            })
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Not Registered",
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});

app.post("/login", upload, async (req, res) => {
    console.log("http://localhost:2000/login")

    try {

        let email = req.body.email ? req.body.email : ""
        let password1 = req.body.password ? req.body.password : ""
        let user = await Registration.findOne({ email: email })
        if (user === null) {
            res.status(404).json({
                error: true,
                code: 404,
                message: "User not found.",
            })

        }
        else {
            const isMatch = await decryptPassword(password1, user.password)
            if (isMatch) {

                res.status(201).json({
                    error: true,
                    code: 201,
                    message: "User Logged In",
                    result: user
                })

            }
            else {
                return res.status(400).send({
                    message: "Wrong Password"
                });
            }
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});

app.post("/fee_details", upload, async (req, res) => {
    console.log("http://localhost:2222/fee_details")

    try {

        let user_id = req.body.user_id ? req.body.user_id : ""
        let total_fee = req.body.total_fee ? req.body.total_fee : ""
        let deposit_fee = req.body.deposit_fee ? req.body.deposit_fee : ""
        let installment_details = req.body.installment_details ? req.body.installment_details : []

        let user = await FeeDetails.findOne({ user_id: new ObjectId(user_id) })
        console.log('user', user);
        if (user) {
            let updateData = {
                total_fee: total_fee,
                deposit_fee: deposit_fee,
                installment_details: installment_details,
                modified: Date.now()

            }
            let updateFee = await FeeDetails.updateOne({ user_id: new ObjectId(user_id) }, { $set: updateData }, { new: true })
            if (updateFee) {
                res.status(200).json({
                    error: false,
                    code: 200,
                    message: "Fee Details Updated Successfully",

                })
            }
        } else {
            let saveData = {
                user_id: user_id,
                total_fee: total_fee,
                deposit_fee: deposit_fee,
                installment_details: installment_details,

            }
            let result = await FeeDetails.create(saveData)

            if (result) {
                res.status(200).json({
                    error: false,
                    code: 200,
                    message: "Fee Details Saved Successfully",
                    data: result
                })
            } else {
                res.status(404).json({
                    error: true,
                    code: 404,
                    message: "Fee Details Not Saved",
                })
            }
        }


    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});

app.post("/class_details", upload, async (req, res) => {
    console.log("http://localhost:2222/class_details")

    try {

        let topic = req.body.topic ? req.body.topic : ""
        let video = req.body.video ? req.body.video : []

        let saveData = {
            topic: topic,
            video: video,

        }
        let result = await ClassDetails.create(saveData)

        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Class Details Saved Successfully",
                data: result
            })
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Class Details Not Saved",
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});

app.get("/getUserDetails", upload, async (req, res) => {
    console.log("http://localhost:2000/getUserDetails")

    try {

        // let email = req.body.email ? req.body.email : ""
        let user = await Registration.find({}, { _id: 0, name: 1, email: 1, mobile_number: 1, address: 1 })
        // console.log(user)
        if (user === null) {
            res.status(404).json({
                error: true,
                code: 404,
                message: "User not found.",
            })

        }
        else {
            res.status(201).json({
                error: false,
                code: 201,
                message: "Data fetched",
                result: user
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});

/********************* Govind misthan bhandar API ************************************ */

app.post("/order_details", upload, async (req, res) => {
    console.log("http://localhost:2025/order_details")

    try {

        let name = req.body.name ? req.body.name : ""
        let price = req.body.price ? req.body.price : ""

        let saveData = {
            name: name,
            price: price,

        }
        let result = await OrderDetails.create(saveData)

        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Class Details Saved Successfully",
                data: result
            })
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Class Details Not Saved",
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});

app.get("/getOrderDetails", upload, async (req, res) => {
    console.log("http://localhost:2025/getOrderDetails")

    try {

        // let email = req.body.email ? req.body.email : ""
        let Order = await OrderDetails.find()
        // console.log(Order)
        if (Order === null) {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Order not found.",
            })

        }
        else {
            res.status(201).json({
                error: false,
                code: 201,
                message: "Data fetched",
                result: Order
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});

app.post("/edit_order_details", async (req, res) => {
    console.log("http://localhost:2025/edit_order_details")

    try {

        let order_id = req.body.order_id ? req.body.order_id : ""

        let orderData = await OrderDetails.findOne({ _id: new ObjectId(order_id) })
        let updateData = {
            name: req.body.name ? req.body.name : orderData.name,
            price: req.body.price ? req.body.price : orderData.price

        }
        let result = await OrderDetails.updateOne({ _id: new ObjectId(order_id) }, { $set: updateData })

        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Class Details Saved Successfully",
                data: result
            })
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Class Details Not Saved",
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});


app.post("/sweet_order_details", async (req, res) => {
    console.log("http://localhost:2025/sweet_order_details");

    try {
        const { name, number, summary, sweets } = req.body;

        // Structure to save
        let saveData = {
            name: name || "",
            number: number || "",
            summary: summary || {},
            sweets: sweets || {}
        };

        // Save the data to the database
        let result = await SweetOrderDetails.create(saveData);

        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Sweets Details Saved Successfully",
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Details Not Saved"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});
app.post("/update_sweet_order", async (req, res) => {
    console.log("http://localhost:2025/update_sweet_order");

    try {
        
        const { order_id,name, number, summary, sweets } = req.body;

        // Structure to update
        let updateData = {
            name: name || "",
            number: number || "",
            summary: summary || {},
            sweets: sweets || {}
        };

        // Find the order by order_id
        let result = await SweetOrderDetails.updateOne(
            {_id:new ObjectId(order_id)},
            {
                $set : updateData
            }
        );

        if (result) {
            // Update the order details
            // await existingOrder.update(updateData);

            res.status(200).json({
                error: false,
                code: 200,
                message: "Sweets Details Updated Successfully",
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Order not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});

app.get("/get_sweet_order_details", async (req, res) => {
    console.log("http://localhost:2025/get_sweet_order_details");
    try {
        let result = await SweetOrderDetails.find({ is_packed: 0, is_delivered: 0, is_paid: 0 }, {
            _id: 1,
            name: 1,
            number: 1,
            summary: 1,
            is_packed: 1,
            is_delivered: 1,
            is_paid: 1,
            is_deleted: 1,
            status: 1,
            created: 1,
        });
        let data = result.map(order => ({
            _id: order._id,
            name: order.name,
            number: order.number,
            summary: order.summary,
            is_packed: order.is_packed,
            is_delivered: order.is_delivered,
            is_paid: order.is_paid,
            is_deleted: order.is_deleted,
            status: order.status,
            created: new Date(order.created).toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })
        }));

        console.log(data, "<<<<<<<<<<<<<result");

        if (data.length > 0) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Order Details Retrieved Successfully",
                data: data
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "No Order Details Found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});


app.post("/view_sweets_orders_by_id", async (req, res) => {
    console.log("http://localhost:2025/view_sweets_orders_by_id");
    try {
        // Extract order_id from the request body
        let orderId = req.body.order_id;

        // Find orders by ID
        let result = await SweetOrderDetails.find({ _id: new ObjectId(orderId) });

        if (result.length > 0) {
            // Function to format date to IST
            const formatDateToIST = (date) => {
                return new Date(date).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Kolkata'  // Ensure time zone is set to IST
                });
            };

            // Format created and modified fields
            result = result.map(order => {
                return {
                    ...order.toObject(),
                    created: formatDateToIST(order.created),
                    modified: formatDateToIST(order.modified)
                };
            });

            res.status(200).json({
                error: false,
                code: 200,
                message: "Order details retrieved successfully",
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Order not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});



app.post("/update_sweet_order_packed", async (req, res) => {
    console.log("http://localhost:2025/update_sweet_order_packed");
    const { orderId } = req.body; // Extract the orderId from the request body

    try {
        // Find the order by ID and update the is_packed field to true
        let result = await SweetOrderDetails.findOneAndUpdate(
            { _id: new ObjectId(orderId) },
            { $set: { is_packed: 1, modified: new Date(), } },
            { new: true }
        );
        // console.log(result,"<<<<<<<<<<<<<updattttttttt")
        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Order status updated to packed successfully",
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Order not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});

app.get("/get_packed_orders", async (req, res) => {
    console.log("http://localhost:2025/get_packed_orders");
    try {
        // Find orders where is_packed is true
        let result = await SweetOrderDetails.find({ is_packed: 1, is_delivered: 0, is_paid: 0 });

        if (result.length > 0) {
            // Format created and modified fields to Indian Standard Time (IST)
            result = result.map(order => {
                // Convert UTC date to IST and format
                const formatDateToIST = (date) => {
                    return new Date(date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'  // Ensure time zone is set to IST
                    });
                };

                return {
                    ...order.toObject(),
                    created: formatDateToIST(order.created),
                    modified: formatDateToIST(order.modified)
                };
            });

            res.status(200).json({
                error: false,
                code: 200,
                message: "Packed orders retrieved successfully",
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "No packed orders found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});

app.post("/update_sweet_order_delivered", async (req, res) => {
    console.log("http://localhost:2025/update_sweet_order_delivered");
    const { orderId } = req.body; // Extract the orderId from the request body

    try {
        // Find the order by ID and update the is_delivered field to true
        let result = await SweetOrderDetails.findOneAndUpdate(
            { _id: new ObjectId(orderId) },
            { $set: { is_delivered: 1, updated_date: new Date() } },
            { new: true }
        );

        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Order status updated to delivered successfully",
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Order not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});

app.get("/get_all_orders", async (req, res) => {
    console.log("http://localhost:2025/get_all_orders");
    // Extract the orderId from the request body

    try {
        // Find the order by ID and update the is_delivered field to true
        let result = await SweetOrderDetails.find({})

        if (result.length > 0) {
            // Format created and modified fields to Indian Standard Time (IST)
            result = result.map(order => {
                // Convert UTC date to IST and format
                const formatDateToIST = (date) => {
                    return new Date(date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'  // Ensure time zone is set to IST
                    });
                };

                return {
                    ...order.toObject(),
                    created: formatDateToIST(order.created),
                    modified: formatDateToIST(order.modified)
                };
            });

            res.status(200).json({
                error: false,
                code: 200,
                message: "Packed orders retrieved successfully",
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "No packed orders found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});
app.get("/get_delivered_orders", async (req, res) => {
    console.log("http://localhost:2025/get_delivered_orders");
    try {
        // Find orders where is_delivered is true
        let result = await SweetOrderDetails.find({ is_delivered: 1, is_paid: 0 });

        if (result.length > 0) {
            // Format created and modified fields to Indian Standard Time (IST)
            result = result.map(order => {
                // Convert UTC date to IST and format
                const formatDateToIST = (date) => {
                    return new Date(date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'  // Ensure time zone is set to IST
                    });
                };

                return {
                    ...order.toObject(),
                    created: formatDateToIST(order.created),
                    modified: formatDateToIST(order.modified)
                };
            });

            res.status(200).json({
                error: false,
                code: 200,
                message: "Packed orders retrieved successfully",
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "No packed orders found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});


app.post("/update_sweet_order_paid", async (req, res) => {
    console.log("http://localhost:2025/update_sweet_order_paid");
    const { orderId, received_amount } = req.body; // Extract the orderId from the request body

    try {
        // Find the order by ID and update the is_paid field to true
        let result = await SweetOrderDetails.findOneAndUpdate(
            { _id: new ObjectId(orderId) },
            { $set: { is_paid: 1, received_amount: received_amount, updated_date: new Date() } },
            { new: true }
        );

        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Order status updated to paid successfully",
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Order not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});

app.get("/get_paid_orders", async (req, res) => {
    console.log("http://localhost:2025/get_paid_orders");
    try {
        // Find orders where is_paid is true
        let result = await SweetOrderDetails.find({ is_paid: 1 });

        if (result.length > 0) {
            // Format created and modified fields to Indian Standard Time (IST)
            result = result.map(order => {
                // Convert UTC date to IST and format
                const formatDateToIST = (date) => {
                    return new Date(date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'  // Ensure time zone is set to IST
                    });
                };

                return {
                    ...order.toObject(),
                    created: formatDateToIST(order.created),
                    modified: formatDateToIST(order.modified)
                };
            });

            res.status(200).json({
                error: false,
                code: 200,
                message: "Packed orders retrieved successfully",
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "No packed orders found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});


app.get("/get_sweets_aggregation", async (req, res) => {
    console.log("http://localhost:2025/get_sweets_aggregation");
    try {
        // First aggregation to get the sweets data
        let result = await SweetOrderDetails.aggregate([
            {
                $project: {
                    sweets: {
                        $objectToArray: "$sweets"
                    }
                }
            },
            { $unwind: "$sweets" },
            {
                $group: {
                    _id: "$sweets.k",
                    totalOneKg: { $sum: "$sweets.v.oneKg" },
                    totalHalfKg: { $sum: "$sweets.v.halfKg" },
                    totalQuarterKg: { $sum: "$sweets.v.quarterKg" },
                    totalWeight: {
                        $sum: {
                            $add: [
                                { $multiply: ["$sweets.v.oneKg", 1] },
                                { $multiply: ["$sweets.v.halfKg", 0.5] },
                                { $multiply: ["$sweets.v.quarterKg", 0.25] }
                            ]
                        }
                    },
                }
            },
            {
                $project: {
                    sweetName: "$_id",
                    totalOneKg: 1,
                    totalHalfKg: 1,
                    totalQuarterKg: 1,
                    totalWeight: 1,
                    _id: 0
                }
            }
        ]);

        // Second aggregation to get other weight and packing data
        let otherResult = await SweetOrderDetails.aggregate([
            {
                $project: {
                    sweetsArray: { $objectToArray: "$sweets" }
                }
            },
            { $unwind: "$sweetsArray" },
            {
                $group: {
                    _id: {
                        sweetName: "$sweetsArray.k",
                        otherWeight: "$sweetsArray.v.otherWeight",
                        otherWeight2: "$sweetsArray.v.otherWeight2"
                    },
                    packings: { $sum: "$sweetsArray.v.otherPackings" },
                    packings2: { $sum: "$sweetsArray.v.otherPackings2" }
                }
            },
            {
                $group: {
                    _id: "$_id.sweetName",
                    totalOtherWeight: {
                        $push: {
                            k: "$_id.otherWeight",
                            v: "$packings"
                        }
                    },
                    totalOtherWeight2: {
                        $push: {
                            k: "$_id.otherWeight2",
                            v: "$packings2"
                        }
                    },
                    totalOtherPackings: { $sum: "$packings" },
                    totalOtherPackings2: { $sum: "$packings2" }
                }
            },
            {
                $addFields: {
                    totalOtherWeight: {
                        $arrayToObject: {
                            $map: {
                                input: {
                                    $reduce: {
                                        input: "$totalOtherWeight",
                                        initialValue: [],
                                        in: {
                                            $concatArrays: [
                                                "$$value",
                                                [
                                                    {
                                                        k: { $toString: "$$this.k" },
                                                        v: {
                                                            $sum: {
                                                                $map: {
                                                                    input: {
                                                                        $filter: {
                                                                            input: "$totalOtherWeight",
                                                                            as: "item",
                                                                            cond: { $eq: ["$$item.k", "$$this.k"] }
                                                                        }
                                                                    },
                                                                    as: "item",
                                                                    in: "$$item.v"
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            ]
                                        }
                                    }
                                },
                                as: "item",
                                in: "$$item"
                            }
                        }
                    },
                    totalOtherWeight2: {
                        $arrayToObject: {
                            $map: {
                                input: {
                                    $reduce: {
                                        input: "$totalOtherWeight2",
                                        initialValue: [],
                                        in: {
                                            $concatArrays: [
                                                "$$value",
                                                [
                                                    {
                                                        k: { $toString: "$$this.k" },
                                                        v: {
                                                            $sum: {
                                                                $map: {
                                                                    input: {
                                                                        $filter: {
                                                                            input: "$totalOtherWeight2",
                                                                            as: "item",
                                                                            cond: { $eq: ["$$item.k", "$$this.k"] }
                                                                        }
                                                                    },
                                                                    as: "item",
                                                                    in: "$$item.v"
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            ]
                                        }
                                    }
                                },
                                as: "item",
                                in: "$$item"
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    sweetName: "$_id",
                    totalOtherWeight: 1,
                    totalOtherPackings: 1,
                    totalOtherWeight2: 1,
                    totalOtherPackings2: 1,
                    _id: 0
                }
            },
            { $sort: { sweetName: 1 } }
        ]);

        // Merge results based on sweetName
        const mergedResults = result.map(item => {
            const otherItem = otherResult.find(o => o.sweetName === item.sweetName);
            return {
                ...item,
                ...otherItem
            };
        });

        if (mergedResults.length > 0) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Sweets aggregation retrieved successfully",
                data: mergedResults
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "No sweets data found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});

app.get("/get_packed_sweets_aggregation", async (req, res) => {
    console.log("http://localhost:2025/get_packed_sweets_aggregation");
    try {
        // First aggregation to get the sweets data
        let result = await SweetOrderDetails.aggregate([
            { $match: { is_packed: 1 } },
            {
                $project: {
                    sweets: {
                        $objectToArray: "$sweets"
                    }
                }
            },
            { $unwind: "$sweets" },
            {
                $group: {
                    _id: "$sweets.k",
                    totalOneKg: { $sum: "$sweets.v.oneKg" },
                    totalHalfKg: { $sum: "$sweets.v.halfKg" },
                    totalQuarterKg: { $sum: "$sweets.v.quarterKg" },
                    totalWeight: {
                        $sum: {
                            $add: [
                                { $multiply: ["$sweets.v.oneKg", 1] },
                                { $multiply: ["$sweets.v.halfKg", 0.5] },
                                { $multiply: ["$sweets.v.quarterKg", 0.25] }
                            ]
                        }
                    },
                }
            },
            {
                $project: {
                    sweetName: "$_id",
                    totalOneKg: 1,
                    totalHalfKg: 1,
                    totalQuarterKg: 1,
                    totalWeight: 1,
                    _id: 0
                }
            }
        ]);

        // Second aggregation to get other weight and packing data
        let otherResult = await SweetOrderDetails.aggregate([
            { $match: { is_packed: 1 } },
            {
                $project: {
                    sweetsArray: { $objectToArray: "$sweets" }
                }
            },
            { $unwind: "$sweetsArray" },
            {
                $group: {
                    _id: {
                        sweetName: "$sweetsArray.k",
                        otherWeight: "$sweetsArray.v.otherWeight",
                        otherWeight2: "$sweetsArray.v.otherWeight2"
                    },
                    packings: { $sum: "$sweetsArray.v.otherPackings" },
                    packings2: { $sum: "$sweetsArray.v.otherPackings2" }
                }
            },
            {
                $group: {
                    _id: "$_id.sweetName",
                    totalOtherWeight: {
                        $push: {
                            k: "$_id.otherWeight",
                            v: "$packings"
                        }
                    },
                    totalOtherWeight2: {
                        $push: {
                            k: "$_id.otherWeight2",
                            v: "$packings2"
                        }
                    },
                    totalOtherPackings: { $sum: "$packings" },
                    totalOtherPackings2: { $sum: "$packings2" }
                }
            },
            {
                $addFields: {
                    totalOtherWeight: {
                        $arrayToObject: {
                            $map: {
                                input: {
                                    $reduce: {
                                        input: "$totalOtherWeight",
                                        initialValue: [],
                                        in: {
                                            $concatArrays: [
                                                "$$value",
                                                [
                                                    {
                                                        k: { $toString: "$$this.k" },
                                                        v: {
                                                            $sum: {
                                                                $map: {
                                                                    input: {
                                                                        $filter: {
                                                                            input: "$totalOtherWeight",
                                                                            as: "item",
                                                                            cond: { $eq: ["$$item.k", "$$this.k"] }
                                                                        }
                                                                    },
                                                                    as: "item",
                                                                    in: "$$item.v"
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            ]
                                        }
                                    }
                                },
                                as: "item",
                                in: "$$item"
                            }
                        }
                    },
                    totalOtherWeight2: {
                        $arrayToObject: {
                            $map: {
                                input: {
                                    $reduce: {
                                        input: "$totalOtherWeight2",
                                        initialValue: [],
                                        in: {
                                            $concatArrays: [
                                                "$$value",
                                                [
                                                    {
                                                        k: { $toString: "$$this.k" },
                                                        v: {
                                                            $sum: {
                                                                $map: {
                                                                    input: {
                                                                        $filter: {
                                                                            input: "$totalOtherWeight2",
                                                                            as: "item",
                                                                            cond: { $eq: ["$$item.k", "$$this.k"] }
                                                                        }
                                                                    },
                                                                    as: "item",
                                                                    in: "$$item.v"
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            ]
                                        }
                                    }
                                },
                                as: "item",
                                in: "$$item"
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    sweetName: "$_id",
                    totalOtherWeight: 1,
                    totalOtherPackings: 1,
                    totalOtherWeight2: 1,
                    totalOtherPackings2: 1,
                    _id: 0
                }
            },
            { $sort: { sweetName: 1 } }
        ]);

        // Merge results based on sweetName
        const mergedResults = result.map(item => {
            const otherItem = otherResult.find(o => o.sweetName === item.sweetName);
            return {
                ...item,
                ...otherItem
            };
        });

        if (mergedResults.length > 0) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Sweets aggregation retrieved successfully",
                data: mergedResults
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "No sweets data found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: true,
            code: 400,
            message: "Something went wrong",
            data: error
        });
    }
});

app.post('/get_order_based_on_name', async (req, res) => {


    console.log("http://localhost:2025/get_order_based_on_name");


    const name = req.body.name ? req.body.name : "";


    const type = req.body.type ? req.body.type : "";


    try {


        const regex = new RegExp(name, 'i');


        let searchCondition = { name: regex };

        if (type === "all") {

            searchCondition

        } else if (type === "packed") {


            searchCondition.is_packed = 1;


            searchCondition.is_delivered = 0;


            searchCondition.is_paid = 0;


        } else if (type === "initial") {


            searchCondition.is_packed = 0;


            searchCondition.is_delivered = 0;


            searchCondition.is_paid = 0;

        } else if (type === "delivered") {


            searchCondition.is_packed = 1;


            searchCondition.is_delivered = 1;


            searchCondition.is_paid = 0;


        } else if (type === "paid") {


            searchCondition.is_packed = 1;


            searchCondition.is_delivered = 1;


            searchCondition.is_paid = 1;

        }


        let result = await SweetOrderDetails.find(searchCondition, {

            _id: 1,

            name: 1,


            number: 1,


            summary: 1,


            is_packed: 1,


            is_delivered: 1,


            is_paid: 1,


            is_deleted: 1,


            status: 1,


            created: 1,

        });


        let data = result.map(order => ({

            _id: order._id,

            name: order.name,


            number: order.number,


            summary: order.summary,


            is_packed: order.is_packed,


            is_delivered: order.is_delivered,


            is_paid: order.is_paid,


            is_deleted: order.is_deleted,


            status: order.status,


            created: new Date(order.created).toLocaleString('en-IN', {


                day: '2-digit',


                month: '2-digit',


                year: 'numeric',


                hour: '2-digit',


                minute: '2-digit',


                second: '2-digit',


                hour12: true

            })

        }));


        if (data.length > 0) {


            res.status(200).json({


                error: false,


                code: 200,


                message: "Order Details Retrieved Successfully",


                data: data

            });


        } else {


            res.status(404).json({


                error: false,


                code: 201,


                message: "No Order Details Found"

            });

        }


    } catch (error) {


        console.error(error);


        res.status(400).json({


            error: true,


            code: 400,


            message: "Something went wrong",


            data: error

        });

    }

});


app.post('/delete_order', async (req, res) => {
    const order_id = req.body.order_id;

    try {
        const result = await SweetOrderDetails.deleteOne({ _id: new ObjectId(order_id) });

        if (!result) {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Order not found"
            });
        }

        res.status(200).json({
            error: false,
            code: 200,
            message: "Order deleted successfully",
        });
        console.log("Order deleted successfully")
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/update_remaining_order', async (req, res) => {
    const order_id = req.body.order_id;
    const remaining_order = req.body.remaining_order ? req.body.remaining_order : {};

    try {
        const result = await SweetOrderDetails.updateOne(
            { _id: new ObjectId(order_id) },
            { $set: { remaining_order: remaining_order } }
        );

        if (!result) {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Order not found"
            });
        }

        res.status(200).json({
            error: false,
            code: 200,
            message: " Remaining Order  updated successfully",
        });
        console.log("Order updated successfully")
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post("/addExpence", upload, async (req, res) => {
    console.log("http://localhost:2025/addExpence")

    try {

        let bill_image = req.file ? req.file.filename : "";     // req.body.image
        let type = req.body.type ? req.body.type : ""
        let reciver_name = req.body.reciver_name ? req.body.reciver_name : ""
        let amount = req.body.amount ? req.body.amount : ""
        let remarks = req.body.remarks ? req.body.remarks : ""
        let saveData = {
            type: type,
            reciver_name: reciver_name,
            amount: amount,
            remarks: remarks,
            bill_image: "http://localhost:2025/" + bill_image,


        }
        let result = await Expence.create(saveData)

        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Add expence Successfully",
                data: result
            })
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Not add",
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});

app.get("/getExpence", async (req, res) => {
    console.log("http://localhost:2025/getExpence")

    try {

        // let email = req.body.email ? req.body.email : ""
        let user = await Expence.find({})
        // console.log(user)
        if (user === null) {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Expence not found.",
            })

        }
        else {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Data fetched",
                result: user
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});

app.post("/viewExpence", async (req, res) => {
    console.log("http://localhost:2025/viewExpence")

    try {

        let expence_id = req.body.expence_id ? req.body.expence_id : ""

        let result = await Expence.find({ _id: new ObjectId(expence_id) })
        // console.log(user)
        if (result === null) {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Expence not found.",
            })

        }
        else {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Data fetched",
                result: result
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});

app.post('/delete_expence', async (req, res) => {
    console.log("http://localhost:2025/delete_expence")

    let expence_id = req.body.expence_id ? req.body.expence_id : ""
    try {
        const result = await Expence.deleteOne({ _id: new ObjectId(expence_id) });

        if (!result) {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Order not found"
            });
        }

        res.status(200).json({
            error: false,
            code: 200,
            message: "Expence deleted successfully",
        });
        console.log("Expence deleted successfully")
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.post("/add_extra_sweets", upload, async (req, res) => {
    console.log("http://localhost:2025/add_extra_sweets")

    try {

        // let bill_image = req.file ? req.file.filename : "";     // req.body.image
        let sweet_name = req.body.sweet_name ? req.body.sweet_name : ""
        let price = req.body.price ? req.body.price : ""
        let amount = req.body.amount ? req.body.amount : ""
        // let remarks = req.body.remarks ? req.body.remarks : ""
        let saveData = {
            sweet_name: sweet_name,
            price: price,
            amount: amount,
           


        }
        let result = await ExtraSweets.create(saveData)

        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Add expence Successfully",
                data: result
            })
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Not add",
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});
app.get("/get_extra_sweets", async (req, res) => {
    console.log("http://localhost:2025/get_extra_sweets")

    try {

        // let email = req.body.email ? req.body.email : ""
        let user = await ExtraSweets.find({})
        // console.log(user)
        if (user === null) {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Expence not found.",
            })

        }
        else {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Data fetched",
                result: user
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

});
app.post('/update_extra_sweets', async (req, res) => {
    const extra_id = req.body.extra_id;

    let extraSweetResult = await ExtraSweets.findOne({_id:new ObjectId(extra_id)})

    let sweet_name = req.body.sweet_name ? req.body.sweet_name : extraSweetResult.sweet_name
    let price = req.body.price ? req.body.price :  extraSweetResult.price
    let amount = req.body.amount ? req.body.amount :  extraSweetResult.amount
    try {
        const result = await ExtraSweets.updateOne(
            { _id: new ObjectId(extra_id) },
            { $set: { 
                sweet_ame: sweet_name ,
                price:price,
                amount:amount
            }}
        );

        if (!result) {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Order not found"
            });
        }

        res.status(200).json({
            error: false,
            code: 200,
            message: "updated successfully",
        });
        console.log("Order updated successfully")
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.post('/delete_extra_sweets', async (req, res) => {
    console.log("http://localhost:2025/delete_extra_sweets")

    let extra_id = req.body.extra_id ? req.body.extra_id : ""
    try {
        const result = await ExtraSweets.deleteOne({ _id: new ObjectId(extra_id) });

        if (!result) {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Order not found"
            });
        }

        res.status(200).json({
            error: false,
            code: 200,
            message: "Expence deleted successfully",
        });
        console.log("Expence deleted successfully")
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});