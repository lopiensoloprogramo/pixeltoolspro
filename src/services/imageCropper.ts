import type {
  AutoCropResult,
} from "./autoCropper";


export function cropImage(

  imageSrc: string,

  crop: AutoCropResult

): Promise<string> {


  return new Promise(

    (resolve, reject) => {


      const image =
        new Image();


      image.onload = () => {


        const canvas =
          document.createElement(
            "canvas"
          );


        /*
        Convertimos valores relativos
        a píxeles reales
        */


        const cropX =
          crop.x * image.width;


        const cropY =
          crop.y * image.height;


        const cropWidth =
          crop.width * image.width;


        const cropHeight =
          crop.height * image.height;



        canvas.width =
          cropWidth;


        canvas.height =
          cropHeight;



        const ctx =
          canvas.getContext(
            "2d"
          );



        if (!ctx) {

          reject(
            "No se pudo crear canvas"
          );

          return;

        }



        ctx.drawImage(

          image,

          cropX,

          cropY,

          cropWidth,

          cropHeight,

          0,

          0,

          cropWidth,

          cropHeight

        );



        resolve(

          canvas.toDataURL(
            "image/jpeg",
            0.95
          )

        );


      };



      image.onerror = () => {

        reject(
          "No se pudo cargar la imagen"
        );

      };



      image.src =
        imageSrc;


    }

  );

}