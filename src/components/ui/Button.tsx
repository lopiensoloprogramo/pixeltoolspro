import "./Button.css";

interface Props{

    children:React.ReactNode;

    onClick?:()=>void;

}

export default function Button({children,onClick}:Props){

    return(

        <button
        className="button"
        onClick={onClick}
        >

            {children}

        </button>

    )

}