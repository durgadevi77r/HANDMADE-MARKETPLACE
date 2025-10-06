import React from 'react'
import './Common.css'

const offers = [
  {
    title: 'First Order Discount – Flat 20% OFF',
    image: 'https://wallpaperaccess.com/full/1502948.jpg',
    tag:'Offer %'
  },
  {
    title: 'Spend & Save – Fill Your Bag & Get ₹300 Off',
    image: 'https://img.freepik.com/premium-photo/shopper-holding-multiple-shopping-bags-filled-with-black-friday-purchases_931878-1616.jpg',
    tag:'Offer %'
  },
  {
    title: 'Only 3 Left – Handmade Mugs Collection',
    image: 'https://i.etsystatic.com/37250502/c/1080/858/0/438/il/ddb40f/4496505979/il_500x500.4496505979_ld2k.jpg',
    tag:'Offer %'
  },
  {
    title: 'Flash Sale – Ends in 24 Hours',
    image: 'https://i.etsystatic.com/11788371/r/il/85f2cd/2275128383/il_600x600.2275128383_ns2a.jpg',
    tag: 'Offer %'
  },
  {
    title: 'VIP Reward – Gold Gift Box for Loyal Customers',
    image: 'https://img.freepik.com/premium-photo/gold-ribbon-wrapped-gift-box-with-gold-bow_1064589-244813.jpg',
    tag: 'Offer %'
  },
  {
    title: 'Mix & Match – Buy 2 Get 1 Free Earrings',
    image: 'http://www.sycamoreandslate.com/wp-content/uploads/2018/01/IMG_3981-1.jpg',
    tag: 'Offer %'
  }
];



const Offers = () => {
  return (
    <section className="offers-section">
      <h1 className="offers-title">Exclusive Offers</h1>
      <div className="offers-grid">
        {offers.map((offer, index) => (
          <div key={index} className="offer-card">
            <div className="care-tag">{offer.tag}</div>
            <img src={offer.image} alt={offer.title} className="offer-image" />
            <p className="offer-name">{offer.title}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
export default Offers
