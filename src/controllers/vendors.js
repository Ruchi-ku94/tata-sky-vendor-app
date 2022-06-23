const { getAllVendorsDocument, register, login, updateVendorDocument, deleteVendorDocument, getVendorAvailableInServiceArea, tagVendorToOrderId } = require("../models/vendors")
const { getOrderById } = require("../models/customerOrders")
const sendEmail = require("../utils/sendEmail")
const getAllVendors = async (req, res) => {
    const vendors = await getAllVendorsDocument()

    if (vendors.error) {
        return res.status(500).json(vendors)
    }

    res.status(200).json(vendors)
}

const registerVendor = async (req, res) => {
    const savedVendorToDb = await register(req)

    if (savedVendorToDb.error) {
        return res.status(500).json(savedVendorToDb)
    }

    res.status(201).json(savedVendorToDb)
}

const loginVendor = async (req, res) => {
    const vendor = await login(req)

    if (vendor.error) {
        return res.status(500).json(vendor)
    }

    if (vendor.message) {
        return res.status(400).json(vendor)
    }

    res.status(200).json(vendor)
}

const updateVendor = async (req, res) => {
    const vendor = await updateVendorDocument(req)

    if (vendor.error) {
        return res.status(500).json(vendor)
    }

    if (vendor.message) {
        return res.status(404).json(vendor)
    }
    res.status(200).json(vendor)
}

const deleteVendor = async (req, res) => {
    const { id } = req.params
  
    const vendor = await deleteVendorDocument(id)
  
    if(vendor.error) {
      return res.status(500).json(vendor)
    }
    
    if(vendor.message) {
      return res.status(404).json(vendor)
    }
  
    res.status(200).json(vendor)
}



const assignVendorAndNotify = async (req, res) => {
    const { orderId } = req.body;
    // getOrder information from orders collection . this could be present in a separate microservice.
    // But for demonstartion purpose orders is present in this service.

    const order = await getOrderById(orderId);
    if(order.message){
       return res.status(404).json(order)
    }
    if(order.error){
       return res.status(500).json(order)
    }
    const { 
        requestType,
        description, 
        address
      } = order
    //  console.log("=========order details==============")
    //  console.log(order)
      const {latitude, longitude, postalCode, landmark, city, country } = order.address
      const vendorAvailable = await getVendorAvailableInServiceArea(postalCode); // returns the available vendor record 
      console.log("==========vendor available=============");
      console.log(vendorAvailable)
      if(vendorAvailable.error) {
          return res.status(500).json(vendorAvailable)
      }
        
      if(vendorAvailable.message) {
          return res.status(404).json(vendorAvailable)
      }
    
    const vendorId = vendorAvailable._id;
    await tagVendorToOrderId(orderId, vendorId);
    const email = vendorAvailable.email
    const vendorName = vendorAvailable.name
    const subject = `New Service Request assigned_${orderId}`
    const text = `Hi ${vendorName},
                     Please find Service details:
                          type Of Request - ${requestType},
                          description     - ${description},
                          address         - ${address.address},
                          landmark        - ${landmark},
                          city            - ${city},
                          postalCode      - ${postalCode},
                          country         - ${country},
                          lat,long        - ${latitude},${longitude}    
        `

    const emailResponse = await sendEmail(email,subject,text);
  //  console.log("=======email resp========")
  //  console.log(emailResponse)
    if(emailResponse.message){
        res.status(404).json(emailResponse)
    }
    if(emailResponse.error){
        return res.status(500).json(emailResponse)
    }
    let response = {
        Message: "Vendor assigned Successfully",
        vendorId,
        emailResponse
    }
    res.status(200).json(response)
  
}

   
module.exports = {
    getAllVendors,
    registerVendor,
    loginVendor,
    updateVendor,
    deleteVendor,
    assignVendorAndNotify
}