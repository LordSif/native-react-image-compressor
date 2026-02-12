/**
 * Comprime una imagen a un tamaño y calidad específicos.
 * @param {File} imageFile El archivo de imagen original.
 * @param {number} MAX_DIMENSION Dimensión máxima deseada (ancho o alto, el mayor).
 * @param {number} quality Calidad JPEG (0.0 a 1.0, ej: 0.6 para alta compresión).
 * @returns {Promise<Blob>} Un objeto Blob con la imagen comprimida.
 */

export const compressImage = (
  imageFile,
  MAX_DIMENSION = 1280,
  quality = 0.6
) => {
  return new Promise((resolve, reject) => {
    if (!imageFile.type.startsWith("image/")) {
      reject(new Error("EL archivo no es una imagen válida."));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        let scale = 1;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          scale = MAX_DIMENSION / Math.max(width, height);
        }

        width = Math.floor(width * scale);
        height = Math.floor(height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (compressedBlob) => {
            if (compressedBlob) {
              // Extraer el nombre base del archivo original
              const originalName = imageFile.name;
              const parts = originalName.split('.');
              parts.length > 1 ? parts.pop() : 'jpg';
              const baseName = parts.join('.') || 'image';

              const compressedFile = new File(
                [compressedBlob],
                `compressed_${baseName}.jpg`,
                {
                  type: compressedBlob.type,
                  lastModified: Date.now()
                }
              )
              compressedFile.dimensions = { width, height }
              resolve(compressedFile);
            } else {
              reject(new Error("Error al generar el Blob comprimido."));
            }
          },
          "image/jpeg",
          quality
        )
      }
      img.onerror = () => reject(new Error("Error al cargar la imagen."));
      img.src = event.target.result;
    }
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(imageFile);
  })
}