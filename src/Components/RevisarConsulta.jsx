import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function RevisarConsulta() {
    const [consulta, setConsulta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConsulta = async () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                const consultaId = queryParams.get('id');
                const doctorEmail = queryParams.get('email');

                if (!consultaId || !doctorEmail) {
                    throw new Error('Faltan parámetros en la URL');
                }

                const response = await fetch(`http://localhost:3001/inquiries/${consultaId}`);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.doctorEmail !== doctorEmail) {
                    throw new Error('No tienes permiso para ver esta consulta');
                }

                setConsulta(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchConsulta();
    }, [location.search]);

    const sendEmailToStudent = async () => {
        try {
            const emailData = {
                to: consulta.studentEmail,
                subject: `Revisión de tu consulta médica - ${consulta.patientName}`,
                text: `Hola ${consulta.studentUsername},\n\n` +
                      `El doctor ha revisado tu consulta sobre el paciente ${consulta.patientName}.\n\n` +
                      `Calificación: ${consulta.doctorGrade}\n` +
                      `Comentarios: ${consulta.doctorComments}\n\n` +
                      `Diagnóstico corregido:\n${consulta.doctorDiagnosisCorrection}\n\n` +
                      `Puedes ver los detalles completos en tu panel de estudiante.\n\n` +
                      `Saludos,\nEquipo Médico`
            };

            const response = await fetch('http://localhost:3001/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                console.error('Error al enviar el email');
            }
        } catch (error) {
            console.error('Error al enviar el email:', error);
        }
    };

    const handleSubmitCorreccion = async (e) => {
        e.preventDefault();
        try {
            // 1. Guardar las correcciones en la consulta
            const response = await fetch(`http://localhost:3001/inquiries/${consulta.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    doctorDiagnosisCorrection: consulta.doctorDiagnosisCorrection,
                    doctorGrade: consulta.doctorGrade,
                    doctorComments: consulta.doctorComments,
                    status: 'completed'
                })
            });

            if (!response.ok) {
                throw new Error('Error al guardar las correcciones');
            }

            // 2. Crear notificación para el ESTUDIANTE
            const notificationData = {
                type: 'consulta_revisada',
                title: 'Consulta médica revisada',
                message: `El doctor ha revisado tu consulta sobre ${consulta.patientName}`,
                studentEmail: consulta.studentEmail,
                formData: {
                    consultaId: consulta.id,
                    estudiante: consulta.studentName,
                    paciente: consulta.patientName,
                    sintomas: consulta.patientSymptoms,
                    correccion: consulta.doctorDiagnosisCorrection,
                    calificacion: consulta.doctorGrade,
                    comentarios: consulta.doctorComments
                },
                read: false,
                createdAt: new Date().toISOString(),
                time: new Date().toLocaleString()
            };

            const notificationResponse = await fetch('http://localhost:3001/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notificationData)
            });

            if (!notificationResponse.ok) {
                throw new Error('Error al crear notificación para el estudiante');
            }

            // 3. Enviar email al estudiante
            await sendEmailToStudent();

            // 4. Redirigir al doctor a sus notificaciones
            navigate(`/notificaciones_d?email=${consulta.doctorEmail}`);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConsulta(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVolver = () => {
        navigate(`/notificaciones_d?email=${new URLSearchParams(location.search).get('email')}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">Cargando consulta...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-white">{error}</div>
            </div>
        );
    }

    return (
        <section className="bg-gray-50 min-h-screen p-6 w-full">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Revisión de Consulta Médica</h1>
            
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-md">
                {/* Sección del Estudiante */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">Datos del Estudiante</h2>
                    
                    <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                            <p className="text-gray-900">{consulta.studentName}</p>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                            <p className="text-gray-900">{consulta.studentEmail}</p>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Usuario</label>
                            <p className="text-gray-900">{consulta.studentUsername}</p>
                        </div>
                    </div>
                </div>

                {/* Sección del Paciente */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">Datos del Paciente</h2>
                    
                    <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 mb-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                            <p className="text-gray-900">{consulta.patientName}</p>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Carnet de Identidad</label>
                            <p className="text-gray-900">{consulta.patientCi}</p>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Edad</label>
                            <p className="text-gray-900">{consulta.patientAge} años</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 mb-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Sexo</label>
                            <p className="text-gray-900">
                                {consulta.patientSex === 'male' ? 'Masculino' : 
                                 consulta.patientSex === 'female' ? 'Femenino' : 'Otro'}
                            </p>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Peso</label>
                            <p className="text-gray-900">{consulta.patientWeight} kg</p>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
                            <p className="text-gray-900">{consulta.patientPhone}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Síntomas Principales</label>
                            <p className="text-gray-900 whitespace-pre-line">{consulta.patientSymptoms}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Padecimientos Conocidos</label>
                            <p className="text-gray-900 whitespace-pre-line">{consulta.patientConditions || 'Ninguno'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Alergias</label>
                            <p className="text-gray-900 whitespace-pre-line">{consulta.patientAllergies || 'Ninguna'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Medicamentos Actuales</label>
                            <p className="text-gray-900 whitespace-pre-line">{consulta.patientCurrentMeds || 'Ninguno'}</p>
                        </div>
                    </div>
                </div>

                {/* Evaluación del Estudiante */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">Evaluación del Estudiante</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Observación Preliminar</label>
                            <p className="text-gray-900 whitespace-pre-line">{consulta.studentObservation}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Tratamiento Propuesto</label>
                            <p className="text-gray-900 whitespace-pre-line">{consulta.studentTreatment}</p>
                        </div>
                    </div>
                </div>

                {/* Formulario de Corrección del Médico */}
                <form onSubmit={handleSubmitCorreccion}>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">Corrección del Médico</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Corrección del Diagnóstico*</label>
                                <textarea
                                    rows="4"
                                    name="doctorDiagnosisCorrection"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={consulta.doctorDiagnosisCorrection || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nota (2-5)*</label>
                                    <select
                                        name="doctorGrade"
                                        className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={consulta.doctorGrade || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccionar nota</option>
                                        <option value="2">2 - Deficiente</option>
                                        <option value="3">3 - Aceptable</option>
                                        <option value="4">4 - Bueno</option>
                                        <option value="5">5 - Excelente</option>
                                    </select>
                                </div>
                                
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios para el Estudiante</label>
                                    <textarea
                                        rows="3"
                                        name="doctorComments"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={consulta.doctorComments || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Botones de Acción */}
                    <div className="mt-8 flex justify-center space-x-6">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Enviar Corrección
                        </button>
                        
                        <button
                            type="button"
                            className="px-8 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            onClick={handleVolver}
                        >
                            Volver
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}