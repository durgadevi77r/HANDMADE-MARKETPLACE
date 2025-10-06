import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Review must be at least 3 characters'],
      maxlength: [2000, 'Review cannot exceed 2000 characters'],
    },
  },
  { timestamps: true }
);

// Allow multiple reviews per user per product - remove unique constraints
// reviewSchema.index({ product: 1, user: 1 }, { unique: true, partialFilterExpression: { product: { $exists: true, $type: 'objectId' } } });
// reviewSchema.index({ productName: 1, user: 1 }, { unique: true, partialFilterExpression: { product: { $exists: false } } });

const Review = mongoose.model('Review', reviewSchema);

export default Review;


