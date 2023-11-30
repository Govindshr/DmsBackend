const express = require("express");
const mongoose = require("mongoose");
const fs = require('fs')
const multer = require("multer");
const cors = require("cors");
var bcrypt = require('bcryptjs');
const { ObjectId } = require("mongoose").Types;


const app = express();
app.use(express.json());
app.use(cors());

require("./db_api/config")
const { Registration, FeeDetails, ClassDetails,  fieldName,formStepDetails,approvalNeed } = require("./db_api/schema")


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
        let user = await Registration.find({},{_id:0,name:1,email:1,mobile_number:1,address:1})
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

/********************* Glueple MRF Form Details API ************************************ */

app.post("/fieldNameDetails", async (req, res) => {
    console.log("http://localhost:2000/fieldNameDetails")

    try {

        let vacancy_type = req.body.vacancy_type ? req.body.vacancy_type : "new vacancy"
        let fieldDetails = req.body.fieldDetails ? req.body.fieldDetails : []
        // let field_name = req.body.field_name ? req.body.field_name : ""
        // let field_type = req.body.field_type ? req.body.field_type : ""
        // let place_holder = req.body.place_holder ? req.body.place_holder : ""
        
        let saveData = {
        
            vacancy_type: vacancy_type,
            fieldDetails:fieldDetails,
            // field_name: field_name,
            // field_type: field_type,
            // place_holder: place_holder,
        
        }
        let result = await fieldName.create(saveData)

        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Saved Successfully",
                data: result
            })
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Something went wrong",
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

app.post("/formStepDetails", async (req, res) => {
    console.log("http://localhost:2000/formStepDetails")

    try {

        let vacancy_type = req.body.vacancy_type ? req.body.vacancy_type : "new vacancy"
        let step_detail = req.body.step_detail ? req.body.step_detail : []
        // let step_name = req.body.step_name ? req.body.step_name : ""
        // let field_name = req.body.field_name ? req.body.field_name : ""
        // let field_type = req.body.field_type ? req.body.field_type : ""
        // let place_holder = req.body.place_holder ? req.body.place_holder : ""
        
        let saveData = {
        
            vacancy_type: vacancy_type,
            step_detail: step_detail,
            // step_name: step_name,
            // field_name: field_name,
            // field_type: field_type,
            // pasplace_holdersword: place_holder,
        
        }
        let result = await formStepDetails.create(saveData)

        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Saved Successfully",
                data: result
            })
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Something went wrong",
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

app.post("/mrfApprovalNeed", async (req, res) => {
    console.log("http://localhost:2000/mrfApprovalNeed")

    try {

        let vacancy_type = req.body.vacancy_type ? req.body.vacancy_type : "new vacancy"
        let department_name = req.body.department_name ? req.body.department_name : ""
        let list_authorities = req.body.list_authorities ? req.body.list_authorities : ""
        
        let saveData = {
        
            vacancy_type: vacancy_type,
            department_name: department_name,
            list_authorities: list_authorities,
        
        }
        let result = await approvalNeed.create(saveData)

        if (result) {
            res.status(200).json({
                error: false,
                code: 200,
                message: "Saved Successfully",
                data: result
            })
        } else {
            res.status(404).json({
                error: true,
                code: 404,
                message: "Something went wrong",
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


app.get("/getFormFieldDetails", upload, async (req, res) => {
    console.log("http://localhost:2000/getFormFieldDetails")

    try {

        let user = await fieldName.aggregate([

            { "$match": { vacancy_type : "new vacancy" } },
            {
                "$lookup": {
                    from: "form_steps",
                    localField: "vacancy_type",
                    foreignField: "vacancy_type",
                    as: "steps_data"
                }
            },
            {
                "$lookup": {
                    from: "approvals",
                    localField: "vacancy_type",
                    foreignField: "vacancy_type",
                    as: "approvals_data"
                }
            },
            { "$unwind": "$steps_data" },
            { "$unwind": "$approvals_data" },
            {
                "$project": {
                    "_id": 1,
                    "vacancy_type": 1,
                    "fieldDetails": 1,
                    "steps_data.vacancy_type":1,
                    "steps_data.step_detail":1,
                    "approvals_data.vacancy_type":1,
                    "approvals_data.department_name":1,
                    "approvals_data.list_authorities":1,
                
                }
            },


        ])
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





app.listen((2000), () => {
    console.log("app is running on port 2000")
})