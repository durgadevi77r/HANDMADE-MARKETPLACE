import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Product ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    offer: {
      type: Number,
      default: 0,
      min: [0, 'Offer cannot be negative'],
      max: [100, 'Offer cannot exceed 100%'],
    },
    image: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'Mixed',
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },
    orderCount: {
      type: Number,
      default: 0,
      min: [0, 'Order count cannot be negative'],
    },
    size: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    material: {
      type: String,
      default: 'Mixed materials',
    },
    care: {
      type: String,
      default: 'Handle with care',
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    about: {
      type: String,
      default: '',
    },
    famousPlace: {
      type: String,
      default: '',
    },
    benefits: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
    },
    subcategory: {
      type: String,
      required: [true, 'Product subcategory is required'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;