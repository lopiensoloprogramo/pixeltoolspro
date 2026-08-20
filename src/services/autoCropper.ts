export interface Point {

  x: number;

  y: number;

  z?: number;

}


export interface AutoCropResult {

  x: number;

  y: number;

  width: number;

  height: number;

}



export function calculateAutoCrop(

  landmarks: Point[]

): AutoCropResult {


  const xs =
    landmarks.map(
      point => point.x
    );


  const ys =
    landmarks.map(
      point => point.y
    );



  const minX =
    Math.min(...xs);


  const maxX =
    Math.max(...xs);


  const minY =
    Math.min(...ys);


  const maxY =
    Math.max(...ys);



  const faceWidth =
    maxX - minX;


  const faceHeight =
    maxY - minY;



  const centerX =
    (minX + maxX) / 2;



  /*
  ========================================
  FOTO FORMAL
  ========================================

  Más ancho:
  - incluye hombros

  Más alto:
  - cabello
  - cuello
  - parte superior del pecho

  ========================================
  */


  const cropWidth =
    faceWidth * 2.8;


  const cropHeight =
    faceHeight * 4;



  let x =
    centerX - cropWidth / 2;



  /*
  Subimos el recorte:
  dejamos espacio arriba
  */


  let y =
    minY - faceHeight * 0.8;



  /*
  Evitar salir por arriba
  */


  x =
    Math.max(
      0,
      x
    );


  y =
    Math.max(
      0,
      y
    );



  return {


    x,


    y,


    width:
      Math.min(
        cropWidth,
        1 - x
      ),



    height:
      Math.min(
        cropHeight,
        1 - y
      ),


  };


}