import { Nav_Var } from "../Components/Nav_Var"
import { SignUp } from "../Components/SignUp"
import imgsrc from '../assets/maletin 1.png'

export function Crear_Cuenta() {
  return (
    <section>

      <Nav_Var
        imgsrc={imgsrc}
        className="shadow-md bg-white"
        variante="B"
      />

      <SignUp />

    </section>
  )
}