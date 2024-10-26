const mongoose = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;
const registrationSchema = new mongoose.Schema({
    // profile_image:  String,
    name: String,
    mobile_number: String,
    email: String,
    password: String,
    address: String,
    user_role: String,
    course_details: String,
    is_deleted: { type: Number, default: 0 },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
Registration = mongoose.model("registrations", registrationSchema);

const feeDetailsSchema = new mongoose.Schema({
    user_id: mongoose.Types.ObjectId,
    total_fee: Number,
    deposit_fee: Number,
    installment_details: [
        {
            amount: Number,
            date: String
        }
    ],
    is_deleted: { type: Number, default: 0 },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
FeeDetails = mongoose.model("fee_details", feeDetailsSchema);

const classDetailsSchema = new mongoose.Schema({

    topic: String,
    video: [],
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
ClassDetails = mongoose.model("class_details", classDetailsSchema);

/**************govind*************/ 

const OerderSchema = new mongoose.Schema({

    name: String,
    price: String,
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
OrderDetails = mongoose.model("order_details", OerderSchema);

const SweetOrderSchema = new mongoose.Schema({
    order_no:Number,
    name: String,
    number: String,
    payment_mode: String,
    retail_order: Boolean,
    summary: {},
    sweets: {},
    remaining_order: {},
    received_amount : { type: Number, default: null },
    is_packed : { type: Number, default: 0 },
    is_delivered : { type: Number, default: 0 },
    is_half_packed : { type: Number, default: 0 },
    is_paid : { type: Number, default: 0 },
    is_deleted: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
SweetOrderDetails = mongoose.model("sweets_details", SweetOrderSchema);

const expenceSchema = new mongoose.Schema({
    type: String,
    reciver_name: String,
    amount: String,
    remarks:String,
    bill_image:  String,
    status: { type: Number, default: 0 },
    is_deleted: { type: Number, default: 0 },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
Expence = mongoose.model("order_expence", expenceSchema);
const extra_sweets = new mongoose.Schema({
    
    sweet_name: String,
    amount: Number,
    price:Number,
  
    status: { type: Number, default: 0 },
    is_deleted: { type: Number, default: 0 },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
ExtraSweets = mongoose.model("extra_sweets", extra_sweets);

module.exports = {
    Registration,
    FeeDetails,
    ClassDetails,
 /**************govind*************/ 
    OrderDetails,
    SweetOrderDetails,
    Expence,
    ExtraSweets
}
