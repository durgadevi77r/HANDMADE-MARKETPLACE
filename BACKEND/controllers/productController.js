import Product from '../models/productModel.js';

// Helper to ensure absolute image URL
function toAbsoluteImageUrl(req, imagePath) {
  if (!imagePath) return '';
  // If already absolute (http/https), return as-is
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  // Normalize leading slash
  const normalized = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}${normalized}`;
}

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    // Build filter object
    const filter = {};
    
    // Search functionality
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    
    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Subcategory filter
    if (req.query.subcategory) {
      filter.subcategory = req.query.subcategory;
    }
    
    // Price range filter
    if (req.query.minPrice && req.query.maxPrice) {
      filter.price = { 
        $gte: Number(req.query.minPrice), 
        $lte: Number(req.query.maxPrice) 
      };
    } else if (req.query.minPrice) {
      filter.price = { $gte: Number(req.query.minPrice) };
    } else if (req.query.maxPrice) {
      filter.price = { $lte: Number(req.query.maxPrice) };
    }
    
    // Color filter
    if (req.query.color) {
      filter.color = req.query.color;
    }
    
    // Material filter
    if (req.query.material) {
      filter.material = req.query.material;
    }
    
    // Size filter
    if (req.query.size) {
      filter.size = req.query.size;
    }
    
    // Rating filter
    if (req.query.rating) {
      filter.rating = { $gte: Number(req.query.rating) };
    }
    
    // Offer filter
    if (req.query.minOffer) {
      filter.offer = { $gte: Number(req.query.minOffer) };
    }

    // Stock availability filter
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Date filter (products created on a specific day)
    if (req.query.date) {
      const d = new Date(req.query.date);
      if (!isNaN(d.getTime())) {
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
        filter.createdAt = { $gte: start, $lte: end };
      }
    }

    // Sort options
    let sortOption = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sortOption = { price: 1 };
          break;
        case 'price-desc':
          sortOption = { price: -1 };
          break;
        case 'name-asc':
          sortOption = { name: 1 };
          break;
        case 'name-desc':
          sortOption = { name: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        case 'offer':
          sortOption = { offer: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }

    // Count total documents with filter
    const count = await Product.countDocuments(filter);

    // Get products with pagination and sorting
    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Map image paths to absolute URLs for list view
    const mapped = products.map((p) => ({
      ...p.toObject(),
      image: toAbsoluteImageUrl(req, p.image?.toString?.() || p.image),
    }));

    res.json({
      products: mapped,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get product by ID (MongoDB _id or custom id)
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    // Try to find by custom id first, then by MongoDB _id
    if (id.startsWith('prod_')) {
      product = await Product.findOne({ id: id });
    } else {
      // Try MongoDB _id if it's a valid ObjectId format
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      } else {
        // Try custom id as fallback
        product = await Product.findOne({ id: id });
      }
    }

    if (product) {
      const obj = product.toObject();
      obj.image = toAbsoluteImageUrl(req, obj.image);
      res.json(obj);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get products by category and subcategory
// @route   GET /api/products/category/:category/subcategory/:subcategory
// @access  Public
export const getProductsByCategoryAndSubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    
    const products = await Product.find({ 
      category, 
      subcategory 
    });

    const mapped = products.map((p) => ({
      ...p.toObject(),
      image: toAbsoluteImageUrl(req, p.image?.toString?.() || p.image),
    }));

    res.json(mapped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.keys(req.body).forEach(key => {
        product[key] = req.body[key];
      });

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { subcategory: { $regex: query, $options: 'i' } },
        { material: { $regex: query, $options: 'i' } },
      ],
    }).limit(20);
    
    const mapped = products.map((p) => ({
      ...p.toObject(),
      image: toAbsoluteImageUrl(req, p.image?.toString?.() || p.image),
    }));

    res.json(mapped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get product filters
// @route   GET /api/products/filters
// @access  Public
export const getProductFilters = async (req, res) => {
  try {
    // Get unique categories
    const categories = await Product.distinct('category');
    
    // Get unique subcategories
    const subcategories = await Product.distinct('subcategory');
    
    // Get unique colors
    const colors = await Product.distinct('color');
    
    // Get unique materials
    const materials = await Product.distinct('material');
    
    // Get unique sizes
    const sizes = await Product.distinct('size');
    
    // Get price range
    const minPrice = await Product.find().sort({ price: 1 }).limit(1).select('price');
    const maxPrice = await Product.find().sort({ price: -1 }).limit(1).select('price');
    
    res.json({
      categories,
      subcategories,
      colors,
      materials,
      sizes,
      priceRange: {
        min: minPrice.length > 0 ? minPrice[0].price : 0,
        max: maxPrice.length > 0 ? maxPrice[0].price : 1000,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};