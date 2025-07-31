import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 pt-8 pb-12 bg-[rgb(0,70,27)] px-4">
  <div className="flex flex-col md:flex-row justify-between items-center text-white">
    <p className="text-black-400">© 2025 MedHistory. Todos los derechos reservados.</p>
    <div className="flex space-x-6 mt-4 md:mt-0">
      <Link to="/terminos">
      <p  className="text-primary-900 hover:text-blue-600">Términos</p>
      </Link>

      <Link to="/privacidad">
      <p  className="text-primary-900 hover:text-blue-600">Privacidad</p>
      </Link>

      <Link to="/contacto">
      <p  className="text-primary-900 hover:text-blue-600">Contacto</p>
      </Link>
    </div>
  </div>
</footer>
  );
}
