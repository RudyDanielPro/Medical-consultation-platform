import { Nav_Var } from "../Components/Nav_Var"
import { SignIn } from "../Components/Signin"
import imgsrc from '../assets/maletin 1.png'

export function Iniciar_Secion() {
    return (
        <section>
            <Nav_Var
                imgsrc={imgsrc}
                className="shadow-md bg-white"
                variante="B"
            />

            <SignIn />
        </section>
    )
}