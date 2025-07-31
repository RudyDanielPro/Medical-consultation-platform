import { Nav_Var } from "../Components/Nav_Var"
import imgsrc from '../assets/maletin 1.png'
import Rudyimg from '../assets/Team/Rudy.jpg'
import Alianimg from '../assets/Team/Alian.jpg'
import { Footer } from "../Components/Footer"
export function Acerca_de() {
       return (
              <>

                     <Nav_Var
                            imgsrc={imgsrc}
                            className="shadow-md bg-white"
                            variante="B"
                     />

                     <div className="bg-primary-700 text-white py-20 px-4 text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre MedHistory</h1>
                            <p className="text-xl max-w-2xl mx-auto">
                                   Transformando la educación médica a través de la evaluación digital
                            </p>
                     </div>


                     <div className="max-w-4xl mx-auto py-16 px-4">
                            <h2 className="text-3xl font-bold mb-6 text-white">Nuestra Historia</h2>
                            <p className="text-lg text-white mb-4">
                                   Fundada en 2025 por un equipo de futuros ingenieros, MedHistory nació para cerrar la brecha entre la teoría médica y la práctica clínica real.
                            </p>
                            <p className="text-lg text-white">
                                   Hoy conectamos a más de 1,200 estudiantes con más 200 doctores evaluadores en toda Cuba.
                            </p>
                     </div>


                     <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4 pb-16">
                            <div className="bg-blue-50 p-8 rounded-xl">
                                   <h3 className="text-2xl font-bold mb-4 text-black-700">Misión</h3>
                                   <p className="text-gray-700">
                                          Democratizar el acceso a evaluaciones clínicas de calidad, proporcionando herramientas digitales que simulen entornos hospitalarios reales.
                                   </p>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-xl">
                                   <h3 className="text-2xl font-bold mb-4 text-black-700">Visión</h3>
                                   <p className="text-gray-700">
                                          Ser el estándar de oro en formación médica práctica para 2030, reduciendo un 40% los errores diagnósticos en estudiantes.
                                   </p>
                            </div>
                     </div>

                     <div className="bg-gray-50 py-16 px-4">
                            <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Nuestro Equipo</h2>
                            <div className="flex justify-center"> {/* Contenedor flex para centrar */}
                                   <div className="grid md:grid-cols-2 gap-8 max-w-4xl"> {/* Ajusté a 2 columnas y ancho máximo */}
                                          {[
                                                 {
                                                        name: "Alián Torres Mendéz",
                                                        role: "Lider del proyecto ",
                                                        bio: "Estudiante de segundo año de la UCI",
                                                        image: Alianimg
                                                 },
                                                 {
                                                        name: "Rudy Daniel Carballo Miranda",
                                                        role: "Jefe del equipo de desarrollo y desarrollador frontend",
                                                        bio: "Estudiante de segundo año de la UCI",
                                                        image: Rudyimg
                                                 }
                                          ].map((member, index) => (
                                                 <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                                                        <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                                                               <img
                                                                      src={member.image}
                                                                      alt={member.name}
                                                                      className="w-full h-full object-cover"
                                                               />
                                                        </div>
                                                        <h3 className="font-bold text-xl">{member.name}</h3>
                                                        <p className="text-blue-600 mb-2">{member.role}</p>
                                                        <p className="text-gray-700">{member.bio}</p>
                                                 </div>
                                          ))}
                                   </div>
                            </div>
                     </div>


                                          <Footer></Footer>
                                          

              </>
       )
}