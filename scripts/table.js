// Aquest codi ens ajuda a mostrar informació de les imatges de manera dinàmica i calcular reduccions

const images = Array.from(document.querySelectorAll("img"));
const infoContainers = Array.from(document.querySelectorAll(".image-info"));
const tableBody = document.querySelector("table tbody");

// Funció per calcular el percentatge de reducció
function calculateReduction(initialSize, finalSize) {
  if (!initialSize || !finalSize) return "n/a";
  const reduction = ((initialSize - finalSize) / initialSize) * 100;
  return `${reduction.toFixed(1)}%`;
}

// Funció per obtenir informació de la imatge
async function getImageInfo(url, alt) {
  return new Promise(async (resolve, reject) => {
    const img = new Image();
    img.src = url;

    img.onload = async () => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const format = url.split(".").pop();
        const dimensions = {
          width: img.width,
          height: img.height,
        };
        const size = blob.size;

        resolve({ format, dimensions, alt, size });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = reject;
  });
}

// Funció per mostrar la informació i calcular reduccions
async function displayImageInfoAndTable() {
  const imageInfos = await Promise.all(
    images.map((img) => getImageInfo(img.src, img.alt))
  );

  // Iterem sobre la informació recollida
  imageInfos.forEach((info, index) => {
    const sizeInKB = (info.size / 1024).toFixed(2);

    // Mostrem informació al contenedor
    const container = infoContainers[index];
    const sizeElement = document.createElement("p");
    sizeElement.textContent = `Size: ${sizeInKB} KB`;
    container.appendChild(sizeElement);

    // Generem fila per a la taula
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = info.alt; // Assume alt is the name of the image
    row.appendChild(nameCell);

    const originalSizeCell = document.createElement("td");
    originalSizeCell.textContent = `${sizeInKB} KB`;
    row.appendChild(originalSizeCell);

    const jpgSize = index % 2 === 0 ? info.size * 0.5 : null; // Exemple de mida JPG
    const webpSize = index % 2 === 0 ? info.size * 0.3 : info.size * 0.7; // Exemple de mida WebP

    const jpgCell = document.createElement("td");
    if (jpgSize) {
      jpgCell.textContent = `${(jpgSize / 1024).toFixed(2)} KB (${calculateReduction(
        info.size / 1024,
        jpgSize / 1024
      )})`;
    } else {
      jpgCell.textContent = "n/a";
    }
    row.appendChild(jpgCell);

    const webpCell = document.createElement("td");
    webpCell.textContent = `${(webpSize / 1024).toFixed(2)} KB (${calculateReduction(
      info.size / 1024,
      webpSize / 1024
    )})`;
    row.appendChild(webpCell);

    tableBody.appendChild(row);
  });
}

displayImageInfoAndTable();
