import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image slug offer stock');
    
    if (!cart) {
      return res.json({
        items: [],
        totalAmount: 0,
        totalItems: 0,
      });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      
      // Check stock again
      if (cart.items[existingItemIndex].quantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.offer > 0 
          ? Math.round(product.price * (1 - product.offer / 100))
          : product.price,
      });
    }

    await cart.save();
    
    // Populate and return updated cart
    await cart.populate('items.product', 'name price image slug offer stock');
    
    res.json({
      message: 'Item added to cart',
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || quantity < 0) {
      return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Check stock
      const product = await Product.findById(productId);
      if (product && quantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name price image slug offer stock');
    
    res.json({
      message: 'Cart updated',
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product', 'name price image slug offer stock');
    
    res.json({
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    
    res.json({
      message: 'Cart cleared',
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Move item from wishlist to cart
// @route   POST /api/cart/from-wishlist
// @access  Private
export const moveFromWishlistToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock
    if (product.stock < 1) {
      return res.status(400).json({ message: 'Product out of stock' });
    }

    // Add to cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += 1;
      
      // Check stock again
      if (cart.items[existingItemIndex].quantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity: 1,
        price: product.offer > 0 
          ? Math.round(product.price * (1 - product.offer / 100))
          : product.price,
      });
    }

    await cart.save();

    // Remove from wishlist
    const User = (await import('../models/userModel.js')).default;
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } }
    );

    // Populate and return updated cart
    await cart.populate('items.product', 'name price image slug offer stock');
    
    res.json({
      message: 'Item moved from wishlist to cart',
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};