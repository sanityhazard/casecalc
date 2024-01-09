import { useNavigate } from "react-router-dom";

function BigButton({ func }) {
    const navigate = useNavigate()

    return ( 
        <button className="button__big" onClick={() => navigate('/edit/')}>{ func }</button>
     );
}

export default BigButton;