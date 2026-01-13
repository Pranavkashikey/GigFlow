const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');



exports.getMyBids = async (req, res) => {
  try {
    console.log('🔍 getMyBids called by user:', req.user.id)
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      })
    }

    console.log('🔍 Fetching bids for freelancer:', req.user.id)
    

const bids = await Bid.find({ freelancerId: req.user.id })
      .populate({
        path: 'gigId',
        select: 'title budget description status ownerId',
        populate: {
          path: 'ownerId',
          model: 'User',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 })

    console.log(`Found ${bids.length} bids`)

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    })
  } catch (error) {
    console.error(' getMyBids ERROR:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
exports.createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;
    const freelancerId = req.user.id;

    // Validation
    if (!gigId || !message || !price) {
      return res.status(400).json({ message: 'Gig ID, message and price required' });
    }

    
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'Cannot bid on closed gig' });
    }

    // Check if already bid
    const existingBid = await Bid.findOne({ gigId, freelancerId });
    if (existingBid) {
      return res.status(400).json({ message: 'Already bid on this gig' });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId,
      message,
      price
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('gigId', 'title status')
      .populate('freelancerId', 'name');

    res.status(201).json({
      success: true,
      data: populatedBid
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bids for a gig (owner only)
// @route   GET /api/bids/:gigId
exports.getGigBids = async (req, res) => {
  try {
    const { gigId } = req.params;
    const ownerId = req.user.id;

    // Check if user owns the gig
    const gig = await Gig.findOne({ _id: gigId, ownerId });
    if (!gig) {
      return res.status(403).json({ message: 'Not authorized to view bids' });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Hire freelancer (CRITICAL LOGIC)
// @route   PATCH /api/bids/:bidId/hire
// @desc    Hire freelancer (SIMPLE VERSION - NO TRANSACTIONS)
exports.hireBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const clientId = req.user.id;

    console.log('Hiring bid:', bidId, 'by client:', clientId);

    // 1. Find bid
    const bid = await Bid.findById(bidId).populate('gigId');
    if (!bid || bid.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid or already processed bid' });
    }

    const gig = bid.gigId;
    if (!gig || gig.ownerId.toString() !== clientId) {
      return res.status(403).json({ message: 'Not authorized to hire for this gig' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'Gig is already assigned' });
    }

    // 🔥 ATOMIC UPDATES (Simple approach)
    const [updatedGig, hiredBid, rejectedBids] = await Promise.all([
      // 1. Update gig status to assigned
      Gig.findByIdAndUpdate(
        gig._id,
        { status: 'assigned' },
        { new: true }
      ),
      
      // 2. Mark selected bid as hired
      Bid.findByIdAndUpdate(
        bidId,
        { status: 'hired' },
        { new: true }
      ),

      // 3. Reject all other bids for this gig
      Bid.updateMany(
        { gigId: gig._id, _id: { $ne: bidId }, status: 'pending' },
        { status: 'rejected' }
      )
    ]);

    console.log('✅ Hiring successful!');
    console.log('Gig:', updatedGig.status);
    console.log('Hired bid:', hiredBid.status);
    console.log('Rejected bids:', rejectedBids.modifiedCount);

    res.json({
      success: true,
      message: 'Freelancer hired successfully! Gig assigned.',
      data: {
        gigId: gig._id,
        hiredBid: hiredBid._id,
        gigStatus: updatedGig.status,
        rejectedBids: rejectedBids.modifiedCount
      }
    });

  } catch (error) {
    console.error('Hiring error:', error);
    res.status(500).json({ message: error.message });
  }
};
