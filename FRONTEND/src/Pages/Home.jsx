import React from 'react'
import Care from '../Components/Care.jsx'
import Contact from '../Components/Contact.jsx'
import Footer from '../Components/Footer.jsx'
import Festival from '../Components/Festival.jsx'
import Category from '../Components/Category.jsx'
import Slide from '../Components/Slide.jsx'
import Toys from '../Components/Toys.jsx'
import Trending from '../Components/Trending.jsx'
import Offer from '../Components/Offers.jsx'
import Herobanner from '../Components/Herobanner.jsx'
import About from '../Components/About.jsx'

const Home = () => {
  return (
    <>
      <Herobanner />
      <Category />
      {/* <Slide /> */}
      {/* <Offer /> */}
      {/* <Festival /> */}
      <iframe className='shopping-iframe' src="https://lottie.host/embed/a59e8c93-1288-4617-9fdf-b62ec2ed2094/Ro0roKrjMy.lottie"></iframe>
      <About />
      <Trending />
      {/* <Care /> */}
      {/* <Toys /> */}
      <Contact />
      <Footer />
    </>
  )
}

export default Home