import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Prevent deleting admin users
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Optional date filter (?date=YYYY-MM-DD)
    const dateStr = req.query.date;
    let start = null;
    let end = null;
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      }
    }

    const dateFilter = start && end ? { createdAt: { $gte: start, $lte: end } } : {};

    const [
      userCount,
      productCount,
      orderCount,
      orders,
      productsOnDate,
      usersOnDate,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find(dateFilter),
      Product.find(dateFilter).sort({ createdAt: -1 }),
      User.find(dateFilter).select('-password').sort({ createdAt: -1 }),
    ]);

    const totalSales = orders.reduce((total, order) => total + (order.totalPrice || order.finalAmount || 0), 0);
    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

    res.json({
      userCount,
      productCount,
      orderCount,
      totalSales,
      recentOrders,
      filter: dateStr || null,
      products: productsOnDate,
      users: usersOnDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Orders report filtered by day/month/year or custom range
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getOrdersReport = async (req, res) => {
  try {
    const { date, month, year, from, to } = req.query;

    let start = null;
    let end = null;

    const now = new Date();
    if (date && year && month) {
      // specific date
      start = new Date(Number(year), Number(month) - 1, Number(date), 0, 0, 0, 0);
      end = new Date(Number(year), Number(month) - 1, Number(date), 23, 59, 59, 999);
    } else if (month && year) {
      // entire month
      start = new Date(Number(year), Number(month) - 1, 1, 0, 0, 0, 0);
      end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
    } else if (year) {
      // entire year
      start = new Date(Number(year), 0, 1, 0, 0, 0, 0);
      end = new Date(Number(year), 11, 31, 23, 59, 59, 999);
    } else if (from && to) {
      start = new Date(from);
      end = new Date(to);
    } else {
      // default: last 30 days
      end = now;
      start = new Date(now);
      start.setDate(now.getDate() - 30);
    }

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    const report = orders.map((o) => ({
      id: o._id,
      userName: o?.deliveryDetails?.name || o?.user?.name || 'User',
      orderTime: o.createdAt,
      paymentMode: o.paymentMethod,
      subtotalAmount: o.subtotalAmount,
      discountAmount: o.discountAmount,
      totalAmount: o.finalAmount,
      deliveryDetails: o.deliveryDetails || {}, // Include delivery details for admin view
      items: o.items?.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        amount: i.price,
        total: (i.price || 0) * (i.quantity || 0),
      })) || [],
    }));

    const totals = report.reduce((acc, r) => {
      acc.orders += 1;
      acc.totalAmount += r.totalAmount || 0;
      acc.subtotalAmount += r.subtotalAmount || 0;
      acc.discountAmount += r.discountAmount || 0;
      return acc;
    }, { orders: 0, subtotalAmount: 0, discountAmount: 0, totalAmount: 0 });

    res.json({
      range: { start, end },
      totals,
      orders: report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all user wishlists
// @route   GET /api/admin/wishlists
// @access  Private/Admin
export const getAllWishlists = async (req, res) => {
  try {
    const users = await User.find({ wishlist: { $exists: true, $ne: [] } })
      .select('name email wishlist')
      .populate('wishlist', 'name price image id slug category subcategory');
    
    const wishlists = users.map(user => ({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      wishlistItems: user.wishlist || [],
      itemCount: user.wishlist?.length || 0
    }));

    res.json({
      success: true,
      count: wishlists.length,
      wishlists
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all user carts
// @route   GET /api/admin/carts
// @access  Private/Admin
export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name price image id slug category subcategory');
    
    const cartData = carts.map(cart => ({
      userId: cart.user._id,
      userName: cart.user.name,
      userEmail: cart.user.email,
      cartItems: cart.items || [],
      itemCount: cart.items?.length || 0,
      totalValue: cart.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0,
      lastUpdated: cart.updatedAt
    }));

    res.json({
      success: true,
      count: cartData.length,
      carts: cartData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};