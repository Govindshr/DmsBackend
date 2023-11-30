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

const fieldNameSchema = new mongoose.Schema({

    vacancy_type: String,
    fieldDetails: [
        {
            field_name: String,
            field_type: String,
            place_holder: String
        }
    ],
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
fieldName = mongoose.model("field_names", fieldNameSchema);

const formStepsSchema = new mongoose.Schema({

    vacancy_type: String,

    step_detail: [{
        step_name: String,
        step_field_details_: [
            {
                field_name: String,
                field_type: String,
                place_holder: String
            }
        ],
    }],

    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
formStepDetails = mongoose.model("form_steps", formStepsSchema);


const approvalNeedSchema = new mongoose.Schema({

    vacancy_type: String,
    department_name: String,
    list_authorities: String,
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }

});
approvalNeed = mongoose.model("approvals", approvalNeedSchema);



module.exports = {
    Registration,
    FeeDetails,
    ClassDetails,

    fieldName,
    formStepDetails,
    approvalNeed,

}
