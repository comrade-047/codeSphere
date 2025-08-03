import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  problems: [
    {
      problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
      },
      points: {
        type: Number,
        default: 100, // Assign a default point value
      },
    },
  ],
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model('Contest', contestSchema);

