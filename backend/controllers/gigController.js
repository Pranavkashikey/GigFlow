const Gig = require('../models/Gig');
const User = require('../models/User');

// @desc    Get all open gigs (with search)
// @route   GET /api/gigs
exports.getGigs = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { status: 'open' };

    // Search by title
    if (search) {
  query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ]
}

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
exports.getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
    
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.json({
      success: true,
      data: gig
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
exports.createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const ownerId = req.user.id; // From auth middleware

    if (!title || !description || !budget) {
      return res.status(400).json({ message: 'Please provide title, description and budget' });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId,
      status: 'open'
    });

    const populatedGig = await Gig.findById(gig._id).populate('ownerId', 'name email');

    res.status(201).json({
      success: true,
      data: populatedGig
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my gigs
// @route   GET /api/gigs/my-gigs

exports.getMyGigs = async (req, res) => {
  try {
    console.log('🔍 getMyGigs called');
    console.log('📋 req.user:', req.user);
    
    // Check if user exists
    if (!req.user || !req.user.id) {
      console.log('❌ No user found');
      return res.status(401).json({ 
        success: false, 
        message: 'Please login first' 
      });
    }

    console.log('✅ Finding gigs for user:', req.user.id);
    
    const gigs = await Gig.find({ ownerId: req.user.id })
      .populate('ownerId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📊 Found ${gigs.length} gigs`);
    
    res.json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    console.error('💥 getMyGigs ERROR:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};