import User from '../models/userModel.js';
import Product from '../models/productModel.js';

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price image slug id category subcategory');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.wishlist || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    // Resolve product by ObjectId, custom id, slug, or name
    let product = null;
    if (typeof productId === 'string' && /^[a-fA-F0-9]{24}$/.test(productId)) {
      product = await Product.findById(productId);
    }
    if (!product && typeof productId === 'string' && productId.startsWith('prod_')) {
      product = await Product.findOne({ id: productId });
    }
    if (!product) {
      product = await Product.findOne({ $or: [{ slug: productId }, { name: productId }] });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resolvedId = (product?._id || productId).toString();
    const exists = user.wishlist.map((w) => w.toString()).includes(resolvedId);

    if (exists) {
      user.wishlist = user.wishlist.filter((w) => w.toString() !== resolvedId);
    } else {
      user.wishlist.push(product?._id || resolvedId);
    }

    await user.save();

    const populated = await User.findById(user._id).populate('wishlist', 'name price image slug id category subcategory');
    res.json({ success: true, wishlisted: !exists, wishlist: populated.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const before = user.wishlist.length;
    user.wishlist = user.wishlist.filter((w) => w.toString() !== productId);
    if (user.wishlist.length === before) {
      return res.status(400).json({ message: 'Product not in wishlist' });
    }
    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



