import React from 'react'
import './Herobanner.css'

const Herobanner = () => {
  return (
    <div className='craftsy-banner' id='Herobanner'>
      <div className='banner-content'>
        {/* Craftsy Nest Logo */}
        <div className='banner-logo'>
          <div className='logo-bird'>🐦</div>
          <h1 className='logo-text'>Craftsy Nest<span className='tm'>™</span></h1>
        </div>

        {/* Main Banner Layout */}
        <div className='banner-layout'>
          {/* Left Side - Country Cards */}
          <div className='country-cards left-cards'>
            <div className='country-card india-card'>
              <div className='country-flag'>🇮🇳</div>
              <div className='craft-image peacock'>
                <svg viewBox="0 0 100 100" className="peacock-svg">
                  <path d="M50 20 C45 25, 40 35, 45 45 C50 50, 55 45, 60 35 C65 25, 55 20, 50 20 Z" fill="#4a90e2"/>
                  <circle cx="50" cy="30" r="8" fill="#ff6b6b"/>
                  <circle cx="45" cy="32" r="3" fill="#4ecdc4"/>
                  <circle cx="55" cy="32" r="3" fill="#ffe66d"/>
                </svg>
              </div>
              <div className='country-info'>
                <h3>INDIA -</h3>
                <p>Madhubani Painting</p>
              </div>
            </div>

            <div className='country-card mexico-card'>
              <div className='country-flag'>🇲🇽</div>
              <div className='craft-image pottery'>
                <svg viewBox="0 0 100 100" className="pottery-svg">
                  <circle cx="50" cy="50" r="30" fill="#4a90e2" stroke="#2c5aa0" strokeWidth="2"/>
                  <path d="M30 50 Q50 30, 70 50 Q50 70, 30 50" fill="#fff" opacity="0.3"/>
                </svg>
              </div>
              <div className='country-info'>
                <h3>MEXICO</h3>
                <p>Talavera Pottery</p>
              </div>
            </div>
          </div>

          {/* Center - Phone Mockup */}
          <div className='phone-mockup'>
            <div className='phone-frame'>
              <div className='phone-screen'>
                <div className='phone-header'>
                  <div className='time'>19:21</div>
                  <div className='phone-status'>
                    <span className='signal'>📶</span>
                    <span className='wifi'>📶</span>
                    <span className='battery'>🔋</span>
                  </div>
                </div>
                <div className='app-content'>
                  <div className='app-header'>
                    <div className='hamburger'>☰</div>
                    <div className='app-title'>Craft Merin</div>
                    <div className='profile'>👤</div>
                  </div>
                  <div className='app-body'>
                    <h3>Craft Products</h3>
                    <div className='product-grid'>
                      <div className='product-item'>
                        <div className='product-image blue-vase'></div>
                        <p>Ceramic Vases</p>
                      </div>
                      <div className='product-item'>
                        <div className='product-image yellow-vase'></div>
                        <p>Pottery</p>
                      </div>
                      <div className='product-item'>
                        <div className='product-image brown-item'></div>
                        <p>$3.00</p>
                      </div>
                      <div className='product-item'>
                        <div className='product-image craft-item'></div>
                        <p>$1.50</p>
                      </div>
                      <div className='product-item'>
                        <div className='product-image wooden-item'></div>
                        <p>$3.00</p>
                      </div>
                      <div className='product-item'>
                        <div className='product-image decorative'></div>
                        <p>Crafts</p>
                      </div>
                    </div>
                  </div>
                  <div className='app-footer'>
                    <div className='nav-item'>Search</div>
                    <div className='nav-item'>🏠</div>
                    <div className='nav-item'>Saved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Country Cards */}
          <div className='country-cards right-cards'>
            <div className='country-card italy-card'>
              <div className='country-flag'>🇮🇹</div>
              <div className='craft-image jewelry'>
                <svg viewBox="0 0 100 100" className="jewelry-svg">
                  <circle cx="50" cy="40" r="25" fill="none" stroke="#8b4513" strokeWidth="3"/>
                  <circle cx="35" cy="40" r="4" fill="#ff4757"/>
                  <circle cx="50" cy="40" r="4" fill="#2ed573"/>
                  <circle cx="65" cy="40" r="4" fill="#3742fa"/>
                </svg>
              </div>
              <div className='country-info'>
                <h3>ITALY -</h3>
                <p>Masain Bead Jewelry</p>
              </div>
            </div>

            <div className='country-card australia-card'>
              <div className='country-flag'>🇦🇺</div>
              <div className='craft-image aboriginal'>
                <svg viewBox="0 0 100 100" className="aboriginal-svg">
                  <circle cx="30" cy="30" r="8" fill="#ff6b6b"/>
                  <circle cx="50" cy="30" r="6" fill="#4ecdc4"/>
                  <circle cx="70" cy="30" r="8" fill="#ffe66d"/>
                  <circle cx="30" cy="50" r="6" fill="#4a90e2"/>
                  <circle cx="50" cy="50" r="8" fill="#ff6b6b"/>
                  <circle cx="70" cy="50" r="6" fill="#4ecdc4"/>
                  <circle cx="30" cy="70" r="8" fill="#ffe66d"/>
                  <circle cx="50" cy="70" r="6" fill="#4a90e2"/>
                  <circle cx="70" cy="70" r="8" fill="#ff6b6b"/>
                </svg>
              </div>
              <div className='country-info'>
                <h3>AUSTRALIA</h3>
                <p>Aboriginal Dot Painting</p>
              </div>
            </div>
          </div>

          {/* Peru Card - Bottom */}
          <div className='country-card peru-card'>
            <div className='country-flag'>🇵🇪</div>
            <div className='craft-image weaving'>
              <svg viewBox="0 0 100 100" className="weaving-svg">
                <rect x="20" y="30" width="60" height="40" fill="#8b4513"/>
                <rect x="25" y="35" width="10" height="30" fill="#ff6b6b"/>
                <rect x="40" y="35" width="10" height="30" fill="#4ecdc4"/>
                <rect x="55" y="35" width="10" height="30" fill="#ffe66d"/>
                <rect x="70" y="35" width="10" height="30" fill="#4a90e2"/>
              </svg>
            </div>
            <div className='country-info'>
              <h3>PERU</h3>
              <p>Alpaca Wool Weaving</p>
            </div>
            <div className='sale-tag'>SALE</div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className='banner-tagline'>
          <h2>Discover Handmade Crafts from</h2>
          <h2>Every Corner of the World</h2>
        </div>

        {/* Decorative Elements */}
        <div className='decorative-elements'>
          <div className='shopping-cart'>🛒</div>
          <div className='star star-1'>⭐</div>
          <div className='star star-2'>⭐</div>
          <div className='gift-box'>🎁</div>
        </div>
      </div>
    </div>
  )
}

export default Herobanner