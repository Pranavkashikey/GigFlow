const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  gigId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gig', 
    required: [true, 'Gig is required'] 
  },
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Freelancer is required'] 
  },
  message: { 
    type: String, 
    required: [true, 'Bid message is required'], 
    maxlength: [500, 'Message too long'] 
  },
  price: { 
    type: Number, 
    required: [true, 'Bid price is required'], 
    min: [0, 'Price cannot be negative']
  },
  status: { 
    type: String, 
    enum: ['pending', 'hired', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Bid', bidSchema);
