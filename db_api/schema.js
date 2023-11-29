const mongoose = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;
const registrationSchema = new mongoose.Schema({
    // profile_image:  String,
    name : String,
    mobile_number: String,
    email: String,
    password: String,
    address: String,
    user_role: String,
    course_details: String,
    is_deleted:{type:Number,default:0},
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
Registration = mongoose.model("registrations", registrationSchema);

const feeDetailsSchema = new mongoose.Schema({
    user_id: mongoose.Types.ObjectId,
    total_fee : Number,
    deposit_fee : Number,
    installment_details: [
        {amount : Number,
         date : String
        }
    ],
    is_deleted:{type:Number,default:0},
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
FeeDetails = mongoose.model("fee_details", feeDetailsSchema);

const classDetailsSchema = new mongoose.Schema({
   
    topic : String,
    video : [],
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
ClassDetails = mongoose.model("class_details", classDetailsSchema);






module.exports = {
    Registration,
    FeeDetails,
    ClassDetails,

}
