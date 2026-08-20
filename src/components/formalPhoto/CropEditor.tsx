import type {
  AutoCropResult,
} from "../../services/autoCropper";


interface Props {

  image: string;

  crop: AutoCropResult;

  onBack: () => void;

  onComplete: (
    image: string
  ) => void;

  
}

import {
  cropImage,
} from "../../services/imageCropper";


export default function CropEditor({

  image,

  crop,

  onBack,

  onComplete,

}: Props) {


  return (

    <section className="crop-editor">


      <h2>

        ✂️ Ajuste del recorte

      </h2>



          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >


        <img

          src={image}

          alt="Fotografía"

          style={{

            width: "100%",

            display: "block",

          }}

        />



        <div

          style={{

            position: "absolute",

            border: "2px solid #2563eb",

            left: `${crop.x * 100}%`,

            top: `${crop.y * 100}%`,

            width: `${crop.width * 100}%`,

            height: `${crop.height * 100}%`,

          }}

        />


      </div>



      <p>

        Zona detectada automáticamente

      </p>



            <button

    className="secondary-button"

    onClick={onBack}

  >

    Volver

  </button>


<button

className="primary-button"

onClick={async () => {


 const cropped =
   await cropImage(
     image,
     crop
   );


 onComplete(
   cropped
 );


}}

>
Usar este recorte
</button>



    </section>

  );

}