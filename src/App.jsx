import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import { Home_Principal } from './Pages/Home_Principal'
import { Crear_Cuenta } from "./Pages/Crear_Cuenta";
import { Iniciar_Secion } from "./Pages/Iniciar_Secion";
import { Home_Doctor } from "./Pages/Home_Doctor";
import { Home_Estudiantes } from "./Pages/Home_Estudiantes";
import { Acerca_de } from "./Pages/Acerca_de";
import { Contacto } from "./Pages/Contacto";
import { Notificaciones } from "./Pages/Notificaciones";
import { Realizar_Consulta } from "./Pages/Realizar_Consulta";
import { Notificaciones_D } from "./Pages/Notificaciones_D";
import { Privacidad } from "./Pages/Privacidad";
import { Terminos } from "./Pages/Terminos";
import { RevisarConsulta } from "./Components/RevisarConsulta";
import { ConsultaRevisadaPage } from "./Pages/ConsultaRevisadaPage";


export function App() {


  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home_Principal />} />
        <Route path="/acerca_de" element={<Acerca_de />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/sign_up" element={<Crear_Cuenta />} />
        <Route path="/sign_in" element={<Iniciar_Secion />} />
        <Route path="/realizar_consulta" element={<Realizar_Consulta />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/notificaciones_d" element={<Notificaciones_D />} />

        <Route path="/home_doctor" element={<Home_Doctor />} />
        <Route path="/home_estudiantes" element={<Home_Estudiantes />} />
      

        <Route path="/terminos" element={<Terminos/>} />
        <Route path="/privacidad" element={<Privacidad/>} />
       
        <Route path="/revisar-consulta" element={<RevisarConsulta/>} />
        <Route path="/consulta-estudiante" element={<ConsultaRevisadaPage/>} />
      </Routes>
    </Router>
  )
}




