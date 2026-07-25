import "./EditorToolbar.css";

interface Props {
  mode: "erase" | "restore" | null;
  zoom: number;

  onErase: () => void;
  onRestore: () => void;

  onUndo: () => void;
  onRedo: () => void;

  onZoomIn: () => void;
  onZoomOut: () => void;

  onDownload: () => void;
  onNewImage: () => void;
}

export default function EditorToolbar({
  mode,
  zoom,

  onErase,
  onRestore,

  onUndo,
  onRedo,

  onZoomIn,
  onZoomOut,

  onDownload,
  onNewImage,
}: Props) {

  return (

    <div className="editor-toolbar">

      {/* ========================================
          HISTORIAL
      ======================================== */}

      <div className="toolbar-group">

        <button
        type="button"
        className="toolbar-button history-button"
        onClick={onUndo}
        title="Deshacer"
        >
        <span className="history-icon">
            ↶
        </span>

        <span>
            Deshacer
        </span>
        </button>


        <button
        type="button"
        className="toolbar-button history-button"
        onClick={onRedo}
        title="Rehacer"
        >
        <span className="history-icon">
            ↷
        </span>

        <span>
            Rehacer
        </span>
</button>

      </div>


      {/* ========================================
          HERRAMIENTAS
      ======================================== */}

      <div className="toolbar-group">

        <button
          type="button"
          className={
            `toolbar-button ${
              mode === "restore"
                ? "active"
                : ""
            }`
          }
          onClick={onRestore}
          title="Restaurar partes de la imagen"
        >
          🖌️
          <span>
            Restaurar
          </span>
        </button>


        <button
          type="button"
          className={
            `toolbar-button ${
              mode === "erase"
                ? "active"
                : ""
            }`
          }
          onClick={onErase}
          title="Borrar partes de la imagen"
        >
          🧽
          <span>
            Borrar
          </span>
        </button>

      </div>


      {/* ========================================
          ZOOM
      ======================================== */}

      <div className="toolbar-group zoom-controls">

        <button
          type="button"
          className="toolbar-button zoom-button"
          onClick={onZoomOut}
          title="Alejar"
        >
          −
        </button>


        <span className="zoom-value">
          {zoom}%
        </span>


        <button
          type="button"
          className="toolbar-button zoom-button"
          onClick={onZoomIn}
          title="Acercar"
        >
          +
        </button>

      </div>


      {/* ========================================
          ACCIONES
      ======================================== */}

      <div className="toolbar-group">

        <button
          type="button"
          className="toolbar-button download-button"
          onClick={onDownload}
          title="Descargar imagen"
        >
          ⬇
          <span>
            Descargar
          </span>
        </button>


        <button
          type="button"
          className="toolbar-button new-image-button"
          onClick={onNewImage}
          title="Editar otra imagen"
        >
          🆕
          <span>
            Nueva imagen
          </span>
        </button>

      </div>

    </div>

  );

}