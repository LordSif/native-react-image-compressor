import { useState } from 'react'
import './App.css'
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

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
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

  return (
    <div className='container'>
      <div className='header'>
        <h1>Compresor de Imagenes - Canvas Blob</h1>
        <p>Reduce el tamaño de tus imagenes</p>
      </div>

      <div className='content'>
        <div className='upload-area'>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          {loading && <p style={{ color: "blue" }}>Comprimiendo imagen...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
        <div className='progress-container'>

        </div>
        <div className='preview-container'>
          <div className='preview-box'>

            <h3>Original</h3>
            <p>Tamaño: **{originalSize} MB**</p>
            {originalUrl && (
              <img
                src={originalUrl}
                alt="Imagen Original"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  border: "1px solid black",
                }}
              />
            )}
          </div>
          <div className='preview-box'>

            <h3>Comprimida</h3>
            <p>Tamaño:<strong style={{ color: "green" }}>{compressedSize}KB</strong></p>
            {compressedUrl && (
              <>
                <img
                  src={compressedUrl}
                  alt="Imagen Comprimida"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    border: "1px solid black",
                  }}
                />
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
              </>)}
          </div>


        </div>
        <div className='controls'>

        </div>

        <div className='setting'>

        </div>
      </div>
    </div>
  )
}

export default App
