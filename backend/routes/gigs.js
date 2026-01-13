const express = require('express');
const { getGigs, getGig, createGig, getMyGigs } = require('../controllers/gigController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', getGigs);                  // Public
router.get('/my-gigs', auth, getMyGigs);   // ✅ Move this UP
router.get('/:id', getGig);                // Dynamic route LAST
router.post('/', auth, createGig);


// GET HIRED PROJECTS - For freelancer (assigned gigs)
router.get('/hired-projects', auth, async (req, res) => {
  try {
    const freelancerId = req.user.id
    
    // Find gigs where this freelancer was hired (bids accepted)
    const hiredProjects = await Gig.find({
      bids: {
        $elemMatch: {
          freelancerId: freelancerId,
          status: 'hired'  // Bid accepted
        }
      }
    })
    .populate('ownerId', 'name email')
    .populate({
      path: 'bids',
      match: { freelancerId: freelancerId, status: 'hired' },
      populate: { path: 'freelancerId', select: 'name email' }
    })
    .lean()

    res.json({ 
      success: true, 
      data: hiredProjects 
    })
  } catch (error) {
    console.error('Hired projects error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router;
