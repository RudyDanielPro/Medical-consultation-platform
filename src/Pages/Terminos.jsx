import { Footer } from "../Components/Footer"
import { Nav_Var } from "../Components/Nav_Var"
import imgsrc from '../assets/maletin 1.png'
export function Terminos() {
    return (

        <>

            <Nav_Var
                imgsrc={imgsrc}
                variante="B"
            />

            <div className="max-w-4xl mx-auto px-4 py-12 text-blue-400">
                <h1 className="text-3xl font-bold text-center mb-8">Términos y Condiciones de Uso</h1>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-2">1. Aceptación de los Términos</h2>
                        <p className="text-white">
                            Al utilizar este sitio web, usted acepta cumplir con estos términos y condiciones.
                            Si no está de acuerdo, absténgase de usarlo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">2. Uso del Sitio</h2>
                        <p className="text-white">
                            Este sitio está destinado a lograr la digitalizacion de las consultas medicas realizadas por los estudiantes de medicina
                            las cuales son revisads por un equipo de especialistas los cuales valoran una calificacion para el estudiante que la realice.
                            No se permite el uso malintencionado o comercial
                            sin autorización.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">3. Propiedad Intelectual</h2>
                        <p className="text-white">
                            Todo el contenido  es propiedad de MEDHISTORY
                            y está protegido por leyes de copyright.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">4. Modificaciones</h2>
                        <p className="text-white">
                            Estos términos pueden actualizarse sin previo aviso. Se recomienda revisarlos periódicamente.
                        </p>
                    </section>
                </div>
            </div>

            <Footer></Footer>


        </>
    )
}