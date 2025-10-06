import React from "react";

const toyItems = [
  {
    title: "Crochet Teddy Bear",
    description: "Handmade soft crochet teddy bear perfect for gifting.",
    image: "https://i.etsystatic.com/35079893/r/il/c96f9d/3802121688/il_fullxfull.3802121688_28mm.jpg",
    tag: "BUY 1 GET 1"
    
  },
  {
    title: "Elephant Figurine",
    description: "Elegant decorative elephant figurine for home décor.",
    image: "https://nestasia.in/cdn/shop/files/ElephantResinDecor_8.jpg?v=1694853242",
    tag: "FREE GIFT"
  },
  {
    title: "Fabric Rag Doll",
    description: "Adorable handcrafted fabric rag doll for kids.",
    image: "https://i.etsystatic.com/11234485/r/il/c8059c/2668258192/il_570xN.2668258192_b3tb.jpg",
    tag: "FLAT ₹299"
  },
  {
    title: "Knitted Plush Fox",
    description: "Cute knitted plush fox with free gift wrapping.",
    image: "https://www.thefriendlyredfox.com/wp-content/uploads/2021/08/IMG_1270.jpg",
    tag: "20% OFF"
  }
];

function Toys() {
  return (
    <section className="toy-section">
      <h1 className="toy-title">Toy Discount Zone</h1>
      <div className="toy-grid">
        {toyItems.map((item, index) => (
          <div key={index} className="toy-card">
            <div className="toy-tag">{item.tag}</div>
            <img src={item.image} alt={item.title} />
            <h3 className="toy-name">{item.title}</h3>
            <p className="toy-offer">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Toys;
