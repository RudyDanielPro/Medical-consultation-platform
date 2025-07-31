import { Nav_Var } from "../Components/Nav_Var"
import imgsrc from  '../assets/maletin 1.png'
import { NotificationDoctor } from "../Components/NotificationDoctor"
export function Notificaciones_D() {
    return (
        <>

       <Nav_Var
                imgsrc={imgsrc}
                variante="D"
                />
        
        <NotificationDoctor/>
        </>
    
    )
}