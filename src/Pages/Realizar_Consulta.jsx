import { Nav_Var } from "../Components/Nav_Var"
import imgsrc from  '../assets/maletin 1.png'
import { Make_Inquiries } from "../Components/Make_Inquiries.jsx"
import {Footer} from "../Components/Footer"
export function Realizar_Consulta(){
    return(
        <>
        <Nav_Var
                imgsrc={imgsrc}
                variante="E"
                />
        <Make_Inquiries
        />
    
               </>

            
    )
}