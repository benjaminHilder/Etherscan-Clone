import "../css/nav.css"
import { Link } from "react-router-dom"
import logo from "../Eth Logo spinning.gif"

export const Navbar = () => {
    return (
        <div>
            <img src={logo} style={{height: "10vh", width: "15vh", position: "absolute", left: "15vh"}} />
            <h2 style={{position: "absolute", left: "30vh", top: "2vh"}}>Ethersearch</h2>
            <Link to="/" className="NavButton">Home</Link>



        </div>
    )
}