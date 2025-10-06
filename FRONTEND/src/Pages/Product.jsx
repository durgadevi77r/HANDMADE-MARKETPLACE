import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import categoryData from '../Data/Categorydata';
import { apiFetch } from '../utils/api';
import './Category.css';
import '../styles/ProductImageFix.css';
import Footer from "../Components/Footer";
import ProductImage from '../Components/ProductImage';
import OfferIcon from '../other-components/OfferIcon';
import SaleBadge from '../other-components/SaleBadge';
import StarRating from '../other-components/StarRating';
import CloseIcon from '../other-components/CloseIcon';

const Product = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const [dbProducts, setDbProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Load products from database
  useEffect(() => {
    const loadProductsFromDB = async () => {
      try {
        // Convert URL slug to proper case for API
        const subcategoryForAPI = subcategorySlug === 'south-africa' ? 'South Africa' : subcategorySlug;
        const res = await apiFetch(`/api/products?category=${categorySlug}&subcategory=${subcategoryForAPI}`);
        const data = await res.json();

        if (res.ok && data.products) {
          // Merge in fallback images from static data when backend image is missing/blank
          const fallbackList = categoryData[categorySlug]?.[subcategorySlug] || [];
          const fallbackMap = Object.fromEntries(fallbackList.map(p => [p.slug, p]));
          const merged = data.products.map(p => {
            const img = (p.image && typeof p.image === 'string' && p.image.trim()) ? p.image : (fallbackMap[p.slug]?.image || '');
            return { ...p, image: img };
          });
          setDbProducts(merged);
        } else {
          // Fallback to categoryData if DB products not available
          setDbProducts(categoryData[categorySlug]?.[subcategorySlug] || []);
        }
      } catch (error) {
        console.log('Using fallback categoryData due to:', error.message);
        // Fallback to categoryData
        setDbProducts(categoryData[categorySlug]?.[subcategorySlug] || []);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProductsFromDB();
  }, [categorySlug, subcategorySlug]);

  // Use database products if available, otherwise fallback to categoryData.
  // Ensure image fallback from static data for any product still missing image.
  const staticList = categoryData[categorySlug]?.[subcategorySlug] || [];
  const staticMap = Object.fromEntries(staticList.map(p => [p.slug, p]));
  const products = (dbProducts.length > 0 ? dbProducts : staticList).map(p => ({
    ...p,
    image: (p.image && typeof p.image === 'string' && p.image.trim()) ? p.image : (staticMap[p.slug]?.image || ''),
  }));

  const [selectedPrice, setSelectedPrice] = useState([0, 5000]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);  // to track active accordion section

  const [wishlist, setWishlist] = useState([]);
  // Load wishlist from server for logged-in user so hearts reflect state
  React.useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    apiFetch('/api/wishlist', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Map to slugs for quick lookup
          setWishlist(
            data.map((p) => ({ slug: p.slug, _id: p._id, name: p.name }))
          );
        }
      })
      .catch(() => { });
  }, []);

  const priceOptions = [
    [0, 500],
    [500, 2500],
    [2500, 5000],
    [5000, 10000],
  ];

  const colorOptions = [
    'Silver', 'Gold', 'Black', 'Rose', 'Blue',
    'Red', 'Green', 'Purple', 'Pink', 'White', 'Orange'
  ];

  const offerOptions = [10, 20, 30, 50, 70, 90];

  const priceRef = useRef(null);
  const colorRef = useRef(null);
  const offerRef = useRef(null);
  const sortRef = useRef(null);

  const toggleWishlist = async (item) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      window.location.assign('/login');
      return;
    }
    try {

      // Use the product's unique ID if available, otherwise try to find it
      let productId = item.id || item._id;

      if (!productId) {
        // Try to find product by slug first
        try {
          const found = await apiFetch(`/api/products/slug/${encodeURIComponent(item.slug)}`).then(r => r.json()).catch(() => null);
          productId = found?.id || found?._id;
        } catch (_) { }

        // If still not found, try by name
        if (!productId) {
          try {
            const found = await apiFetch(`/api/products?search=${encodeURIComponent(item.name)}&limit=1`).then(r => r.json()).catch(() => ({}));
            productId = found.products?.[0]?.id || found.products?.[0]?._id || found[0]?.id || found[0]?._id;
          } catch (_) { }
        }
      }

      if (!productId) {
        console.error('Product not found in database:', item.name);
        alert('Product not found in database. Please ensure all products are imported to the database.');
        return;
      }

      console.log('Adding product to wishlist with ID:', productId);

      // Use the toggle wishlist endpoint
      const response = await apiFetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      const result = await response.json();

      if (response.ok) {
        if (result.inWishlist) {
          // Product added to wishlist
          const next = [...wishlist, { ...item, _id: productId, id: productId }];
          setWishlist(next);
          console.log('Product added to wishlist successfully');
        } else {
          // Product removed from wishlist
          const next = wishlist.filter((w) => w.slug !== item.slug);
          setWishlist(next);
          console.log('Product removed from wishlist successfully');
        }
      } else {
        console.error('Wishlist operation failed:', result.message);
        alert(result.message || 'Failed to update wishlist');
      }
    } catch (e) {
      console.error('Wishlist error:', e);
      alert('Failed to update wishlist. Please try again.');
    }
  };

  const isWishlisted = (item) => wishlist.some((w) => w.slug === item.slug);

  // Handle dynamic height calculation for smooth accordion
  const toggleAccordion = (filter, ref) => {
    setActiveFilter(activeFilter === filter ? null : filter);

    const body = ref.current;
    if (body.style.maxHeight) {
      body.style.maxHeight = null;
      body.style.opacity = 0;
    } else {
      body.style.maxHeight = `${body.scrollHeight}px`;  // Set max-height to the scrollHeight of the content
      body.style.opacity = 1;
    }
  };

  // Filtering logic
  let filteredProducts = products.filter(product => {
    const withinPrice = product.price >= selectedPrice[0] && product.price <= selectedPrice[1];
    const colorMatch = selectedColor.length ? selectedColor.includes(product.color) : true;
    const offerMatch = selectedOffer ? product.offer >= selectedOffer : true;
    return withinPrice && colorMatch && offerMatch;
  });

  // Sorting logic
  if (sortOption === 'low-high') filteredProducts.sort((a, b) => a.price - b.price);
  if (sortOption === 'high-low') filteredProducts.sort((a, b) => b.price - a.price);
  if (sortOption === 'name') filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  if (sortOption === 'offer') filteredProducts.sort((a, b) => (b.offer || 0) - (a.offer || 0));

  if (products.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>No products found.</p>;
  }

  // Handle color selection
  const toggleColor = (color) => {
    if (selectedColor.includes(color)) {
      setSelectedColor(selectedColor.filter(c => c !== color));
    } else {
      setSelectedColor([...selectedColor, color]);
    }
  };

  const openFilterDrawer = () => {
    const filterContainer = document.querySelector(".filter-container")

    if (filterContainer) {
      filterContainer.classList.add("open")
    }
  }

  const closeFilterDrawer = () => {
    const filterContainer = document.querySelector(".filter-container")

    console.log("eys")
    if (filterContainer) {
      filterContainer.classList.remove("open")
    }
  }

  return (
    <>

      <section className="product-section">
        <h1>{subcategorySlug.replace(/-/g, ' ')}</h1>

        <div className="product-layout">

          <div className='mobile-filter' onClick={openFilterDrawer}>
            <span>Filter & Sort</span>
          </div>

          {/* Filter Sidebar */}
          <div className="filter-container">
            <h3>Filters <CloseIcon func={closeFilterDrawer} /></h3>

            {/* Price Filter */}
            <div className="accordion">
              <div className="accordion-header" onClick={() => toggleAccordion('price', priceRef)}>
                <p>Price</p>
                <span className={activeFilter === 'price' ? 'active' : ''}>+</span>
              </div>
              <div className="accordion-body" ref={priceRef}>
                {priceOptions.map((range, idx) => (
                  <button
                    key={idx}
                    className={selectedPrice[0] === range[0] && selectedPrice[1] === range[1] ? 'active' : ''}
                    onClick={() => setSelectedPrice(range)}
                  >
                    ₹{range[0].toLocaleString()} - ₹{range[1].toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="accordion">
              <div className="accordion-header" onClick={() => toggleAccordion('color', colorRef)}>
                <p>Color</p>
                <span className={activeFilter === 'color' ? 'active' : ''}>+</span>
              </div>
              <div className="accordion-body color-swatches" ref={colorRef}>
                <button
                  className={selectedColor.length === 0 ? 'active' : ''}
                  onClick={() => setSelectedColor([])}
                >
                  All
                </button>
                {colorOptions.map((color, idx) => (
                  <button
                    key={idx}
                    className={`color-swatch ${selectedColor.includes(color) ? 'active' : ''}`}
                    style={{ background: 'linear-gradient(90deg,rgba(240, 230, 240, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(240, 230, 240, 1) 100%)' }}
                    onClick={() => toggleColor(color)}
                  >{color}</button>
                ))}
              </div>
            </div>

            {/* Offer Filter */}
            <div className="accordion">
              <div className="accordion-header" onClick={() => toggleAccordion('offer', offerRef)}>
                <p>Offer</p>
                <span className={activeFilter === 'offer' ? 'active' : ''}>+</span>
              </div>
              <div className="accordion-body offers" ref={offerRef}>
                {offerOptions.map((offer, idx) => (
                  <label key={idx} style={{ marginRight: "10px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="offer"
                      value={offer}
                      checked={selectedOffer === offer}
                      onChange={() => setSelectedOffer(offer)}
                    />{" "}
                    <span>{offer} <OfferIcon /></span>
                  </label>
                ))}
                <label style={{ cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="offer"
                    value=""
                    checked={selectedOffer === null}
                    onChange={() => setSelectedOffer(null)}
                  />{" "}
                  All
                </label>
              </div>
            </div>

            {/* Sort By */}
            <div className="accordion">
              <div className="accordion-header" onClick={() => toggleAccordion('sort', sortRef)}>
                <p>Sort By</p>
                <span className={activeFilter === 'sort' ? 'active' : ''}>+</span>
              </div>
              <div className="accordion-body" ref={sortRef}>
                <button onClick={() => setSortOption('low-high')}>Price: Low to High</button>
                <button onClick={() => setSortOption('high-low')}>Price: High to Low</button>
                <button onClick={() => setSortOption('name')}>Name</button>
                <button onClick={() => setSortOption('offer')}>Offer</button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="product-grid">
            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
              <div key={product.slug || product.id || product._id} className="product-card">
                <div className='card__media'>
                  <div
                    className='img-container'
                    data-no-image={!product.image || !product.image.trim()}
                    style={{
                      position: 'relative',
                      width: '300px',         // make it square
                      height: '300px',
                      overflow: 'hidden',
                      borderRadius: '10px',   // optional for rounded corners
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f9f9f9' // optional background when no image
                    }}
                  >
                    {/* Always render ProductImage; it will show a minimal placeholder when needed */}
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover', // ensures the image fits neatly inside the square
                        display: 'block'
                      }}
                      showPlaceholder={false}
                      instant={true}
                    />


                    {/* <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                      }}
                      title={isWishlisted(product) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <span style={{ fontSize: 16, color: isWishlisted(product) ? 'red' : '#999' }}>❤</span>
                    </button> */}

                  </div>
                </div>

                <h3>{product.name}</h3>
                <p className="price-info">
                  {product.offer > 0 ? (
                    <>
                      <span className="discounted-price">
                        ₹{Math.round(product.price * (1 - product.offer / 100))}
                      </span>
                      <span className="product-old-price">₹{product.price}</span>
                      <span className="offer-text">({product.offer}% Off)</span>
                    </>
                  ) : (
                    <span className="discounted-price">₹{product.price}</span>
                  )}
                </p>
                <div className='shop-now'>
                  <StarRating rating={product.rating} />
                  <Link to={`/category/${categorySlug}/${subcategorySlug}/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <button>Shop Now <OfferIcon /></button>
                  </Link>
                </div>
              </div>
            )) : <h2>No Products..</h2>}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Product;
