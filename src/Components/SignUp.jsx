import { useState } from 'react';

export function SignUp() {
  // Estados del formulario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    medicalCode: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: ''
  });

  const [serverError, setServerError] = useState('');

  // Manejador de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validaciones
  const validateUsername = (username) => {
    const regex = /^[a-z]+$/;
    if (!username) return 'El usuario es requerido';
    if (!regex.test(username)) return 'Solo letras minúsculas (a-z)';
    return '';
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@estudiantes\.uci\.cu$/;
    if (!email) return 'El email es requerido';
    if (!regex.test(email)) return 'Debe terminar en @estudiantes.uci.cu';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 8) return 'Mínimo 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'Debe tener al menos 1 mayúscula';
    if (!/[0-9]/.test(password)) return 'Debe tener al menos 1 número';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Debe tener al menos 1 caracter especial';
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return '';
  };

  const validateUserType = (userType) => {
    if (!userType) return 'Debes seleccionar un tipo de usuario';
    return '';
  };

  // Validación principal
  const validateForm = () => {
    const newErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
      userType: validateUserType(formData.userType)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Envío al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    try {
      // 1. Verificar si el email ya existe
      const emailCheck = await fetch(`http://localhost:3001/users?email=${formData.email}`);
      const existingUsers = await emailCheck.json();
      
      if (existingUsers.length > 0) {
        setErrors(prev => ({ ...prev, email: 'Este email ya está registrado' }));
        return;
      }

      // 2. Registrar nuevo usuario
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password, // ¡En producción usarías bcrypt!
          userType: formData.userType,
          medicalCode: formData.userType === 'doctor' ? formData.medicalCode : null,
          createdAt: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Error en el servidor');

      // 3. Limpiar formulario después del registro
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: '',
        medicalCode: ''
      });

      alert('¡Registro exitoso! Puedes iniciar sesión');

    } catch (error) {
      console.error('Error:', error);
      setServerError('Error al registrar. Intenta nuevamente.');
    }
  };

  return (
    <section className='bg-gray-50 min-h-screen flex items-center justify-center p-4'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-xl w-full max-w-md'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-8'>Registro</h2>

        {serverError && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md'>
            {serverError}
          </div>
        )}

        {/* Campo de Usuario */}
        <div className='mb-6'>
          <label htmlFor="username" className='block text-gray-700 font-medium mb-2'>Usuario</label>
          <input 
            type="text" 
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        {/* Campo de Email */}
        <div className='mb-6'>
          <label htmlFor="email" className='block text-gray-700 font-medium mb-2'>Email</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="ejemplo@estudiantes.uci.cu"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

         {/* Campo de Contraseña */}
        <div className='mb-6'>
          <label htmlFor="password" className='block text-gray-700 font-medium mb-2'>Contraseña</label>
          <input 
            type="password" 
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Campo de Confirmar Contraseña */}
        <div className='mb-6'>
          <label htmlFor="confirmPassword" className='block text-gray-700 font-medium mb-2'>Confirmar Contraseña</label>
          <input 
            type="password" 
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Campo de Tipo de Usuario */}
        <div className='mb-6'>
          <label htmlFor="userType" className='block text-gray-700 font-medium mb-2'>Tipo de usuario</label>
          <select 
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.userType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="">Seleccione...</option>
            <option value="estudiante">Estudiante</option>
            <option value="doctor">Doctor</option>
          </select>
          {errors.userType && <p className="text-red-500 text-sm mt-1">{errors.userType}</p>}
        </div>

        {/* Campo condicional para código médico */}
        {formData.userType === 'doctor' && (
          <div className='mb-6'>
            <label htmlFor="medicalCode" className='block text-gray-700 font-medium mb-2'>Código Médico</label>
            <input 
              type="text" 
              id="medicalCode"
              name="medicalCode"
              value={formData.medicalCode}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {/* No hay validación para este campo según requisitos */}
          </div>
        )}

        <button 
          type="submit"
          className='w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-4'
        >
          Registrar
        </button>
      </form>
    </section>
  );
}
       

  