const router = require('express').Router()
const {
  getAllVendors,
  registerVendor,
  loginVendor,
  updateVendor,
  deleteVendor,
  assignVendorAndNotify
} = require('../controllers/vendors')

const { authenticateToken } = require('../middlewares/tokenAuthentication')

router.get('/', getAllVendors)
router.post('/register', registerVendor)
router.post('/login', loginVendor)
router.patch('/:id',authenticateToken, updateVendor)
router.delete('/:id',authenticateToken, deleteVendor)
//route to assign a vendor to serve the customer
router.post('/assign', assignVendorAndNotify )

module.exports = router