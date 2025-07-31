import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
  const [loginData, setLoginData] = useState({
    identifier: '', // Puede ser email o username
    password: ''
  });

  const [errors, setErrors] = useState({
    identifier: '',
    password: '',
    general: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
        general: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      identifier: !loginData.identifier ? 'Ingresa tu usuario o correo' : '',
      password: !loginData.password ? 'Ingresa tu contraseña' : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ identifier: '', password: '', general: '' });

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Consulta a db.json
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();

      // Buscar usuario por email o username
      const user = users.find(u => 
        u.email === loginData.identifier || 
        u.username === loginData.identifier
      );

      if (!user) {
        setErrors(prev => ({
          ...prev,
          general: 'Usuario o correo no encontrado'
        }));
        return;
      }

      // Verificar contraseña
      if (user.password !== loginData.password) {
        setErrors(prev => ({
          ...prev,
          password: 'Contraseña incorrecta'
        }));
        return;
      }

      // Redirección según tipo de usuario con email en la URL
      if (user.userType === 'estudiante') {
        navigate(`/home_estudiantes?email=${encodeURIComponent(user.email)}`);
      } else if (user.userType === 'doctor') {
        navigate(`/home_doctor?email=${encodeURIComponent(user.email)}`);
      } else {
        setErrors(prev => ({
          ...prev,
          general: 'Tipo de usuario no reconocido'
        }));
      }

    } catch (error) {
      console.error('Error:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Error al conectar con el servidor'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {errors.general}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico o Usuario
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={loginData.identifier}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.identifier ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="tu@email.com o tuusuario"
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-500">{errors.identifier}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}