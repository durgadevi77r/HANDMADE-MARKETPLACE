import React from "react";

const careItems = [
  {
    title: "20% Off – Organic Skin Care Kit",
    description: "Includes herbal face wash, natural toner, and aloe moisturizer.",
    image: "https://i.shgcdn.com/c2b43364-ce74-4143-913c-9f20977aae72/-/format/auto/-/preview/3000x3000/-/quality/lighter/",
    tag: "20% OFF"
  },
  {
    title: "Buy 2 Get 1 Free – Essential Hair Care Oils",
    description: "Strengthen and nourish your hair with our pure hibiscus & coconut blend.",
    image: "https://down-ph.img.susercontent.com/file/sg-11134201-23030-59blye3la8nv4c",
    tag: "BUY 2 GET 1"
  },
  {
    title: "Handmade Rose & Oat Soap – Free Herbal Pouch Gift",
    description: "Indulge in our handcrafted rose & oat soap, and receive a free herbal pouch with every purchase.",
    image: "https://mandyandco.in/cdn/shop/articles/rose-petal-luxury-soap-recipe-a-blooming-beauty-543918.jpg?v=1750406840",
    tag: "FREE GIFT"
  },
  {
    title: "Flat ₹500 Off – Luxury Body Care Hamper",
    description: "Premium handmade soap collection with bath salts and scrubs.",
    image: "https://i.etsystatic.com/32367717/r/il/2a24e9/3516329865/il_fullxfull.3516329865_zc90.jpg",
    tag: "₹500 OFF"
  }
];

function Care() {
  return (
    <section className="care-section">
      <h1 className="care-title">Special Care Offers</h1>
      <div className="care-grid">
        {careItems.map((item, index) => (
          <div key={index} className="care-card">
            <div className="care-tag">{item.tag}</div>
            <img src={item.image} alt={item.title} />
            <h3 className="care-name">{item.title}</h3>
            <p className="care-offer">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Care;
