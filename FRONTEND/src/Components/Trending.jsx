import './Common.css';
import { useNavigate } from 'react-router-dom';

const Star = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 256 256"
    fill="none"
  >
    <g transform="translate(4.68 4.68) scale(2.73 2.73)">
      <path
        d="M 89.95 34.92 c -0.135 -0.411 -0.519 -0.688 -0.95 -0.688 H 56.508 L 45.948 2.814 C 45.811 2.408 45.43 2.133 45 2.133 s -0.811 0.274 -0.948 0.681 l -10.56 31.417 H 1 c -0.432 0 -0.815 0.277 -0.95 0.688 s 0.009 0.861 0.357 1.117 l 26.246 19.314 l -10 31.21 c -0.131 0.409 0.014 0.856 0.36 1.11 c 0.348 0.257 0.817 0.261 1.168 0.012 L 45 68.795 l 26.818 18.889 c 0.173 0.122 0.375 0.183 0.576 0.183 c 0.208 0 0.416 -0.064 0.592 -0.194 c 0.347 -0.254 0.491 -0.701 0.36 -1.11 l -10 -31.21 l 26.246 -19.314 C 89.94 35.781 90.085 35.331 89.95 34.92 z"
        fill="rgb(255,212,0)"
        stroke="none"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

function Trending() {
  const navigate = useNavigate();

  const handleShopNow = (category, subcategory) => {
    const userToken = localStorage.getItem('userToken');

    if (!userToken) {
      navigate('/signup');
      return;
    }

    // Navigate to subcategory route
    navigate(`/category/${category}/${subcategory}`);
  };

  const trendingItems = [
    {
      title: 'Thanjavur Dolls',
      image: 'https://www.zwende.com/cdn/shop/products/Ethnichiic_Toys_Dolls_Orange_pdp_2_800x.jpg?v=1641197649',
      category: 'asia',
      subcategory: 'India'
    },
    {
      title: 'Hand-painted Ceramic',
      image: 'https://www.christies.com/img/LotImages/2012/CSK/2012_CSK_07207_0033_000(an_egyptian_painted_pottery_jar_predynastic_naqada_ii_circa_3400-3300).jpg',
      category: 'africa',
      subcategory: 'Egypt'
    },
    {
      title: 'French Perfume Bottle',
      image: 'https://i.etsystatic.com/6907852/r/il/78a5a7/5393228478/il_fullxfull.5393228478_lk6v.jpg',
      category: 'europe',
      subcategory: 'France'
    },
    {
      title: 'Cuban Painted Fan',
      image: 'https://m.media-amazon.com/images/I/71Fc116EmcL.jpg',
      category: 'north-america',
      subcategory: 'Cuba'
    },
    {
      title: 'Brazilian Leather Good',
      image: 'https://a.1stdibscdn.com/archivesE/upload/v_4873/v_46388931532603674615/IMG_2610_master.JPG?width=768',
      category: 'south-america',
      subcategory: 'Brazil'
    },
    {
      title: 'Samoan Coconut Shell Craft',
      image: 'https://i.pinimg.com/736x/9f/e0/70/9fe070bf5f357a657bb1ce42e2be77b5.jpg',
      category: 'australia&oceania',
      subcategory: 'Samoa'
    },
    // {
    //   title: 'Creative Handmade Candle',
    //   image: 'https://i.etsystatic.com/10017118/r/il/672e81/2119705363/il_794xN.2119705363_k8lr.jpg',
    //   category: 'gifts-festivel',
    //   subcategory: 'Candles '
    // },
    // {
    //   title: 'Woven Rattan Baskets',
    //   image: 'https://i.etsystatic.com/38542582/r/il/8e9b7a/5048249387/il_300x300.5048249387_qfjs.jpg',
    //   category: 'home-decor',
    //   subcategory: 'Storage Baskets'
    // },
    // {
    //   title: 'Personalized Leather Keychains',
    //   image: 'https://i.etsystatic.com/12648545/r/il/622487/1398662871/il_fullxfull.1398662871_hdve.jpg',
    //   category: 'gifts-festivals',
    //   subcategory: 'KeyChains'
    // }
  ];

  return (
    <section className="trending-section">
      <h2 className="trending-title">Trending Now</h2>
      <div className='trending-container'>
        <div className="trending-grid">
          {trendingItems.map((item, idx) => (
            <div className="trending-card card__media" key={idx} style={{ position: 'relative' }}>
              <div className="img-container trending-square">
                <img src={item.image} alt={item.title} className="trending-image" />
              </div>


              <div className="trending-info">
                <p className="trending-name">{item.title}</p>

                <div className="star-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>

                <button
                  className="shop-now-btn"
                  onClick={() => handleShopNow(item.category, item.subcategory)}
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Trending;
