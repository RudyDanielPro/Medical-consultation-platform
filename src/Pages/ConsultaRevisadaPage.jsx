import { Nav_Var } from "../Components/Nav_Var";
import imgsrc from '../assets/maletin 1.png';
import { ConsultaEstudiante } from "../Components/ConsultaEstudiante";

export function ConsultaRevisadaPage() {
    return (
        <>
            <Nav_Var
                imgsrc={imgsrc}
                variante="E"
            />
            <ConsultaEstudiante />
        </>
    );
}