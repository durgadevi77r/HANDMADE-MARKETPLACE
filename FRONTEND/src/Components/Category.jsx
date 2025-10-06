import React from 'react';
import { Link } from 'react-router-dom';
import './Common.css';
import '../styles/ProductImageFix.css';
import ProductImage from './ProductImage';

const categories = [
  {
    name: 'Asia',
    slug: 'asia',
    image: 'https://www.laurewanders.com/wp-content/uploads/2022/05/Famous-landmarks-in-Asia-Taj.jpg'
  },
  {
    name: 'Africa',
    slug: 'africa',
    image: 'https://wallup.net/wp-content/uploads/2019/10/246828-egypt-pyramids-great-pyramid-of-giza.jpg'
  },
  {
    name: 'Europe',
    slug: 'europe',
    image: 'https://cdn.britannica.com/52/245552-050-3D7334F9/Eiffel-Tower-Paris.jpg'
  },
  {
    name: 'North America',
    slug: 'north-america',
    image: 'https://cdn.zmescience.com/wp-content/uploads/2022/12/richard-iwaki-ZsqtZUAe3u4-unsplash-scaled.jpg'
  },
  {
    name: 'South America',
    slug: 'south-america',
    image: 'https://i.pinimg.com/originals/8f/ac/66/8fac662c8a25ec7b748fcef6f35a8e7e.jpg'
  },
  {
    name: 'Australia & Oceania',
    slug: 'australia&oceania',
    image: 'https://www.michaelwest.com.au/wp-content/uploads/2018/08/opera-house.cropped-1280x640.jpg'
  }
];

const Category = () => {
  return (
    <section className='category-section'>
      <div className="heading">
        <h1>Explore by Region</h1>
      </div>
      <div className="category-container">
        <div className="category-grid">
          {categories.map((cat, index) => (
            <Link
              to={`/category/${cat.slug}`}
              key={index}
              className="category-card card__media"
            >
              <div className='img-container'>
                <ProductImage 
                  src={cat.image} 
                  alt={cat.name}
                  showPlaceholder={false}
                  instant={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <p>{cat.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
