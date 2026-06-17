import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Stats from "../components/Stats"
import Features from "../components/Features"
import HowItWorks from "../components/HowItWorks"
import ProductsPreview from "../components/ProductsPreview"
import Footer from "../components/Footer"

export default function Home(){
  return(
    <>
      <Navbar/>
      <Hero/>
      <Stats/>
      <Features/>
      <HowItWorks/>
      <ProductsPreview/>
      <Footer/>
    </>
  );
}
