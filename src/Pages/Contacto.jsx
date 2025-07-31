import { Nav_Var } from "../Components/Nav_Var";
import imgsrc from '../assets/maletin 1.png';
import { Footer } from "../Components/Footer";
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

export function Contacto() {
    const form = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const sendEmail = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        emailjs.sendForm(
            'service_yuei4fi',
            'template_v8xl6of',
            form.current,
            '3KHFIYuUSG3iRVKum'
        )
        .then((result) => {
            setSubmitStatus('success');
            form.current.reset();
        }, (error) => {
            setSubmitStatus('error');
            console.error('Error al enviar:', error.text);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <>
            <Nav_Var
                imgsrc={imgsrc}
                variante="B"
            />

            <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 md:py-12">
                <h1 className="mb-4 text-3xl font-bold text-center text-white md:text-4xl">Contáctanos</h1>
                <p className="mb-8 text-lg text-center text-white md:text-xl md:mb-12">
                    ¿Tienes preguntas? Escríbenos y te responderemos en menos de 24 horas.
                </p>

                <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                    <div className="p-6 bg-white shadow-md md:p-8 rounded-xl md:w-2/3">
                        <h2 className="mb-6 text-2xl font-bold text-blue-700">Formulario de Contacto</h2>

                        {submitStatus === 'success' && (
                            <div className="p-4 mb-6 text-green-700 bg-green-100 rounded-lg">
                                ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.
                            </div>
                        )}
                        
                        {submitStatus === 'error' && (
                            <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
                                Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.
                            </div>
                        )}

                        <form ref={form} className="space-y-6" onSubmit={sendEmail}>
                            <input 
                                type="hidden" 
                                name="to_emails" 
                                value="rudysc@estudiantes.uci.cu,aliant@estudiantes.uci.cu" 
                            />

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="from_name"
                                    placeholder="Ej: Juan Pérez"
                                    className="w-full px-4 py-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="from_email"
                                    placeholder="Ej: juan@ejemplo.com"
                                    className="w-full px-4 py-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Asunto</label>
                                <select 
                                    name="subject"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Seleccione un tema</option>
                                    <option value="Soporte técnico">Soporte técnico</option>
                                    <option value="Consulta académica">Consulta académica</option>
                                    <option value="Colaboraciones">Colaboraciones</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Mensaje</label>
                                <textarea
                                    rows="5"
                                    name="message"
                                    placeholder="Describe tu consulta aquí..."
                                    className="w-full px-4 py-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full px-6 py-3 font-bold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 md:w-auto disabled:opacity-50"
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>
                        </form>
                    </div>

                    <div className="p-6 shadow-md bg-blue-50 md:p-8 rounded-xl md:w-1/3">
                        <h2 className="mb-6 text-2xl font-bold text-blue-700">Información Directa</h2>

                        <div className="flex items-start mb-6">
                            <div className="flex-shrink-0 p-3 mr-4 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Correo Electrónico</h3>
                                <p className="text-gray-600">rudysc@estudiantes.uci.cu</p>
                                <p className="text-gray-600">aliant@estudiantes.uci.cu</p>
                            </div>
                        </div>

                        <div className="flex items-start mb-6">
                            <div className="flex-shrink-0 p-3 mr-4 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Teléfono</h3>
                                <p className="text-gray-600">+53 58030795</p>
                                <p className="text-gray-600">+53 56498546</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 p-3 mr-4 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Horario de Atención</h3>
                                <p className="text-gray-600">Lunes a Viernes: 9:00 - 17:00</p>
                            </div>
                        </div>

                        <div className="my-8 border-t border-blue-200"></div>

                        <p className="italic text-gray-700">
                            "Estamos comprometidos con responder todas las dudas o sugerencias en menos de 24 horas hábiles."
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl px-4 py-12 mx-auto sm:px-6">
                <h2 className="mb-8 text-3xl font-bold text-center text-white">Preguntas Frecuentes</h2>
                <div className="space-y-4">
                    {[
                        {
                            question: "¿Cómo garantizan la confidencialidad de los casos médicos?",
                            answer: "Usamos encriptación AES-256 y cumplimos con HIPAA/GDPR."
                        },
                        {
                            question: "¿Pueden integrarse con nuestro LMS institucional?",
                            answer: "Sí, ofrecemos API para integración con Moodle, Blackboard, etc."
                        }
                    ].map((item, index) => (
                        <div key={index} className="pb-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-white">{item.question}</h3>
                            <p className="mt-2 text-white">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
}