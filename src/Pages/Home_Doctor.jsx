import imgsrc from '../assets/maletin 1.png';
import { ImageCaruselD } from '../Components/ImageCaruselD';
import { Nav_Var } from '../Components/Nav_Var';

export function Home_Doctor() {
    return (
        <>
            <Nav_Var imgsrc={imgsrc} variante="D" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#31af36]">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white mb-2">Panel de Control Médico</h1>
                    <p className="text-lg text-white">Bienvenido</p>
                </header>

                

            </div>
            <div className="py-12 bg-gradient-to-b from-white to-blue-50">
                    <ImageCaruselD />
                </div>
        </>
    )
}