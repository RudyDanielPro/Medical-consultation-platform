import { Nav_Var } from "../Components/Nav_Var";
import imgsrc from '../assets/maletin 1.png';
import { RevisarConsulta } from "../Components/RevisarConsulta";

export function RevisarConsultaPage() {
    return (
        <>
            <Nav_Var
                imgsrc={imgsrc}
                variante="D"
            />
            <RevisarConsulta />
        </>
    );
}