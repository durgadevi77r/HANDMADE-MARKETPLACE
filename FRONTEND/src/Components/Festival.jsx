// Festival.jsx
import './Common.css'
import { useNavigate } from 'react-router-dom';
function Festival() {
  const navigate = useNavigate();

  const handleShopNow = (title) => {
    // Check if user is logged in
    const userToken = localStorage.getItem('userToken');

    if (!userToken) {
      // If not logged in, redirect to signup page
      navigate('/signup');
      return;
    }

    // If logged in, navigate to the product category
    // Convert title to slug format for URL
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${slug}`);
  };
  const festivalItems = [
    {
      title: 'Diwali Decor',
      image: 'https://img.freepik.com/premium-photo/diya-decoration-diwali_670382-105745.jpg'
    },
    {
      title: 'Ganesh Chaturthi Pendant',
      image: 'https://images-static.nykaa.com/media/catalog/product/tr:h-800,w-800,cm-pad_resize/e/9/e984d0313RAK-276-295-322-3_1.jpg'
    },
    {
      title: 'Raksha Bandhan Special',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/004/976/628/small_2x/indian-festival-raksha-bandhan-background-with-an-elegant-rakhi-rice-grains-and-kumkum-a-traditional-indian-wrist-band-which-is-a-symbol-of-love-between-brothers-and-sisters-photo.jpg'
    },
    {
      title: 'Onam Festivities',
      image: 'https://i.etsystatic.com/36000949/r/il/877ca9/4685530584/il_1588xN.4685530584_l9dn.jpg'
    },
    {
      title: 'Christmas Glow',
      image: 'https://i.etsystatic.com/6147999/r/il/8876ba/5324082866/il_300x300.5324082866_s02o.jpg'
    },
    {
      title: 'Durga Ashtami',
      image: 'https://5.imimg.com/data5/SELLER/Default/2023/9/342025133/CW/EQ/RN/152039596/terracotta-jewellery-1000x1000.jpeg'
    }
  ];



  return (
    <div className="festival-section">
      <h2 className="festival-title">Festive Collections</h2>
      <div className="festival-grid">
        {festivalItems.map((item, index) => (
          <div className="festival-card" key={index}>
            <img src={item.image} alt={item.title} className="festival-image" />
            <p className="festival-name">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Festival;
