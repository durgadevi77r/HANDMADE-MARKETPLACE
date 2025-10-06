import React from 'react'
import './About.css'

const About = () => {
  return (
    <section className="about-section">
      <div className="about-background-circle"></div>
      <div className="about-background-circle-2"></div>
      <div className="about-background-pattern"></div>

      <div className="about-container">
        <div className="about-header">
          <h2 className="about-title">About Our Global Craft Marketplace</h2>
          <p className="about-subtitle">
            Experience a world of creativity — where six continents unite to showcase
            the beauty of handcraft, culture, and design through authentic artisan-made products.
          </p>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p>
              Our platform brings together talented artisans from every corner of the globe.
              Each continent represents a collection of six countries, each with its
              own signature artistry, cultural inspiration, and craftsmanship traditions.
            </p>
            <p>
              From the elegance of Asian ceramics to the warmth of African woodwork,
              and the modern charm of European textiles, our marketplace bridges
              tradition and innovation through authentic handcrafted excellence.
            </p>
          </div>

          <div className="about-continents">
            <div className="continent-card">
              <h3>🌸 Asia</h3>
              <p>Discover delicate Japanese pottery, Indian embroidery, Thai silk,
              and handcrafted jewelry from Indonesia, China, and Vietnam — blending
              ancient craftsmanship with modern creativity.</p>
            </div>

            <div className="continent-card">
              <h3>🌍 Africa</h3>
              <p>From Kenyan beadwork to Moroccan ceramics, Ghanaian baskets,
              Egyptian glass, Ethiopian textiles, and South African wood art — every
              creation tells a story of heritage and heart.</p>
            </div>

            <div className="continent-card">
              <h3>🎨 Europe</h3>
              <p>Explore Italian leatherwork, French perfumes, Spanish ceramics,
              British homeware, Greek art pieces, and German craftsmanship — a
              celebration of timeless European design.</p>
            </div>

            <div className="continent-card">
              <h3>🏔️ North America</h3>
              <p>Featuring Canadian handmade candles, Mexican pottery, American woodcrafts,
              Cuban woven art, Guatemalan textiles, and Costa Rican eco products —
              blending modern trends with artisanal roots.</p>
            </div>

            <div className="continent-card">
              <h3>🌿 South America</h3>
              <p>Discover the rich artistry of Brazil’s woven crafts, Chilean copper art,
              Peruvian alpaca wear, Argentinian leather, Colombian ceramics, and
              Ecuadorian handmade jewelry.</p>
            </div>

            <div className="continent-card">
              <h3>❄️ Oceania</h3>
              <p>Immerse in the natural elegance of Australian ceramics, New Zealand Maori carvings,
              Fijian textiles, Tahitian pearls, Samoan coconut crafts, and Papuan
              wooden masks — all crafted with soulful precision.</p>
            </div>
          </div>
        </div>

        <div className="about-footer">
          <p>
            Each product on our platform carries a story — of culture, tradition, and artistry.
            We’re proud to be a bridge connecting global creators with admirers who
            appreciate beauty beyond borders.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
