import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// @desc    Get user wishlist
// @route   GET /api/profile/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/profile/wishlist
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Resolve product by ObjectId, custom id, slug, or name
    let product = null;
    if (typeof productId === 'string' && /^[a-fA-F0-9]{24}$/.test(productId)) {
      product = await Product.findById(productId);
    }
    if (!product && typeof productId === 'string' && productId.startsWith('prod_')) {
      product = await Product.findOne({ id: productId });
    }
    if (!product) {
      product = await Product.findOne({ 
        $or: [
          { slug: productId },
          { name: productId }
        ]
      });
    }

    const user = await User.findById(req.user._id);

    // Check if product is already in wishlist
    const finalProductId = (product?._id || productId).toString();
    if (user.wishlist.map((w) => w.toString()).includes(finalProductId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add to wishlist (store ObjectId when available)
    user.wishlist.push(product?._id || productId);
    await user.save();

    res.status(201).json({ message: 'Product added to wishlist', productId: finalProductId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/profile/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    // Check if product is in wishlist
    if (!user.wishlist.map((w) => w.toString()).includes(productId)) {
      return res.status(400).json({ message: 'Product not in wishlist' });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );
    await user.save();

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user address
// @route   PUT /api/profile/address
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    const { street, city, state, postalCode, country } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.address = {
      street: street || user.address?.street,
      city: city || user.address?.city,
      state: state || user.address?.state,
      postalCode: postalCode || user.address?.postalCode,
      country: country || user.address?.country,
    };

    await user.save();

    res.json({ message: 'Address updated successfully', address: user.address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user address
// @route   GET /api/profile/address
// @access  Private
export const getAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('address');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};