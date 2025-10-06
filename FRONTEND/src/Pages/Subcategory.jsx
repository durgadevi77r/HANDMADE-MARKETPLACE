import React from "react";
import { useParams, Link } from "react-router-dom";
import subcategoriesData from "../Data/Categorydata";
import subcategoryImages from "../Data/SubcategoryImages";
import './Category.css';
import '../styles/ProductImageFix.css';
import Footer from "../Components/Footer"; 
import ProductImage from '../Components/ProductImage';

const Subcategory = () => {
  const { categorySlug } = useParams();
  const subcategoryObj = subcategoriesData[categorySlug] || {};
  const subcategories = Object.keys(subcategoryObj);

  // Capitalize first letter
  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <>
      <section className="category-section">
        <div className="heading">
          <h1>{capitalize(categorySlug)}</h1>
        </div>

        <div className="category-container">
          {subcategories.length === 0 ? (
            <p style={{ textAlign: "center" }}>No subcategories available.</p>
          ) : (
            <div className="category-grid">
              {subcategories.map((subKey, index) => {
                const image =
                  subcategoryImages[categorySlug]?.[subKey] ||
                  subcategoryObj[subKey][0]?.image;

                return (
                  <Link
                    key={index}
                    to={`/category/${categorySlug}/${subKey}`}
                    className="category-card"
                  >
                    <div className="img-container">
                      <ProductImage 
                        src={image} 
                        alt={subKey}
                        showPlaceholder={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                    <h3>{subKey}</h3>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
};

export default Subcategory;
