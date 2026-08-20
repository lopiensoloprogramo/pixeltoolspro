import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import Moveable from "react-moveable";

import "./SuitCanvas.css";

export interface SuitCanvasRef {
  exportImage: () => Promise<string>;
}

interface Props {
  image: string;
  suit: string;
  rotation: number;
}

interface SuitState {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

const SuitCanvas = forwardRef<SuitCanvasRef, Props>(
  (
    {
      image,
      suit,
      rotation,
    },
    ref
  ) => {

    const editorRef =
      useRef<HTMLDivElement>(null);

    const photoRef =
      useRef<HTMLImageElement>(null);

    const targetRef =
      useRef<HTMLDivElement>(null);

    const suitRef =
      useRef<HTMLImageElement>(null);

    const state =
      useRef<SuitState>({
        x: 150,
        y: 120,
        width: 280,
        height: 360,
        rotation,
      });

    useEffect(() => {

      state.current.rotation =
        rotation;

      if (!targetRef.current)
        return;

      applyTransform();

    }, [rotation]);

    const applyTransform = () => {

      if (!targetRef.current)
        return;

      const s =
        state.current;

      targetRef.current.style.width =
        `${s.width}px`;

      targetRef.current.style.height =
        `${s.height}px`;

      targetRef.current.style.transform =
        `translate(${s.x}px, ${s.y}px) rotate(${s.rotation}deg)`;
    };

    useEffect(() => {

      applyTransform();

    }, []);

    useImperativeHandle(
      ref,
      () => ({

        async exportImage() {

          const photo =
            photoRef.current;

          const suitImg =
            suitRef.current;

          if (
            !photo ||
            !suitImg
          ) {
            return "";
          }

          await Promise.all([
            photo.decode?.().catch(() => {}),
            suitImg.decode?.().catch(() => {}),
          ]);

          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width =
            photo.naturalWidth;

          canvas.height =
            photo.naturalHeight;

          const ctx =
            canvas.getContext("2d");

          if (!ctx)
            return "";

          ctx.drawImage(
            photo,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const scaleX =
            canvas.width /
            photo.clientWidth;

          const scaleY =
            canvas.height /
            photo.clientHeight;

          const s =
            state.current;

          const x =
            s.x * scaleX;

          const y =
            s.y * scaleY;

          const w =
            s.width * scaleX;

          const h =
            s.height * scaleY;

          ctx.save();

          ctx.translate(
            x + w / 2,
            y + h / 2
          );

          ctx.rotate(
            (s.rotation *
              Math.PI) /
              180
          );

          ctx.drawImage(
            suitImg,
            -w / 2,
            -h / 2,
            w,
            h
          );

          ctx.restore();

          return canvas.toDataURL(
            "image/png"
          );
        },

      })
    );
        return (

      <div
        ref={editorRef}
        className="editor"
      >

        <img
          ref={photoRef}
          src={image}
          className="photo"
          draggable={false}
          alt=""
        />

        <div
          ref={targetRef}
          className="suit-container"
        >

          <img
            ref={suitRef}
            src={suit}
            className="suit"
            draggable={false}
            alt=""
          />

        </div>

        <Moveable
          target={targetRef}
          draggable
          resizable
          rotatable
          keepRatio={false}
          origin={false}
          edge={false}
          renderDirections={[
            "nw",
            "n",
            "ne",
            "w",
            "e",
            "sw",
            "s",
            "se",
          ]}

          onDrag={({ beforeTranslate, target }) => {

            state.current.x =
              beforeTranslate[0];

            state.current.y =
              beforeTranslate[1];

            target.style.transform =
              `translate(${state.current.x}px, ${state.current.y}px) rotate(${state.current.rotation}deg)`;

          }}

         onResize={({
            width,
            height,
            drag,
            target,
            }) => {

            const previousWidth =
                state.current.width;

            state.current.width =
                Math.max(40, width);

            state.current.height =
                Math.max(40, height);

            const dx =
                (state.current.width - previousWidth) / 2;

            state.current.x =
                drag.beforeTranslate[0] - dx;

            state.current.y =
                drag.beforeTranslate[1];

            target.style.width =
                `${state.current.width}px`;

            target.style.height =
                `${state.current.height}px`;

            target.style.transform =
                `translate(${state.current.x}px, ${state.current.y}px) rotate(${state.current.rotation}deg)`;

            }}

          onRotate={({
            beforeRotate,
            drag,
            target,
          }) => {

            state.current.rotation =
              beforeRotate;

            state.current.x =
              drag.beforeTranslate[0];

            state.current.y =
              drag.beforeTranslate[1];

            target.style.transform =
              `translate(${state.current.x}px, ${state.current.y}px) rotate(${state.current.rotation}deg)`;

          }}

        />

      </div>

    );

  }
);

SuitCanvas.displayName =
  "SuitCanvas";

export default SuitCanvas;