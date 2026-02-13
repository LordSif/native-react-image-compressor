import { useState, useRef } from 'react'
import './App.css'
import uploadIcon from './assets/upload-icon.png'
import { compressImage } from './compressImage'

function App() {
  const [originalFile, setOriginalFile] = useState(null)
  const [originalName, setOriginalName] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [originalType, setOriginalType] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [originalDimensions, setOriginalDimensions] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressedName, setCompressedName] = useState(null);
  const [compressedDimensions, setCompressedDimensions] = useState(null)
  const [reduction, setReduction] = useState(null)
  const [savings, setSavings] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null)

  // Handle File
  const handleFile = (img) => {
    const file = img;
    setError(null);
    setLoading(true);
    setOriginalSize(null);
    setOriginalUrl(null);
    setCompressedUrl(null);
    setCompressedName(null)
    setCompressedDimensions(null)
    setCompressedSize(null);
    setSavings(null)
    setReduction(null)

    if (!file) {
      setLoading(false);
      return;
    }

    try {
      setOriginalFile(file)
      setOriginalUrl(URL.createObjectURL(file));
      setOriginalName(file.name);
      setOriginalSize(formatFileSize(file.size));
      setOriginalType(file.type.split('/')[1].toUpperCase());
      const originalImg = new Image();
      originalImg.src = URL.createObjectURL(file);
      originalImg.onload = () => {
        setOriginalDimensions(`${originalImg.width} × ${originalImg.height}px`);
      };


    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false);
    }
  }

  const handleReset = () => {
    setOriginalFile(null)
    setOriginalName(null);
    setOriginalUrl(null);
    setOriginalType(null);
    setOriginalSize(null);
    setOriginalDimensions(null);
    setCompressedSize(null);
    setCompressedUrl(null);
    setCompressedName(null);
    setCompressedDimensions(null);
    setReduction(null);
    setSavings(null);
    setError(null);
    fileInputRef.current.value = ""
  };

  // Handle compress image
  const handleCompressImage = async () => {
    if (!originalFile) return
    setLoading(true)
    setError(null)

    try {
      const compressedFileReady = await compressImage(originalFile, 1280, 0.6);
      setCompressedUrl(URL.createObjectURL(compressedFileReady));
      setCompressedName(compressedFileReady.name);
      setCompressedSize(formatFileSize(compressedFileReady.size));
      setCompressedDimensions(`${compressedFileReady.dimensions.width} x ${compressedFileReady.dimensions.height}px`)
      setReduction(((originalFile.size - compressedFileReady.size) / originalFile.size * 100).toFixed(1))
      setSavings(formatFileSize(originalFile.size - compressedFileReady.size))

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle download image
  const handleDownloadImage = () => {
    if (compressedUrl && compressedName) {
      const link = document.createElement("a")
      link.href = compressedUrl
      link.download = compressedName
      link.click()
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Handle click on upload area
  const handleAreaClick = () => {
    fileInputRef.current?.click();
  }

  // Handle file selection from input
  const handleFileSelect = (event) => {
    const img = event.target.files[0];
    handleFile(img);
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
      handleFile(img[0]);
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
            ref={fileInputRef}
          />
        </div>

        {/* Progress bar */}
        <div className='progress-container '>
          <div className='progress-bar'>
            <div className='progress-fill'></div>
          </div>
          <div className='progress-text'>0%</div>
        </div>

        {/* Preview container */}
        <div className={`preview-container ${originalUrl ? 'show' : ''}`}>
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
                <div className='info-item'><strong>Dimensiones:</strong> {compressedDimensions}</div>
                <div className='info-item'><strong>Reducción:</strong> {reduction}% más pequeño</div>
                <div className='comparison'><strong>Ahorras:</strong> {savings}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className='controls'>
          <button className='btn btn-primary' id='compressBtn' onClick={handleCompressImage} disabled={!originalFile}>Comprimir Imagen</button>
          <button className='btn btn-success' id='downloadBtn' onClick={handleDownloadImage} disabled={!compressedUrl}>Descargar Comprimida</button>
          <button className='btn btn-secondary' id='resetBtn' onClick={handleReset}>Nueva Imagen</button>
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
