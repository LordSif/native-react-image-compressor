import { useState } from 'react'
import './App.css'
import uploadIcon from './assets/upload-icon.png'
import { compressImage } from './compressImage'

function App() {
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [originalName, setOriginalName] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  
  const handleFileChange = async (img) => {
    const file = img;
    console.log("Archivo seleccionado:", file);
    setError(null);
    setLoading(true);
    setOriginalSize(null);
    setCompressedSize(null);
    setOriginalUrl(null);
    setCompressedUrl(null);

    if (!file) {
      setLoading(false);
      return;
    }

    try {
      // Datos de la imagen original
      setOriginalUrl(URL.createObjectURL(file));
      setOriginalName(file.name);
      setOriginalSize((file.size / 1024 / 1024).toFixed(2));

      const compressedFileReady = await compressImage(file, 1280, 0.6);
      // Datos de la imagen comprimida
      setNombre(compressedFileReady.name);
      setCompressedSize((compressedFileReady.size / 1024 / 1024).toFixed(2));
      setCompressedUrl(URL.createObjectURL(compressedFileReady));

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false);
    }
  }

  const handleAreaClick = () => {
    imageInput.click();
  }

  const handleFileSelect = (event) => {
    const img = event.target.files[0];
    handleFileChange(img);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  }
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  }

  return (
    <div className='container'>
      <div className='header'>
        <h1>Compresor de Imagenes - Canvas Blob</h1>
        <p>Reduce el tamaño de tus imagenes</p>
      </div>

      <div className='content'>
        {/* Upload area */}
        <div
        className={`upload-area ${isDragging ? 'dragover' : ''}`}
        onClick={handleAreaClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        >
          <img src={uploadIcon} alt="Subir Imagen" className='upload-icon' />
          <h2 >Arrastra y suelta tu iamgen aqui</h2>
          <p>o haz click para seleccionar una imagen</p>
          <p style={{ color: "#888", fontSize: "0.9em" }}>Formatos soportados: JPG, PNG, WebP, GIF</p>
          <input
            type="file"
            accept="image/*"
            id='imageInput'
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>

        {/* Progress bar */}
        <div className='progress-container'>
          <div className='progress-bar'>
            <div className='progress-fill'></div>
          </div>
          <div className='progress-text'>0%</div>
        </div>

        {/* Preview container */}
        <div className='preview-container'>
          <div className='preview-box'>
            <h3>Imagen Original</h3>
            <p>Tamaño: **{originalSize} MB**</p>
            {originalUrl && (
              <img
                src={originalUrl}
                alt="Imagen Original"
                className='preview-img'
              />
            )}
            <div className='info-box'>
              <div className='info-item'>Tamaño:</div>
              <div className='info-item'>Dimensiones:</div>
              <div className='info-item'>Tipo:</div>
            </div>
          </div>

          <div className='preview-box'>
            <h3>Imagen Comprimida</h3>
            <p>Tamaño:<strong style={{ color: "green" }}>{compressedSize}KB</strong></p>
            {compressedUrl && (
              <img
                src={compressedUrl}
                alt="Imagen Comprimida"
                className='preview-img'
              />
            )}
            <div className='compressedPreview'>
              <div className='info-box'>
                <div className='info-item'>Tamaño</div>
                <div className='info-item'>Dimensiones:</div>
                <div className='info-item'>Reduccion:</div>
                <div className='comparison'></div>
              </div>
            </div>
            <h3>Descargar</h3>
            <a
              href={compressedUrl}
              download={nombre}
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "8px 12px",
                backgroundColor: "#4CAF50",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              Descargar Imagen Comprimida
            </a>
          </div>
        </div>

        {/* Controls */}
        <div className='controls'>
          <button className='btn btn-primary' id='compressBtn'>Comprimir Imagen</button>
          <button className='btn btn-success' id='downloadBtn'>Descargar Comprimida</button>
          <button className='btn btn-secondary' id='resetBtn'>Nueva Imagen</button>
        </div>

        {/* Settings */}
        <div className='settings'>
          <h4>Configuracion de Compresion</h4>
          <div className="settings-grid">
            <div className='setting-item'>
              <label htmlFor="quality">Calidad (0.1 - 1.0):</label>

            </div>
            <div className='setting-item'>
              <label htmlFor="maxWidth">Ancho maximo (px):</label>

            </div>
            <div className='setting-item'>
              <label htmlFor="maxHeight">Altura Maxima (px):</label>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default App
