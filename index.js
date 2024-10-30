const express = require("express");
const mongoose = require("mongoose");
const fs = require('fs')
const multer = require("multer");
const cors = require("cors");
const async = require('async');
const dotenv = require("dotenv")
var bcrypt = require('bcryptjs');
const { ObjectId } = require("mongoose").Types;
const path = require("path")
dotenv.config()
const app = express();
app.use(express.json());
app.use(cors());
let imagepath = path.join(__dirname, "./uploads")
app.use(express.static(imagepath))
require("./db_api/config")
const { Registration, FeeDetails, ClassDetails, OrderDetails, SweetOrderDetails, Expence, ExtraSweets } = require("./db_api/schema")

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

app.get("/",(req,res)=>{
    res.send("Welcome To EC2")
})
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
app.post("/get_data_by_Sweetname", async (req, res) => {
    console.log("http://localhost:2025/get_data_by_Sweetname");

    const { sweetname } = req.body; // Get sweetname from request body

    if (!sweetname) {
        return res.status(400).json({
            error: true,
            code: 400,
            message: "Sweetname parameter is required in the request body"
        });
    }

    try {
        let orders = await SweetOrderDetails.find({}); // Fetch all orders

        if (orders.length > 0) {
            // Filter orders to include only those where the specified sweetname has at least one non-zero value
            orders = orders.filter(order => {
                const sweets = order.sweets;
                if (sweets && sweets[sweetname]) {
                    // Extract the sweet object for the given sweetname
                    const sweetDetails = sweets[sweetname];

                    // Filter out orders where all values (except price and totalWeight) are zero
                    return Object.keys(sweetDetails).some(key => 
                        key !== "price" && key !== "totalWeight" && sweetDetails[key] > 0
                    );
                }
                return false;
            });

            // Format created and modified fields to Indian Standard Time (IST)
            orders = orders.map(order => {
                const formatDateToIST = (date) => {
                    return new Date(date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
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
                message: "Filtered orders retrieved successfully",
                data: orders
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "No orders found"
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
        const { name, number, summary, sweets, payment_mode, retail_order ,received_amount} = req.body;

        // Retrieve the last order by sorting in descending order of `order_no`
        let lastOrder = await SweetOrderDetails.findOne({}).sort({ order_no: -1 });

        // Determine the next order number
        let orderNo = lastOrder ? lastOrder.order_no + 1 : 1;

        // Structure to save with conditional check for retail_order
        let saveData = {
            order_no: orderNo,
            name: name || "",
            payment_mode: payment_mode || "",
            received_amount: received_amount || "",
            number: number || "",
            summary: summary || {},
            sweets: sweets || {},
            remaining_order: sweets || {},
            retail_order: retail_order || false,
            is_delivered: retail_order ? 1 : 0, // Set to 1 if retail_order is true
            is_paid: retail_order ? 1 : 0,
            is_packed: retail_order ? 1 : 0       // Set to 1 if retail_order is true
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

        const { order_id, name, number, summary, sweets } = req.body;

        // Structure to update
        let updateData = {
            name: name || "",
            number: number || "",
            summary: summary || {},
            sweets: sweets || {}
        };

        // Find the order by order_id
        let result = await SweetOrderDetails.updateOne(
            { _id: new ObjectId(order_id) },
            {
                $set: updateData
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

app.post("/get_sweet_order_details", async (req, res) => {
    console.log("http://localhost:2025/get_sweet_order_details");

    // Default pagination parameters
    const perPage = req.body.perPage || 10;
    const page = parseInt(req.body.page) || 1;

    try {
        // Count total records for pagination metadata
        const totalRecords = await SweetOrderDetails.countDocuments({
            is_packed: 0,
            is_delivered: 0,
            is_paid: 0,
            is_half_packed: 0
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        // Fetch records for the current page with the specified limit
        let result = await SweetOrderDetails.find(
            { is_packed: 0, is_delivered: 0, is_paid: 0, is_half_packed: 0 },
            {
                _id: 1,
                name: 1,
                number: 1,
                sweets: 1,
                summary: 1,
                is_packed: 1,
                order_no: 1,
                is_delivered: 1,
                is_paid: 1,
                is_deleted: 1,
                status: 1,
                created: 1,
            }
        )
            .skip((page - 1) * perPage)
            .limit(perPage);

        // Format each order's data
        let data = result.map(order => ({
            _id: order._id,
            name: order.name,
            sweets: order.sweets,
            order_no: order.order_no,
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
                hour12: true,
                timeZone: 'Asia/Kolkata'
            })
        }));

        if (data.length > 0) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Order Details Retrieved Successfully",
                total_records: totalRecords,
                total_pages: totalPages,
                current_page: page,
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
            { $set: { is_packed: 1,is_half_packed:0, modified: new Date(), } },
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

app.post("/get_packed_orders", async (req, res) => {
    console.log("http://localhost:2025/get_packed_orders");

    // Default pagination parameters
    const perPage = req.body.perPage || 10;
    const page = parseInt(req.body.page) || 1;

    try {
        // Count total records for pagination metadata
        const totalRecords = await SweetOrderDetails.countDocuments({
            is_packed: 1,
            is_delivered: 0,
            is_paid: 0
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        // Fetch records for the current page with the specified limit
        let result = await SweetOrderDetails.find(
            { is_packed: 1, is_delivered: 0, is_paid: 0 }
        )
        .skip((page - 1) * perPage)
        .limit(perPage);

        if (result.length > 0) {
            // Format created and modified fields to Indian Standard Time (IST)
            result = result.map(order => {
                const formatDateToIST = (date) => {
                    return new Date(date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
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
                total_records: totalRecords,
                total_pages: totalPages,
                current_page: page,
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

app.post("/get_half_packed_orders", async (req, res) => {
    console.log("http://localhost:2025/get_half_packed_orders");

    // Default pagination parameters
    const perPage = req.body.perPage || 10;
    const page = parseInt(req.body.page) || 1;

    try {
        // Count total records for pagination metadata
        const totalRecords = await SweetOrderDetails.countDocuments({
            is_half_packed: 1,
            is_delivered: 0,
            is_paid: 0
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        // Fetch records for the current page with the specified limit
        let result = await SweetOrderDetails.find(
            { is_half_packed: 1, is_delivered: 0, is_paid: 0 }
        )
        .skip((page - 1) * perPage)
        .limit(perPage);

        if (result.length > 0) {
            // Format created and modified fields to Indian Standard Time (IST)
            result = result.map(order => {
                const formatDateToIST = (date) => {
                    return new Date(date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
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
                message: "Half-packed orders retrieved successfully",
                total_records: totalRecords,
                total_pages: totalPages,
                current_page: page,
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "No half-packed orders found"
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
app.get("/get_dashboard", async (req, res) => {
    console.log("http://localhost:2025/get_dashboard");
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

app.post("/get_all_orders", async (req, res) => {
    console.log("http://localhost:2025/get_all_orders");

    // Default pagination parameters
    const perPage = req.body.perPage || 10;
    const page = parseInt(req.body.page) || 1;

    try {
        // Count total records for pagination metadata
        const totalRecords = await SweetOrderDetails.countDocuments({});
        const totalPages = Math.ceil(totalRecords / perPage);

        // Fetch the records for the current page, limited to perPage entries
        let result = await SweetOrderDetails.find({})
            .skip((page - 1) * perPage)
            .limit(perPage);

        if (result.length > 0) {
            // Format created and modified fields to Indian Standard Time (IST)
            result = result.map(order => {
                const formatDateToIST = (date) => {
                    return new Date(date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                    });
                };

                return {
                    ...order.toObject(),
                    created: formatDateToIST(order.created),
                    modified: formatDateToIST(order.modified)
                };
            });

            // Response with pagination metadata
            res.status(200).json({
                error: false,
                code: 200,
                message: "Packed orders retrieved successfully",
                total_records: totalRecords,
                total_pages: totalPages,
                current_page: page,
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


app.post("/get_delivered_orders", async (req, res) => {
    console.log("http://localhost:2025/get_delivered_orders");

    // Default pagination parameters
    const perPage = req.body.perPage || 10;
    const page = parseInt(req.body.page) || 1;

    try {
        // Count total records for pagination metadata
        const totalRecords = await SweetOrderDetails.countDocuments({
            is_delivered: 1,
            is_paid: 0
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        // Fetch records for the current page with the specified limit
        let result = await SweetOrderDetails.find(
            { is_delivered: 1, is_paid: 0 }
        )
        .skip((page - 1) * perPage)
        .limit(perPage);

        if (result.length > 0) {
            // Format created and modified fields to Indian Standard Time (IST)
            result = result.map(order => {
                const formatDateToIST = (date) => {
                    return new Date(date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
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
                message: "Delivered orders retrieved successfully",
                total_records: totalRecords,
                total_pages: totalPages,
                current_page: page,
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "No delivered orders found"
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
    const { orderId, received_amount, payment_mode } = req.body; // Extract the orderId from the request body

    try {
        // Find the order by ID and update the is_paid field to true
        let result = await SweetOrderDetails.findOneAndUpdate(
            { _id: new ObjectId(orderId) },
            { $set: { is_paid: 1,is_delivered:1,is_packed:1, received_amount: received_amount, payment_mode: payment_mode, updated_date: new Date() } },
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

app.post("/get_paid_orders", async (req, res) => {
    console.log("http://localhost:2025/get_paid_orders");

    // Default pagination parameters
    const perPage = req.body.perPage || 10;
    const page = parseInt(req.body.page) || 1;

    try {
        // Count total records for pagination metadata
        const totalRecords = await SweetOrderDetails.countDocuments({
            is_paid: 1
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        // Fetch records for the current page with the specified limit
        let result = await SweetOrderDetails.find(
            { is_paid: 1 }
        )
        .skip((page - 1) * perPage)
        .limit(perPage);

        if (result.length > 0) {
            // Format created and modified fields to Indian Standard Time (IST)
            result = result.map(order => {
                const formatDateToIST = (date) => {
                    return new Date(date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
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
                message: "Paid orders retrieved successfully",
                total_records: totalRecords,
                total_pages: totalPages,
                current_page: page,
                data: result
            });
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "No paid orders found"
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
        // Fully packed orders
        let packedResult = await SweetOrderDetails.aggregate([
            { $match: { is_packed: 1 } },
            {
                $project: {
                    sweets: { $objectToArray: "$sweets" }
                }
            },
            { $unwind: "$sweets" },
            {
                $group: {
                    _id: "$sweets.k",
                    totalOneKg: { $sum: "$sweets.v.oneKg" },
                    totalHalfKg: { $sum: "$sweets.v.halfKg" },
                    totalQuarterKg: { $sum: "$sweets.v.quarterKg" },
                    totalOtherWeight: {
                        $push: {
                            k: "$sweets.v.otherWeight",
                            v: "$sweets.v.otherPackings"
                        }
                    },
                    totalOtherWeight2: {
                        $push: {
                            k: "$sweets.v.otherWeight2",
                            v: "$sweets.v.otherPackings2"
                        }
                    },
                    totalWeight: {
                        $sum: {
                            $add: [
                                { $multiply: ["$sweets.v.oneKg", 1] },
                                { $multiply: ["$sweets.v.halfKg", 0.5] },
                                { $multiply: ["$sweets.v.quarterKg", 0.25] }
                            ]
                        }
                    }
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
                    totalOneKg: 1,
                    totalHalfKg: 1,
                    totalQuarterKg: 1,
                    totalOtherWeight: 1,
                    totalOtherWeight2: 1,
                    totalWeight: 1,
                    _id: 0
                }
            }
        ]);

        // Partially packed orders
        let partialPackedResult = await SweetOrderDetails.aggregate([
            { $match: { is_packed: 0, remaining_order: { $ne: {} } } },
            {
                $project: {
                    sweetsArray: { $objectToArray: "$sweets" },
                    remainingOrderArray: { $objectToArray: "$remaining_order" }
                }
            },
            { $unwind: "$sweetsArray" },
            { $unwind: "$remainingOrderArray" },
            {
                $match: {
                    $expr: { $eq: ["$sweetsArray.k", "$remainingOrderArray.k"] }
                }
            },
            {
                $group: {
                    _id: "$sweetsArray.k",
                    totalOneKg: { $sum: { $subtract: ["$sweetsArray.v.oneKg", "$remainingOrderArray.v.oneKg"] } },
                    totalHalfKg: { $sum: { $subtract: ["$sweetsArray.v.halfKg", "$remainingOrderArray.v.halfKg"] } },
                    totalQuarterKg: { $sum: { $subtract: ["$sweetsArray.v.quarterKg", "$remainingOrderArray.v.quarterKg"] } },
                    totalOtherWeight: {
                        $push: {
                            k: "$sweetsArray.v.otherWeight",
                            v: { $subtract: ["$sweetsArray.v.otherPackings", "$remainingOrderArray.v.otherPackings"] }
                        }
                    },
                    totalOtherWeight2: {
                        $push: {
                            k: "$sweetsArray.v.otherWeight2",
                            v: { $subtract: ["$sweetsArray.v.otherPackings2", "$remainingOrderArray.v.otherPackings2"] }
                        }
                    },
                    totalWeight: {
                        $sum: {
                            $add: [
                                { $multiply: [{ $subtract: ["$sweetsArray.v.oneKg", "$remainingOrderArray.v.oneKg"] }, 1] },
                                { $multiply: [{ $subtract: ["$sweetsArray.v.halfKg", "$remainingOrderArray.v.halfKg"] }, 0.5] },
                                { $multiply: [{ $subtract: ["$sweetsArray.v.quarterKg", "$remainingOrderArray.v.quarterKg"] }, 0.25] }
                            ]
                        }
                    }
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
                    totalOneKg: 1,
                    totalHalfKg: 1,
                    totalQuarterKg: 1,
                    totalOtherWeight: 1,
                    totalOtherWeight2: 1,
                    totalWeight: 1,
                    _id: 0
                }
            }
        ]);

        // Combine packedResult and partialPackedResult
        const combinedResult = [...packedResult, ...partialPackedResult].reduce((acc, item) => {
            const existing = acc.find(i => i.sweetName === item.sweetName);
            if (existing) {
                existing.totalOneKg += item.totalOneKg;
                existing.totalHalfKg += item.totalHalfKg;
                existing.totalQuarterKg += item.totalQuarterKg;
                existing.totalWeight += item.totalWeight;

                existing.totalOtherWeight = { ...existing.totalOtherWeight, ...item.totalOtherWeight };
                existing.totalOtherWeight2 = { ...existing.totalOtherWeight2, ...item.totalOtherWeight2 };
            } else {
                acc.push(item);
            }
            return acc;
        }, []);

        res.status(200).json({
            error: false,
            code: 200,
            message: "Sweets aggregation retrieved successfully",
            data: combinedResult
        });
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

    const name = req.body.name || "";
    const type = req.body.type || "";
    const perPage = req.body.perPage || 10;
    const page = parseInt(req.body.page) || 1;

    try {
        const regex = new RegExp(name, 'i');
        let searchCondition = { name: regex };

        if (type === "packed") {
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

        // Count total records for pagination
        const totalRecords = await SweetOrderDetails.countDocuments(searchCondition);
        const totalPages = Math.ceil(totalRecords / perPage);

        // Fetch records for the current page with the specified limit
        let result = await SweetOrderDetails.find(searchCondition, {
            _id: 1,
            name: 1,
            order_no: 1,
            number: 1,
            sweets:1,
            received_amount:1,
            payment_mode:1,
            summary: 1,
            is_packed: 1,
            is_delivered: 1,
            is_paid: 1,
            is_deleted: 1,
            status: 1,
            created: 1,
        })
        .skip((page - 1) * perPage)
        .limit(perPage);

        // Format each order's data
        let data = result.map(order => ({
            _id: order._id,
            name: order.name,
            received_amount: order.received_amount,
            payment_mode: order.payment_mode,
            order_no: order.order_no,
            number: order.number,
            sweets: order.sweets,
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
                hour12: true,
                timeZone: 'Asia/Kolkata'
            })
        }));

        if (data.length > 0) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Order Details Retrieved Successfully",
                total_records: totalRecords,
                total_pages: totalPages,
                current_page: page,
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


app.post('/get_order_based_on_order_no', async (req, res) => {
    console.log("http://localhost:2025/get_order_based_on_order_no");

    const orderNo = req.body.order_no || "";
    const type = req.body.type || "";
    const perPage = req.body.perPage || 10;
    const page = parseInt(req.body.page) || 1;

    try {
        // Define search condition based on order_no presence and type
        let searchCondition = {};

        if (orderNo) {
            searchCondition.order_no = orderNo;
        }

        if (type === "packed") {
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

        // Count total records for pagination
        const totalRecords = await SweetOrderDetails.countDocuments(searchCondition);
        const totalPages = Math.ceil(totalRecords / perPage);

        // Fetch records for the current page with the specified limit
        let result = await SweetOrderDetails.find(searchCondition, {
            _id: 1,
            name: 1,
            number: 1,
            received_amount: 1,
            payment_mode: 1,
            summary: 1,
            sweets:1,
            is_packed: 1,
            order_no: 1,
            is_delivered: 1,
            is_paid: 1,
            is_deleted: 1,
            status: 1,
            created: 1,
        })
        .skip((page - 1) * perPage)
        .limit(perPage);

        // Format the result data
        let data = result.map(order => ({
            _id: order._id,
            name: order.name,
            received_amount: order.received_amount,
            payment_mode: order.payment_mode,
            order_no: order.order_no,
            number: order.number,
            sweets: order.sweets,
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
                hour12: true,
                timeZone: 'Asia/Kolkata'
            })
        }));

        // Send response based on data presence
        if (data.length > 0) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Order Details Retrieved Successfully",
                total_records: totalRecords,
                total_pages: totalPages,
                current_page: page,
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
    const is_half_packed = req.body.is_half_packed ? req.body.is_half_packed : 0;

    try {
        const result = await SweetOrderDetails.updateOne(
            { _id: new ObjectId(order_id) },
            { $set: { remaining_order: remaining_order, is_half_packed: is_half_packed } }
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

    let extraSweetResult = await ExtraSweets.findOne({ _id: new ObjectId(extra_id) })

    let sweet_name = req.body.sweet_name ? req.body.sweet_name : extraSweetResult.sweet_name
    let price = req.body.price ? req.body.price : extraSweetResult.price
    let amount = req.body.amount ? req.body.amount : extraSweetResult.amount
    try {
        const result = await ExtraSweets.updateOne(
            { _id: new ObjectId(extra_id) },
            {
                $set: {
                    sweet_ame: sweet_name,
                    price: price,
                    amount: amount
                }
            }
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



app.post('/update_sweets', async (req, res) => {
    console.log("http://localhost:2025/update_sweets")

    let order_id = req.body.order_id ? req.body.order_id : ""
    let count = req.body.count ? req.body.count : ""
    let sweet_name = req.body.sweet_name ? req.body.sweet_name : ""
    let box = req.body.box ? req.body.box : ""
    try {
        const result = await SweetOrderDetails.findOne({ _id: new ObjectId(order_id) }, { _id: 0 });

        if (!result) {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Order not found"
            });
        } else {
            let a = result.remaining_order[sweet_name][box]
            result.remaining_order[sweet_name][box] = a - count
            let all = Object.keys(result.remaining_order)
            let sum = 0
            all.forEach((ele) => {
                console.log(ele)
                if (ele != "totalWeight" && ele != "price") {
                    let b = Object.values(result.remaining_order[ele])
                    b.splice(7, 2)
                    sum = sum + b.reduce((a, b) => { return a + b }, 0)
                }
            })
            console.log('packed sum',sum)
            if (sum == 0) {
                result.is_packed = 1
                result.is_half_packed = 0
            } else {
                result.is_half_packed = 1
            }

            // Use Promise.all to handle multiple async operations
            await Promise.all([
                SweetOrderDetails.updateOne({ _id: new ObjectId(order_id) }, { $set: result }),
                ExtraSweets.updateOne({ sweet_name: sweet_name }, { $inc: { amount: count * -1 } })
            ]);

            return res.status(200).json({
                error: false,
                code: 200,
                message: "Count updated successfully"
            });

        }


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/update_stock', async (req, res) => {
    const frontEndData = req.body.order_data || {};
    console.log("API entry point =======", frontEndData);
    try {
        await updateSweets(frontEndData);
        console.log('Update operation completed.');
        res.status(200).json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.error('Update operation failed:', error);
        res.status(500).json({ message: 'Stock update failed', error: error.message });
    }
});

// Function to update the amount based on FE data
async function updateSweets(data) {
    const { sweets } = data;

    // Loop through each sweet type in the data
    for (const sweetName in sweets) {
        const sweetData = sweets[sweetName];

        // Parse and calculate the weights in kilograms
        const oneKg = parseInt(sweetData.oneKg, 10);  // Number of 1kg boxes
        const halfKg = parseInt(sweetData.halfKg, 10) * 0.5;  // Number of 0.5kg boxes converted to kg
        const quarterKg = parseInt(sweetData.quarterKg, 10) * 0.25;  // Number of 0.25kg boxes converted to kg

        // Parse additional weights and packings in grams and convert to kilograms
        const otherWeight = parseInt(sweetData.otherWeight, 10) / 1000; // Convert grams to kg
        const otherPackings = parseInt(sweetData.otherPackings, 10);
        const otherWeight2 = parseInt(sweetData.otherWeight2, 10) / 1000; // Convert grams to kg
        const otherPackings2 = parseInt(sweetData.otherPackings2, 10);

        // Calculate the total weight from additional weights and packings
        const other_amount1 = otherWeight * otherPackings;
        const other_amount2 = otherWeight2 * otherPackings2;

        // Calculate the total amount based on all weight factors in kilograms
        const total_amount = oneKg + halfKg + quarterKg + other_amount1 + other_amount2;
        console.log("==========TOTAL AMOUNT (in kg)=====", total_amount);

        try {
            // Retrieve the current amount from the database
            const existingSweet = await ExtraSweets.findOne({ sweet_name: sweetName });

            if (existingSweet) {
                const currentAmount = existingSweet.amount;

                // Check if the current amount is greater than the calculated total_amount
                if (currentAmount > total_amount) {
                    const newAmount = currentAmount - total_amount;

                    // Update the document with the new amount and modified date
                    await ExtraSweets.findOneAndUpdate(
                        { sweet_name: sweetName },
                        {
                            amount: newAmount,
                            modified: new Date(),
                        },
                        { new: true }
                    );

                    console.log(`Updated ${sweetName} with new amount: ${newAmount}`);
                } else {
                    console.log(
                        `Insufficient amount for ${sweetName}. Current amount (${currentAmount}) is less than the required total_amount (${total_amount}).`
                    );
                }
            } else {
                console.log(`Sweet ${sweetName} not found in the database.`);
            }
        } catch (error) {
            console.error(`Error updating ${sweetName}:`, error);
            throw error; // Rethrow to propagate the error to the calling function
        }
    }
}
