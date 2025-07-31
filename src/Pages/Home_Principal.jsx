import { Nav_Var } from "../Components/Nav_Var"
import imgsrc from '../assets/maletin 1.png'
import { ImageCarousel } from "../Components/ImageCarousel"
import { HeroSection } from "../Components/HeroSection"
import { Footer } from "../Components/Footer"
import { FeaturesGrid } from "../Components/FeaturesGrid"
export function Home_Principal() {
    return (
        <>

            <Nav_Var
                imgsrc={imgsrc}
               
                variante="B"
            />



            <HeroSection />

            <div className="py-12 bg-gradient-to-b from-white to-blue-50">
                <ImageCarousel />
            </div>


            <FeaturesGrid></FeaturesGrid>

            <Footer></Footer>
        </>
    )
}