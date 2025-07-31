import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeConsultations, setActiveConsultations] = useState({});
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Obtener emails desde los query params
    const getDoctorEmail = () => new URLSearchParams(location.search).get('email');
    const getStudentEmail = () => new URLSearchParams(location.search).get('email');

    useEffect(() => {
        const fetchData = async () => {
            const email = getDoctorEmail() || getStudentEmail();
            if (!email) return;

            try {
                setLoading(true);
                
                // 1. Obtener notificaciones
                const notificationsRes = await fetch(`http://localhost:3001/notifications?email=${email}`);
                if (!notificationsRes.ok) throw new Error('Error al obtener notificaciones');
                const notificationsData = await notificationsRes.json();

                // 2. Obtener consultas activas (solo para doctores)
                let activeConsults = {};
                if (getDoctorEmail()) {
                    const activeRes = await fetch('http://localhost:3001/consultations/active');
                    if (activeRes.ok) {
                        const activeData = await activeRes.json();
                        activeConsults = activeData.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {});
                    }
                }

                setNotifications(notificationsData);
                setActiveConsultations(activeConsults);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [location.search]);

    // Filtrar notificaciones según el filtro activo
    const filteredNotifications = notifications.filter(notification => {
        switch (activeFilter) {
            case 'unread': 
                return !notification.read;
            case 'rated':
                return notification.type === 'consulta_revisada' && notification.formData?.calificacion;
            case 'all':
            default:
                return true;
        }
    });

    // Marcar notificación como leída
    const markAsRead = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/notifications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true })
            });
            
            if (!response.ok) throw new Error('Error al marcar como leída');
            
            setNotifications(notifications.map(n => 
                n.id === id ? { ...n, read: true } : n
            ));
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    // Eliminar notificación
    const deleteNotification = async (id) => {
        try {
            await fetch(`http://localhost:3001/notifications/${id}`, {
                method: 'DELETE'
            });
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    // Manejar clic en notificación
    const handleNotificationClick = async (notification) => {
        // 1. Marcar como leída si no lo está
        if (!notification.read) await markAsRead(notification.id);

        // 2. Redirigir según tipo
        if (notification.type === 'consulta_revisada') {
            window.location.href = `/consulta-estudiante?id=${notification.formData?.consultaId}&email=${notification.studentEmail || getStudentEmail()}`;
        } 
        else if (notification.type === 'nueva_consulta') {
            // Validar si la consulta está siendo revisada
            if (activeConsultations[notification.formData?.consultaId]) {
                alert('⚠️ Esta consulta está siendo revisada por otro doctor y no puede ser modificada');
                return;
            }
            window.location.href = `/revisar-consulta?id=${notification.formData?.consultaId}&email=${getDoctorEmail()}`;
        }
    };

    // Marcar todas como leídas
    const markAllAsRead = async () => {
        try {
            await Promise.all(
                notifications
                    .filter(n => !n.read)
                    .map(n => markAsRead(n.id))
            );
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Componentes de iconos
    const CheckIcon = () => (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );

    const XIcon = () => (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );

    // Botones de filtro
    const filterButtons = [
        { id: 'all', label: 'Todas' },
        { id: 'unread', label: 'No leídas' },
        { id: 'rated', label: 'Calificadas' }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">Notificaciones</h1>
            
            {/* Barra de acciones */}
            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    disabled={!notifications.some(n => !n.read)}
                >
                    Marcar todas como leídas
                </button>
            </div>

            {/* Filtros */}
            <div className="mb-6 flex flex-wrap gap-2">
                {filterButtons.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeFilter === filter.id 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Lista de notificaciones */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow">
                        {activeFilter === 'unread' 
                            ? 'No hay notificaciones no leídas' 
                            : activeFilter === 'rated' 
                                ? 'No hay notificaciones calificadas' 
                                : 'No hay notificaciones para mostrar'}
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div 
                            key={notification.id}
                            className={`p-4 rounded-lg border transition-all ${
                                notification.read 
                                    ? 'bg-white border-gray-200' 
                                    : 'bg-blue-50 border-blue-200'
                            } shadow-sm cursor-pointer hover:shadow-md`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="flex justify-between">
                                <div className="flex-1">
                                    <div className="flex items-start">
                                        {/* Indicador de no leída */}
                                        {!notification.read && (
                                            <div className="flex-shrink-0 h-3 w-3 rounded-full mt-1.5 mr-2 bg-blue-500"></div>
                                        )}
                                        
                                        <div className="flex-1">
                                            <h3 className={`font-medium ${
                                                notification.read ? 'text-gray-700' : 'text-gray-900'
                                            }`}>
                                                {notification.title}
                                            </h3>
                                            
                                            <p className="text-sm text-gray-600 mt-1">
                                                {notification.message}
                                            </p>
                                            
                                            {/* Datos adicionales */}
                                            {notification.formData && (
                                                <div className="mt-2 text-xs text-gray-500 space-y-1">
                                                    <p><span className="font-medium">Estudiante:</span> {notification.formData.estudiante || 'No especificado'}</p>
                                                    <p><span className="font-medium">Paciente:</span> {notification.formData.paciente || 'No especificado'}</p>
                                                    
                                                    {notification.type === 'consulta_revisada' && (
                                                        <>
                                                            <p><span className="font-medium">Calificación:</span> {notification.formData.calificacion}/5</p>
                                                            <p><span className="font-medium">Comentarios:</span> {notification.formData.comentarios || 'Sin comentarios'}</p>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            
                                            <p className="text-xs text-gray-400 mt-2">
                                                {new Date(notification.time).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Botones de acción */}
                                <div className="flex space-x-2 ml-2">
                                    {!notification.read && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(notification.id);
                                            }}
                                            className="text-gray-400 hover:text-green-500 transition-colors"
                                            title="Marcar como leída"
                                        >
                                            <CheckIcon />
                                        </button>
                                    )}
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('¿Eliminar esta notificación?')) {
                                                deleteNotification(notification.id);
                                            }
                                        }}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        title="Eliminar"
                                    >
                                        <XIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}