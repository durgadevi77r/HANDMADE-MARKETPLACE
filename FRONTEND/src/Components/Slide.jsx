import React, { useEffect, useState } from 'react';
import './Common.css';

const Slide = () => {
  const slides = [
    {
      image: "https://img.freepik.com/premium-photo/photo-mexican-pottery-beautiful-hand-arttraditional-culture_1049673-328.jpg",
      title: "Exclusive Pottery – 30% OFF Today Only"
    },
    {
      image: "https://c0.wallpaperflare.com/preview/109/959/806/arts-and-crafts-background-bags-bright.jpg",
      title: "Sling Bags – Flat ₹499 | No Code Needed"
    },
    {
      image: "https://get.wallhere.com/photo/handmade-crafts-crochet-pillow-cushions-handmaid-liset-948727.jpg",
      title: "Cushion Sets – Buy 2, Get 1 FREE"
    },
    {
      image: "https://images.radio.com/aiu-media/KissofDeathRetroHangingSolarLanterns27470688a91c483e8037e7308e555cfc-3ac9efc9-e55c-4875-acf0-4f588367dfbf.jpg",
      title: "Vintage Lanterns – FLASH SALE 50% OFF"
    },
    {
      image: "https://www.architectureartdesigns.com/wp-content/uploads/2014/03/18-Unique-Handmade-Pendant-Light-Designs-7.jpg",
      title: "Handmade Lights – Upto 60% OFF + Free Shipping"
    },
    {
      image: "https://i.etsystatic.com/24285702/r/il/4a7edc/2889372751/il_794xN.2889372751_3gbs.jpg",
      title: "Ambient Lights – Uplift Your Home Aesthetic"
    },
    {
      image: "https://wallpapercave.com/wp/wp1850367.jpg",
      title: "Handmade Candles – Buy 1 Get 1 FREE"
    },
    {
      image: "https://images5.alphacoders.com/464/thumb-1920-464196.jpg",
      title: "Designer Earrings – Limited Stock!"
    },
    {
      image: "https://www.wallpaperuse.com/wallp/58-588821_m.jpg",
      title: "Thread Bangle – Colorful Styles Starting at ₹299"
    },
    {
      image: "https://cdn0.weddingwire.in/article/5445/3_2/960/jpg/45445-terracotta-jewellery-varnika-terracotta-facebook-lead.jpeg",
      title: "Terracotta Jewelry – Earthy, Elegant & Unique"
    },
    {
      image: "https://www.bwallpaperhd.com/wp-content/uploads/2022/08/RakhiIndia-1024x576.jpg",
      title: "Festive Rakhis – Handcrafted With Love"
    },
    {
      image: "https://i.etsystatic.com/19700512/c/2047/2047/147/351/il/5c87e0/4808860416/il_600x600.4808860416_nxec.jpg",
      title: "Wall Hangings – Handmade & Elegant"
    }
  ];



  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section id='slider'>
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="slide"
            style={{
              display: index === current ? 'flex' : 'none',
              opacity: index === current ? 1 : 0
            }}
          >
            <img src={slide.image} alt={slide.title} />
            <div className="slide-title">{slide.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Slide;