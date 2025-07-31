import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function CrearConsulta() {
    const [consulta, setConsulta] = useState({
        studentEmail: '',
        doctorEmail: '',
        patientName: '',
        patientCi: '',
        patientAge: '',
        patientSex: '',
        patientWeight: '',
        patientPhone: '',
        patientSymptoms: '',
        patientConditions: '',
        patientAllergies: '',
        patientCurrentMeds: '',
        studentObservation: '',
        studentTreatment: ''
    });
    
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener lista de doctores
        const fetchDoctors = async () => {
            try {
                const response = await fetch('http://localhost:3001/users?userType=doctor');
                if (!response.ok) throw new Error('Error al obtener doctores');
                const data = await response.json();
                setDoctors(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConsulta(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Guardar la consulta
            const consultaResponse = await fetch('http://localhost:3001/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...consulta,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                })
            });

            if (!consultaResponse.ok) throw new Error('Error al crear consulta');
            const nuevaConsulta = await consultaResponse.json();

            // 2. Notificación para el DOCTOR
            const notifDoctor = {
                type: 'nueva_consulta',
                title: 'Nueva consulta asignada',
                message: `Tienes una nueva consulta de ${consulta.studentName} sobre ${consulta.patientName}`,
                doctorEmail: consulta.doctorEmail,
                formData: {
                    consultaId: nuevaConsulta.id,
                    estudiante: consulta.studentName,
                    paciente: consulta.patientName,
                    sintomas: consulta.patientSymptoms
                },
                read: false,
                createdAt: new Date().toISOString(),
                time: new Date().toLocaleString()
            };

            await fetch('http://localhost:3001/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notifDoctor)
            });

            // Redirigir al estudiante
            navigate(`/notificaciones?email=${consulta.studentEmail}`);
            
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    if (loading) return <div className="p-4 text-center">Cargando...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Crear Nueva Consulta Médica</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Sección Información del Paciente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Nombre del Paciente */}
                    <div className="space-y-1">
                        <label className="block text-sm sm:text-base font-medium">Nombre del Paciente</label>
                        <input
                            type="text"
                            name="patientName"
                            value={consulta.patientName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                            required
                        />
                    </div>

                    {/* CI del Paciente */}
                    <div className="space-y-1">
                        <label className="block text-sm sm:text-base font-medium">Carnet de Identidad</label>
                        <input
                            type="text"
                            name="patientCi"
                            value={consulta.patientCi}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                            required
                        />
                    </div>

                    {/* Edad */}
                    <div className="space-y-1">
                        <label className="block text-sm sm:text-base font-medium">Edad</label>
                        <input
                            type="number"
                            name="patientAge"
                            value={consulta.patientAge}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                            required
                        />
                    </div>

                    {/* Sexo */}
                    <div className="space-y-1">
                        <label className="block text-sm sm:text-base font-medium">Sexo</label>
                        <select
                            name="patientSex"
                            value={consulta.patientSex}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                            required
                        >
                            <option value="">Seleccionar</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    {/* Peso */}
                    <div className="space-y-1">
                        <label className="block text-sm sm:text-base font-medium">Peso (kg)</label>
                        <input
                            type="number"
                            name="patientWeight"
                            value={consulta.patientWeight}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                        />
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-1">
                        <label className="block text-sm sm:text-base font-medium">Teléfono</label>
                        <input
                            type="tel"
                            name="patientPhone"
                            value={consulta.patientPhone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                        />
                    </div>
                </div>

                {/* Sección Historial Médico */}
                <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg sm:text-xl font-semibold">Historial Médico</h2>
                    
                    {/* Síntomas */}
                    <div className="space-y-1">
                        <label className="block text-sm sm:text-base font-medium">Síntomas</label>
                        <textarea
                            name="patientSymptoms"
                            value={consulta.patientSymptoms}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                            required
                        />
                    </div>

                    {/* Condiciones */}
                    <div className="space-y-1">
                        <label className="block text-sm sm:text-base font-medium">Condiciones Médicas Previas</label>
                        <textarea
                            name="patientConditions"
                            value={consulta.patientConditions}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                        />
                    </div>

                    {/* Alergias */}
                    <div className="space-y-1">
                        <label className="block text-sm sm:text-base font-medium">Alergias</label>
                        <textarea
                            name="patientAllergies"
                            value={consulta.patientAllergies}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                        />
                    </div>

                    {/* Medicamentos */}
                    <div className="space-y-1">
                        <label className="block text-sm sm:text-base font-medium">Medicamentos Actuales</label>
                        <textarea
                            name="patientCurrentMeds"
                            value={consulta.patientCurrentMeds}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                        />
                    </div>
                </div>

                {/* Sección Observaciones */}
                <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg sm:text-xl font-semibold">Observaciones y Tratamiento</h2>
                    
                    {/* Observaciones */}
                    <div className="space-y-1">
                        <label className="block text-sm sm:text-base font-medium">Observaciones del Estudiante</label>
                        <textarea
                            name="studentObservation"
                            value={consulta.studentObservation}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                        />
                    </div>

                    {/* Tratamiento sugerido */}
                    <div className="space-y-1">
                        <label className="block text-sm sm:text-base font-medium">Tratamiento Sugerido</label>
                        <textarea
                            name="studentTreatment"
                            value={consulta.studentTreatment}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                        />
                    </div>
                </div>

                {/* Selección de Doctor */}
                <div className="space-y-1">
                    <label className="block text-sm sm:text-base font-medium">Asignar a Doctor</label>
                    <select
                        name="doctorEmail"
                        value={consulta.doctorEmail}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
                        required
                    >
                        <option value="">Seleccionar Doctor</option>
                        {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.email}>
                                {doctor.name} - {doctor.specialty}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Email del Estudiante (oculto o visible según necesidad) */}
                <input
                    type="hidden"
                    name="studentEmail"
                    value={consulta.studentEmail}
                    onChange={handleChange}
                />

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
                    >
                        Enviar Consulta
                    </button>
                </div>
            </form>
        </div>
    );
}