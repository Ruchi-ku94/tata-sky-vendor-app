const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    latitude: {
            type: String,
            required: true
        },
    longitude: {
            type: String,
            required: true
    }
    
});
const orderSchema = new mongoose.Schema({
    requestType: {
        // request regarding issue by customer
        type: String,
        required: false,
    },
    description: {
        type: String
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,   // we would have a customer schema as well where customer details will be maintained. 
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    address: {
        type: addressSchema,
        required: true
    },
    status:{
        isAssigned: {
            type: Boolean,
            required: true,
            default: false
        },
        isCanceled: {
            type: Boolean,
            required: true,
            default: false
        },
        isResolved: {
            type: Boolean,
            required: true,
            default: false,
        }
    }
})

const Order =  mongoose.model("order", orderSchema);

const getAllOrdersDocument = async () => {
    try {
        return Order.find()
    } catch (err) {
        return { error: err.message }
    }
}

const getOrderById = async (id) =>{
    try{
        const order = Order.findById(id)
        if (!order) {
            return { message: "Order is not found" }
        }
        return order
    } catch (err) {
        return { error: err.message }
    }
}

module.exports = {
    getAllOrdersDocument,
    getOrderById
}

