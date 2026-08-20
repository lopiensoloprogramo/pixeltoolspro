
interface PhotoAnalysisProps {

  image: string;

  message: string;

  valid: boolean;

  faceDetected: boolean;

  faceSizeValid: boolean;

  centered: boolean;

  frontal: boolean;

  onContinue: () => void;

  onNewImage: () => void;

}
import "./PhotoAnalyzer.css"

export default function PhotoAnalysis({

  image,

  message,

  valid,

  faceDetected,

  faceSizeValid,

  centered,

  frontal,

  onContinue,

  onNewImage,

}: PhotoAnalysisProps) {


  return (

    <section className="photo-analysis">

      <div className="analysis-header">

        <h2>

          {valid
            ? "✅ Tu fotografía es adecuada"
            : "⚠️ Revisa tu fotografía"}

        </h2>

        <p>

          {message}

        </p>

      </div>


      <div className="analysis-preview">

        <img

          src={image}

          alt="Fotografía seleccionada"

        />

      </div>


      <div className="analysis-checklist"> Resultado del análisis

        <h3>

          

        </h3>


        <div className="check-item">

          <span>

            {faceDetected ? "✅" : "❌"} Rostro detectado

          </span>

  

        </div>


        <div className="check-item">

          <span>

            {faceSizeValid ? "✅" : "❌"} Tamaño del rostro adecuado

          </span>

        </div>


        <div className="check-item">

          <span>

            {centered ? "✅" : "❌"}  Rostro centrado

          </span>


        </div>


        <div className="check-item">

          <span>

            {frontal ? "✅" : "❌"}   Mirando de frente

          </span>

        </div>

      </div>


      <div className="analysis-actions">

        {valid ? (

          <button

            onClick={onContinue}

            className="primary-button"

          >

            Continuar

          </button>

        ) : (

          <button

            onClick={onNewImage}

            className="primary-button"

          >

            Elegir otra foto

          </button>

        )}

      </div>

    </section>

  );

}