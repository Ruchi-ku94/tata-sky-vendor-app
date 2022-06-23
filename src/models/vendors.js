const mongoose = require("mongoose");
const { generateHashedPassword, comparePassword } = require("../utils/hashPassword");
const { createJWTToken } = require("../utils/auth")
const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    serviceArea: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    vehicle: {
        type: String,
        required: true,
    },
    orders: {
        type: Array
    },
    earnings: {
        type: Array,
    },
    rating: {
        type: Number,
        required: false,
    },
    registeredOn: {
        type: Date,
        default: Date.now,
    },
});

const Vendor = mongoose.model("vendor", vendorSchema);

const getAllVendorsDocument = async () => {
    try {
        return Vendor.find()
    } catch (err) {
        return { error: err.message }
    }
}


const register = async (req) => {
    const {
        name,
        serviceArea,
        city,
        country,
        vehicle,
        email,
        password,
        phone
    } = req.body

    try {
        const passwordHash = await generateHashedPassword(password)

        const vendor = await Vendor.create({
            name,
            serviceArea,
            city,
            country,
            vehicle,
            email,
            phone,
            password: passwordHash
        })

        const payload = { id: vendor._id }
        const accessToken = createJWTToken(payload)

        return { vendor, accessToken }
    } catch (err) {
        return { error: err.message }
    }
}

const login = async (req) => {
    const { email, password } = req.body

    try {
        if (!email || !password) {
            return {
                message: !email && password ? 'Enter registered email' : email && !password ? 'Enter password' : 'Enter email and password'
            }
        }

        const vendor = await Vendor.findOne({ email })

        if (!vendor) {
            return { message: 'Email is not registered' }
        }

        const isMatch = await comparePassword(password, vendor.password)

        if (!isMatch) {
            return { message: 'Incorrect Password' }
        }

        const payload = { id: vendor._id }
        const accessToken = createJWTToken(payload)

        return { vendor, accessToken }
    } catch (err) {
        return { error: err.message }
    }
}

const updateVendorDocument = async (req) => {
    const { id } = req.params
    const update = req.body

    try {
        const vendor = await Vendor.findOneAndUpdate({ _id: id }, update, { new: true })

        if (!vendor) {
            return { message: "vendor doesn't exist" }
        }

        return vendor
    } catch (err) {
        return { error: err.message }
    }
}

const deleteVendorDocument = async (id) => {
    try {
        const vendor = await Vendor.findOneAndDelete({ _id: id })

        if (!vendor) {
            return { message: "vendor doesn't exist" }
        }

        return { deleted: true }
    } catch (err) {
        return { error: err.message }
    }
}

const getVendorAvailableInServiceArea = async(serviceArea) => {
    try {
        const vendor = await Vendor.findOne({ serviceArea, isAvailable: true })
        if (!vendor) {
            return { message: "No vendor is Available!!!" }
        }
        return vendor
    } catch (err) {
        return { error: err.message }
    }
}

const tagVendorToOrderId = async(orderId, vendorId)=>{
    // this function tags vendor to an order
    try{
        const vendor = await Vendor.findOne({_id: vendorId});
        if(!vendor){
            return  { message: "vendor does not exist" }
        }
        vendor.orders.push(orderId)
        await vendor.save()
    }catch(err){
        return { error: err.message}
    }
}
module.exports = {
    getAllVendorsDocument,
    register,
    login,
    updateVendorDocument,
    deleteVendorDocument,
    getVendorAvailableInServiceArea,
    tagVendorToOrderId
}