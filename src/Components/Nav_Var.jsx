import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

export function Nav_Var({ imgsrc, variante }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Función para obtener el email de la URL
  const getEmailFromURL = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('email');
  };

  // Función para generar links manteniendo el email
  const createLink = (path) => {
    const email = getEmailFromURL();
    return email ? `${path}?email=${encodeURIComponent(email)}` : path;
  };

  // Obtener y mostrar el nombre de usuario
  useEffect(() => {
    const fetchUserData = async () => {
      const email = getEmailFromURL();

      if (email) {
        try {
          const response = await fetch(`http://localhost:3001/users?email=${email}`);

          if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
          }

          const users = await response.json();

          if (users.length > 0) {
            setUsername(users[0].username);
          } else {
            console.log("Usuario no encontrado");
            setUsername("");
          }
        } catch (error) {
          console.error("Error al cargar el usuario:", error);
          setUsername("");
        } finally {
          setLoading(false);
        }
      } else {
        setUsername("");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [location.search]);

  const handleLogout = () => {
    // Limpiar parámetros de la URL
    window.history.replaceState({}, document.title, window.location.pathname);
    setUsername("");
    // Redirigir a la página de autenticación
    navigate('/sign_in');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderNavLinks = () => {
    if (variante === "E") {
      return (
        <>
          <Link to={createLink("/home_estudiantes")} className="hover:text-blue-300 py-2 px-4" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
          <Link to={createLink("/realizar_consulta")} className="hover:text-blue-300 py-2 px-4" onClick={() => setMobileMenuOpen(false)}>Realizar consulta</Link>
          <Link to={createLink("/notificaciones")} className="hover:text-blue-300 py-2 px-4" onClick={() => setMobileMenuOpen(false)}>Notificaciones</Link>
        </>
      );
    } else if (variante === "D") {
      return (
        <>
          <Link to={createLink("/home_doctor")} className="hover:text-blue-300 py-2 px-4" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
          <Link to={createLink("/notificaciones_d")} className="hover:text-blue-300 py-2 px-4" onClick={() => setMobileMenuOpen(false)}>Notificaciones</Link>
        </>
      );
    } else {
      return (
        <>
          <div className="flex items-center justify-center flex-1">
            <Link to="/" className="hover:text-blue-300 py-2 px-4" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
            <Link to="/acerca_de" className="hover:text-blue-300 py-2 px-4" onClick={() => setMobileMenuOpen(false)}>Acerca de</Link>
            <Link to="/contacto" className="hover:text-blue-300 py-2 px-4" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
          </div>
          <div className="flex items-center">
            <Link to="/sign_up" className="hover:text-blue-300 py-2 px-4" onClick={() => setMobileMenuOpen(false)}>Registrarse</Link>
            <Link to="/sign_in" className="hover:text-blue-300 py-2 px-4" onClick={() => setMobileMenuOpen(false)}>Iniciar sesión</Link>
          </div>
        </>
      );
    }
  };

  return (
    <>
      {variante === "E" ? (
        <nav className="flex flex-col md:flex-row justify-between items-center text-xl text-white bg-[rgb(0,70,27)] h-auto md:h-14 sticky top-0 z-50 px-4">
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link to={createLink("/home_estudiantes")} className="flex items-center">
              <img src={imgsrc} alt="icono de la app" className="rounded-full object-cover h-8 w-8 mr-2" />
              <h1 className="hover:text-blue-300">MedHistory</h1>
            </Link>
            <button className="md:hidden text-white p-2" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          
          <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center gap-2 md:gap-6 w-full md:w-auto`}>
            {renderNavLinks()}
            <div className="relative my-2 md:my-0" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-blue-300 py-2 px-4"
                onClick={() => setShowLogout(!showLogout)}
              >
                <FaUserCircle className="text-2xl" />
                {loading ? (
                  <span className="text-xl">Cargando...</span>
                ) : (
                  <span className="text-xl">{username || 'Invitado'}</span>
                )}
              </div>

              {showLogout && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      ) : variante === "D" ? (
        <nav className="flex flex-col md:flex-row justify-between items-center text-xl text-white bg-[rgb(0,70,27)] h-auto md:h-14 sticky top-0 z-50 px-4">
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link to={createLink("/home_doctor")} className="flex items-center">
              <img src={imgsrc} alt="icono de la app" className="rounded-full object-cover h-8 w-8 mr-2" />
              <h1 className="hover:text-blue-300">MedHistory</h1>
            </Link>
            <button className="md:hidden text-white p-2" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          
          <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center gap-2 md:gap-6 w-full md:w-auto`}>
            {renderNavLinks()}
            <div className="relative my-2 md:my-0" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-blue-300 py-2 px-4"
                onClick={() => setShowLogout(!showLogout)}
              >
                <FaUserCircle className="text-2xl" />
                {loading ? (
                  <span className="text-xl">Cargando...</span>
                ) : (
                  <span className="text-xl">{username || 'Invitado'}</span>
                )}
              </div>

              {showLogout && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      ) : (
        <nav className="flex flex-col md:flex-row justify-between items-center text-xl text-white bg-[rgb(0,70,27)] h-auto md:h-14 sticky top-0 z-50 px-4">
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link to="/" className="flex items-center">
              <img src={imgsrc} alt="icono de la app" className="rounded-full object-cover h-8 w-8 mr-2" />
              <h1 className="hover:text-blue-300">MedHistory</h1>
            </Link>
            <button className="md:hidden text-white p-2" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          
          <div className={`${mobileMenuOpen ? 'flex flex-col' : 'hidden'} md:flex md:flex-row items-center justify-between w-full md:w-auto`}>
            {renderNavLinks()}
          </div>
        </nav>
      )}
    </>
  );
}