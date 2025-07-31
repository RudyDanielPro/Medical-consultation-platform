import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function ConsultaEstudiante() {
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
                const studentEmail = queryParams.get('email');

                if (!consultaId || !studentEmail) {
                    throw new Error('Faltan parámetros en la URL');
                }

                // 1. Obtener todas las notificaciones del estudiante
                const notifResponse = await fetch(
                    `http://localhost:3001/notifications?studentEmail=${studentEmail}`
                );
                
                if (!notifResponse.ok) {
                    throw new Error('Error al obtener notificaciones');
                }

                const allNotifications = await notifResponse.json();
                
                // 2. Filtrar manualmente por consultaId
                const notificacionesValidas = allNotifications.filter(
                    notif => notif.formData?.consultaId == consultaId && 
                             notif.type === 'consulta_revisada'
                );

                if (notificacionesValidas.length === 0) {
                    throw new Error('No tienes permiso para ver esta consulta o no existe');
                }

                // 3. Obtener la consulta
                const response = await fetch(`http://localhost:3001/inquiries/${consultaId}`);
                if (!response.ok) {
                    throw new Error('Consulta no encontrada');
                }

                const data = await response.json();
                
                // 4. Verificación adicional (opcional)
                if (data.studentEmail && data.studentEmail.toLowerCase() !== studentEmail.toLowerCase()) {
                    throw new Error('No tienes permiso para ver esta consulta');
                }

                setConsulta(data);
                setLoading(false);
                
            } catch (err) {
                setError(err.message);
                setLoading(false);
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    navigate(`/notificaciones?email=${new URLSearchParams(location.search).get('email')}`);
                }, 2000);
            }
        };

        fetchConsulta();
    }, [location.search, navigate]);

    const handleVolver = () => {
        navigate(`/notificaciones?email=${new URLSearchParams(location.search).get('email')}`);
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
        <section className="bg-gray-50 min-h-screen p-4 sm:p-6 w-full">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-blue-800">Consulta Médica Revisada</h1>
                
                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md">
                    {/* Sección del Paciente */}
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-blue-700 border-b pb-2 mb-3 sm:mb-4">Datos del Paciente</h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 sm:mb-6">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Nombre</label>
                                <p className="text-gray-900 text-sm sm:text-base">{consulta.patientName}</p>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Carnet de Identidad</label>
                                <p className="text-gray-900 text-sm sm:text-base">{consulta.patientCi}</p>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Edad</label>
                                <p className="text-gray-900 text-sm sm:text-base">{consulta.patientAge} años</p>
                            </div>
                        </div>
                        
                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Síntomas Principales</label>
                                <p className="text-gray-900 text-sm sm:text-base whitespace-pre-line">{consulta.patientSymptoms}</p>
                            </div>
                        </div>
                    </div>

                    {/* Evaluación Original del Estudiante */}
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-blue-700 border-b pb-2 mb-3 sm:mb-4">Tu Evaluación Original</h2>
                        
                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Observación Preliminar</label>
                                <p className="text-gray-900 text-sm sm:text-base whitespace-pre-line">{consulta.studentObservation}</p>
                            </div>
                            
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Tratamiento Propuesto</label>
                                <p className="text-gray-900 text-sm sm:text-base whitespace-pre-line">{consulta.studentTreatment}</p>
                            </div>
                        </div>
                    </div>

                    {/* Corrección del Médico */}
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-blue-700 border-b pb-2 mb-3 sm:mb-4">Corrección del Médico</h2>
                        
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Diagnóstico Corregido</label>
                                <div className="w-full p-3 sm:p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <p className="text-gray-900 text-sm sm:text-base whitespace-pre-line">{consulta.doctorDiagnosisCorrection}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Calificación</label>
                                    <div className="w-full md:w-2/3 p-2 bg-gray-50 rounded-md border border-gray-200">
                                        <p className="text-gray-900 text-sm sm:text-base">{consulta.doctorGrade}/5</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Comentarios</label>
                                    <div className="w-full p-3 sm:p-4 bg-gray-50 rounded-md border border-gray-200">
                                        <p className="text-gray-900 text-sm sm:text-base whitespace-pre-line">{consulta.doctorComments || 'Sin comentarios'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Botón de Volver */}
                    <div className="mt-6 sm:mt-8 flex justify-center">
                        <button
                            type="button"
                            className="px-6 py-2 sm:px-8 sm:py-3 bg-gray-600 text-white text-sm sm:text-base font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            onClick={handleVolver}
                        >
                            Volver a Notificaciones
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}