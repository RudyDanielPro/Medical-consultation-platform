import { Footer } from "../Components/Footer"
import { Nav_Var } from "../Components/Nav_Var"
import imgsrc from '../assets/maletin 1.png'

export function Privacidad() {
    return (

        <>
           <Nav_Var
                imgsrc={imgsrc}
                variante="B"
            />



            <div className="max-w-4xl mx-auto px-4 py-12 text-white">
                <h1 className="text-3xl font-bold text-center mb-8">Política de Privacidad</h1>

                <div className="space-y-6 text-white">
                    <section>
                        <h2 className="text-xl font-semibold mb-2 ">1. Datos Recopilados</h2>
                        <p className="text-white">
                            Recopilamos información que usted nos proporciona voluntariamente 
                            a través de formularios de contacto. No almacenamos datos financieros.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">2. Uso de los Datos</h2>
                        <p className="text-white">
                            Sus datos se utilizan exclusivamente para responder consultas y mejorar nuestros servicios.
                            No se compartirán con terceros sin su consentimiento.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">3. Cookies</h2>
                        <p className="text-white">
                            Este sitio puede usar cookies para análisis web. Puede desactivarlas en la configuración
                            de su navegador.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">4. Seguridad</h2>
                        <p className="text-white">
                            Implementamos medidas de seguridad para proteger sus datos, pero no garantizamos protección
                            absoluta contra accesos no autorizados.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">5. Derechos del Usuario</h2>
                        <p className="text-white">
                            Puede solicitar acceso, corrección o eliminación de sus datos enviando un correo a
                           <span className="text-blue-400 hover:text-blue-600"> <br />
                            rudysc@estudiantes.uci.cu</span> <br />
                             <span className="text-blue-400 hover:text-blue-600"> aliant@estudiantes.uci.cu</span> .
                        </p>
                    </section>
                </div>
            </div>



            <Footer></Footer>


        </>



    )

}