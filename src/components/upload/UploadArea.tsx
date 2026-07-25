import "./UploadArea.css";
import { UploadCloud } from "lucide-react";

interface Props{
    onSelect:(file:File)=>void;
}

export default function UploadArea({onSelect}:Props){

    function handleChange(e:React.ChangeEvent<HTMLInputElement>){

        const file=e.target.files?.[0];

        if(!file) return;

        onSelect(file);

    }

    return(

        <label className="upload-area">

            <input
            hidden
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleChange}
            />

            <UploadCloud
                size={70}
                strokeWidth={1.5}
            />

            <h2>

                Arrastra tu imagen

            </h2>

            <p>

                o haz clic aquí para seleccionarla

            </p>

            <span>

                JPG • PNG • WEBP

            </span>

        </label>

    )

}