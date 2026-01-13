const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createBid,
  getGigBids,
  hireBid,
  getMyBids  // 🔥 ADD THIS
} = require('../controllers/bidController'); // Assuming path

// Existing routes
router.get('/my-bids', auth, getMyBids);
router.post('/', auth, createBid);
router.get('/:gigId', auth, getGigBids);
router.patch('/:bidId/hire', auth, hireBid);

// 🔥 NEW ROUTE using controller function


module.exports = router;
