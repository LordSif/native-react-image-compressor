import { useState } from 'react'
import './App.css'
import uploadIcon from './assets/upload-icon.png'
import { compressImage } from './compressImage'

function App() {
  const [originalName, setOriginalName] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [originalType, setOriginalType] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [originalDimensions, setOriginalDimensions] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
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
      // Original image data
      setOriginalUrl(URL.createObjectURL(file));
      setOriginalName(file.name);
      setOriginalSize(formatFileSize(file.size));
      setOriginalType(file.type.split('/')[1].toUpperCase());
      const originalImg = new Image();
      originalImg.src = URL.createObjectURL(file);
      originalImg.onload = () => {
        setOriginalDimensions(`${originalImg.width} × ${originalImg.height}px`);
      };

      const compressedFileReady = await compressImage(file, 1280, 0.6);

      // Compressed image data
      setCompressedUrl(URL.createObjectURL(compressedFileReady));
      setNombre(compressedFileReady.name);
      setCompressedSize(formatFileSize(compressedFileReady.size));

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false);
    }

  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Handle click on upload area
  const handleAreaClick = () => {
    imageInput.click();
  }

  // Handle file selection from input
  const handleFileSelect = (event) => {
    const img = event.target.files[0];
    handleFileChange(img);
  }

  // Handle drag and drop events
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
    const img = e.dataTransfer.files;
    if (img.length > 0) {
      handleFileChange(img[0]);
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
          <h2 >Arrastra y suelta tu imagen aqui</h2>
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
            {originalUrl && (
              <img
                src={originalUrl}
                alt="Imagen Original"
                className='preview-img'
              />
            )}
            <div className='info-box'>
              <div className='info-item'><strong>Tamaño:</strong> {originalSize}</div>
              <div className='info-item'><strong>Dimensiones:</strong> {originalDimensions}</div>
              <div className='info-item'><strong>Tipo:</strong> {originalType}</div>
            </div>
          </div>

          <div className='preview-box'>
            <h3>Imagen Comprimida</h3>
            {compressedUrl && (
              <img
                src={compressedUrl}
                alt="Imagen Comprimida"
                className='preview-img'
              />
            )}
            <div className='compressedPreview'>
              <div className='info-box'>
                <div className='info-item'><strong>Tamaño:</strong> {compressedSize}</div>
                <div className='info-item'><strong>Dimensiones:</strong> { }</div>
                <div className='info-item'><strong>Reducción:</strong> { }%</div>
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
