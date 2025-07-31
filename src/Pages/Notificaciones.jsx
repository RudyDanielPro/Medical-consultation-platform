import { Nav_Var } from "../Components/Nav_Var"
import imgsrc from  '../assets/maletin 1.png'
import { Notification } from "../Components/Notification"
export function Notificaciones() {
    return (
        <>
        <Nav_Var
                imgsrc={imgsrc}
                variante="E"
                />

        <Notification
        />
        </>
    )
}