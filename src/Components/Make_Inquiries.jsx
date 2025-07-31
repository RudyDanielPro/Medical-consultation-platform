import { useState } from 'react';

// Datos iniciales del formulario
const initialFormData = {
    studentName: '',
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
    studentTreatment: '',
    doctorDiagnosisCorrection: '',
    doctorGrade: '',
    doctorComments: ''
};

export function Make_Inquiries() {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({
        studentEmail: '',
        doctorEmail: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateEmail = async (email, type) => {
        if (!email) {
            setErrors(prev => ({
                ...prev,
                [`${type}Email`]: 'Este campo es requerido'
            }));
            return false;
        }

        try {
            const response = await fetch('http://localhost:3001/users');

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const users = await response.json();

            if (!Array.isArray(users)) throw new Error('La respuesta no es un array válido');

            const user = users.find(u => u.email === email);

            if (!user) {
                setErrors(prev => ({
                    ...prev,
                    [`${type}Email`]: `${type === 'student' ? 'Estudiante' : 'Médico'} no encontrado`
                }));
                return false;
            }

            if (type === 'doctor' && user.userType !== 'doctor') {
                setErrors(prev => ({
                    ...prev,
                    doctorEmail: 'El email no pertenece a un médico'
                }));
                return false;
            }

            if (type === 'student' && user.userType !== 'estudiante') {
                setErrors(prev => ({
                    ...prev,
                    studentEmail: 'El email no pertenece a un estudiante'
                }));
                return false;
            }

            setErrors(prev => ({
                ...prev,
                [`${type}Email`]: ''
            }));
            return true;
        } catch (error) {
            console.error('Error validando email:', error);
            setErrors(prev => ({
                ...prev,
                [`${type}Email`]: 'Error al validar el usuario. Intente nuevamente.'
            }));
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validar emails
        const isStudentValid = await validateEmail(formData.studentEmail, 'student');
        const isDoctorValid = await validateEmail(formData.doctorEmail, 'doctor');

        if (!isStudentValid || !isDoctorValid) {
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. Obtener datos del estudiante
            const studentResponse = await fetch(`http://localhost:3001/users?email=${formData.studentEmail}`);
            if (!studentResponse.ok) throw new Error('Error al obtener datos del estudiante');

            const students = await studentResponse.json();
            const student = students[0];

            // 2. Crear objeto de consulta
            const inquiryData = {
                ...formData,
                studentUsername: student.username,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // 3. Enviar la consulta
            const inquiryResponse = await fetch('http://localhost:3001/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inquiryData)
            });

            if (!inquiryResponse.ok) throw new Error('Error al guardar la consulta');

            const createdInquiry = await inquiryResponse.json();

            // 4. Crear notificación para el médico
            const notificationData = {
                type: 'nueva_consulta',
                title: 'Nueva consulta médica',
                message: `Tienes una nueva consulta de ${student.username}`,
                formData: {
                    estudiante: student.username,
                    paciente: formData.patientName,
                    sintomas: formData.patientSymptoms.substring(0, 50) + '...',
                    consultaId: createdInquiry.id
                },
                doctorEmail: formData.doctorEmail,
                read: false,
                createdAt: new Date().toISOString(),
                time: new Date().toLocaleString()
            };

            // 5. Enviar notificación
            const notificationResponse = await fetch('http://localhost:3001/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notificationData)
            });

            if (!notificationResponse.ok) throw new Error('Error al crear notificación');

            alert('Consulta y notificación enviadas exitosamente');

            // Resetear el formulario
            setFormData(initialFormData);
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-gray-50 min-h-screen p-6 w-full">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Formulario de Consulta Médica</h1>

            <form className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-md" onSubmit={handleSubmit}>
                {/* Sección del Estudiante */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">Datos del Estudiante</h2>

                    <div className="flex flex-col md:flex-row md:space-x-8">
                        <div className="flex-1 flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellidos*</label>
                            <input
                                type="text"
                                name="studentName"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={formData.studentName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email del Estudiante*</label>
                            <input
                                type="email"
                                name="studentEmail"
                                className={`w-full px-4 py-2 border ${errors.studentEmail ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                                value={formData.studentEmail}
                                onChange={handleChange}
                                onBlur={() => validateEmail(formData.studentEmail, 'student')}
                                required
                            />
                            {errors.studentEmail && <p className="text-red-500 text-sm mt-1">{errors.studentEmail}</p>}
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email del Doctor*</label>
                            <input
                                type="email"
                                name="doctorEmail"
                                className={`w-full px-4 py-2 border ${errors.doctorEmail ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                                value={formData.doctorEmail}
                                onChange={handleChange}
                                onBlur={() => validateEmail(formData.doctorEmail, 'doctor')}
                                required
                            />
                            {errors.doctorEmail && <p className="text-red-500 text-sm mt-1">{errors.doctorEmail}</p>}
                        </div>
                    </div>
                </div>

                {/* Sección del Paciente */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">Datos del Paciente</h2>

                    <div className="flex flex-col md:flex-row md:space-x-8">
                        {/* Columna Izquierda */}
                        <div className="flex-1 space-y-4 mb-6 md:mb-0">
                            <div className="flex space-x-4">
                                <div className="flex-1 flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
                                    <input
                                        type="text"
                                        name="patientName"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.patientName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad*</label>
                                    <input
                                        type="text"
                                        name="patientCi"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.patientCi}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <div className="flex-1 flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad*</label>
                                    <input
                                        type="number"
                                        name="patientAge"
                                        min="0"
                                        max="120"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.patientAge}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexo*</label>
                                    <select
                                        name="patientSex"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.patientSex}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="male">Masculino</option>
                                        <option value="female">Femenino</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)*</label>
                                <input
                                    type="number"
                                    name="patientWeight"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.patientWeight}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono*</label>
                                <input
                                    type="tel"
                                    name="patientPhone"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.patientPhone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Síntomas Principales*</label>
                                <textarea
                                    rows="3"
                                    name="patientSymptoms"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Describa los síntomas, duración y severidad"
                                    value={formData.patientSymptoms}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Padecimientos Conocidos</label>
                                <textarea
                                    rows="2"
                                    name="patientConditions"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enfermedades crónicas, condiciones previas"
                                    value={formData.patientConditions}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alergias</label>
                                <textarea
                                    rows="2"
                                    name="patientAllergies"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Medicamentos, alimentos, otras alergias"
                                    value={formData.patientAllergies}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección Médica del Estudiante */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">Evaluación del Estudiante</h2>

                    <div className="flex flex-col md:flex-row md:space-x-8">
                        {/* Columna Izquierda */}
                        <div className="flex-1 space-y-4 mb-6 md:mb-0">
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medicamentos Actuales</label>
                                <textarea
                                    rows="2"
                                    name="patientCurrentMeds"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nombre de los medicamentos que toma actualmente"
                                    value={formData.patientCurrentMeds}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observación Preliminar*</label>
                                <textarea
                                    rows="3"
                                    name="studentObservation"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Observaciones y hallazgos preliminares"
                                    value={formData.studentObservation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento Propuesto*</label>
                                <textarea
                                    rows="3"
                                    name="studentTreatment"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Tratamiento que recomienda el estudiante"
                                    value={formData.studentTreatment}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de Evaluación Médica */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">Evaluación del Médico</h2>

                    <div className="flex flex-col md:flex-row md:space-x-8">
                        {/* Columna Izquierda */}
                        <div className="flex-1 space-y-4 mb-6 md:mb-0">
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Corrección del Diagnóstico</label>
                                <textarea
                                    rows="3"
                                    name="doctorDiagnosisCorrection"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                                    placeholder="Esta sección será completada por el médico"
                                    value={formData.doctorDiagnosisCorrection}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Nota (2-5)</label>
                                <select
                                    name="doctorGrade"
                                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                                    value={formData.doctorGrade}
                                    onChange={handleChange}
                                    disabled
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="2">2 - Deficiente</option>
                                    <option value="3">3 - Aceptable</option>
                                    <option value="4">4 - Bueno</option>
                                    <option value="5">5 - Excelente</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Comentarios del Médico</label>
                                <textarea
                                    rows="3"
                                    name="doctorComments"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                                    placeholder="Esta sección será completada por el médico"
                                    value={formData.doctorComments}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="mt-8 flex justify-center space-x-6">
                    <button
                        type="submit"
                        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Consulta'}
                    </button>

                    <button
                        type="button"
                        className="px-8 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </section>
    );
}