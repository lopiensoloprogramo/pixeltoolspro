import { useRef, useState } from "react";

import "./SuitGenerator.css";

import SuitCanvas, {
  type SuitCanvasRef,
} from "./SuitCanvas";

import suitblack from "../../assets/suits/suit-black.png";
import suitblackwoomen3 from "../../assets/suits/suit-black-woomen3.png";

interface Suit {
  id: string;
  name: string;
  image: string;
}

interface Props {
  image: string;
  onComplete: (image: string) => void;
}

export default function SuitGenerator({
  image,
  onComplete,
}: Props) {

  const canvasRef =
    useRef<SuitCanvasRef>(null);

  const [rotation, setRotation] =
    useState(0);

  const suits: Suit[] = [

    {
      id: "black",
      name: "Ejecutivo Negro",
      image: suitblack,
    },

    {
      id: "blackwoomen",
      name: "Ejecutivo Negro Mujer",
      image: suitblackwoomen3,
    },

  ];

  const [
    selectedSuit,
    setSelectedSuit,
  ] = useState<Suit>(
    suits[0]
  );

  return (

    <section className="suit-generator">

      <h2>
        Elige un traje
      </h2>

      <SuitCanvas
        ref={canvasRef}
        image={image}
        suit={selectedSuit.image}
        rotation={rotation}
      />

      <div className="suit-controls">

        <label>

          Rotación

          <input
            type="range"
            min={-45}
            max={45}
            value={rotation}
            onChange={(e) =>
              setRotation(
                Number(e.target.value)
              )
            }
          />

        </label>

      </div>

      <div className="suit-list">

        {
          suits.map((suit) => (

            <button
              key={suit.id}
              className={
                selectedSuit.id === suit.id
                  ? "suit-card active"
                  : "suit-card"
              }
              onClick={() =>
                setSelectedSuit(suit)
              }
            >

              <img
                src={suit.image}
                alt={suit.name}
              />

              <span>
                {suit.name}
              </span>

            </button>

          ))
        }

      </div>

      <button
        className="primary-button"
        onClick={async()=>{

        const result =
        await canvasRef.current?.exportImage();

        if(result){

        onComplete(result);

        }

        }}
      >
        Aplicar traje
      </button>

    </section>

  );

}