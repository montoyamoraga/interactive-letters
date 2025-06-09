export const handler = ({ inputs, mechanic, sketch }) => {
  let video;
  const canvasWidth = 1080;
  const canvasHeight = 1920;
  const gridSize = 16;
  let letterImages = {};
  const lettersToLoad = ['x', 's', 'm', 'o', 'u', 'k'];

  sketch.preload = () => {
    lettersToLoad.forEach(letter => {
      letterImages[letter] = sketch.loadImage(`static/letter_${letter}.png`);
    });
  };

  sketch.setup = () => {
    sketch.createCanvas(canvasWidth, canvasHeight);
    sketch.pixelDensity(1);
    sketch.background(0);
    sketch.imageMode(sketch.CENTER);

    // Captura video horizontal para asegurar buena calidad al recortar
    video = sketch.createCapture(sketch.VIDEO, () => {
      video.size(1280, 720);
      video.hide();
    });
  };

  sketch.draw = () => {
    sketch.background(0);

    sketch.push();
    // Rota el canvas 90° horario para vertical
    sketch.translate(canvasWidth, 0);
    sketch.rotate(sketch.HALF_PI);

    if (video && video.width > 0) {
      video.loadPixels();

      // Dimensiones reales del video
      const camW = video.width;
      const camH = video.height;

      // Calcula la escala para crop to fill
      // (Por rotación: camW llena canvasHeight, camH llena canvasWidth)
      const scale = Math.max(canvasHeight / camW, canvasWidth / camH);

      // Tamaño del área del video que se usará para cubrir el canvas
      const cropW = canvasHeight / scale;
      const cropH = canvasWidth / scale;

      // Offset para centrar la imagen recortada
      const offsetX = (camW - cropW) / 2;
      const offsetY = (camH - cropH) / 2;

      // Ahora, recorre TODO el canvas (no solo el área del video)
      for (let y = 0; y < canvasHeight; y += gridSize) {
        for (let x = 0; x < canvasWidth; x += gridSize) {
          // Centro de la celda en canvas
          const cx = x + gridSize / 2;
          const cy = y + gridSize / 2;

          // Mapear cx/cy al espacio del video recortado y rotado:
          // cx (horizontal en canvas) → vertical en video (camH)
          // cy (vertical en canvas) → horizontal en video (camW)
          const videoX = offsetX + (cy / canvasHeight) * cropW;
          const videoY = offsetY + (cx / canvasWidth) * cropH;

          // Redondea y limita para no salirte del video
          const px = Math.floor(sketch.constrain(videoX, 0, camW - 1));
          const py = Math.floor(sketch.constrain(videoY, 0, camH - 1));

          const index = (px + py * camW) * 4;
          const brightness = (video.pixels[index] + video.pixels[index + 1] + video.pixels[index + 2]) / 3;
          let currentLetter = '';

          if (brightness < 43) {
            currentLetter = 'x';
          } else if (brightness < 86) {
            currentLetter = 's';
          } else if (brightness < 129) {
            currentLetter = 'm';
          } else if (brightness < 172) {
            currentLetter = 'o';
          } else if (brightness < 215) {
            currentLetter = 'u';
          } else {
            currentLetter = 'k';
          }

          if (letterImages[currentLetter]) {
            sketch.image(
              letterImages[currentLetter],
              cy,
              cx,
              gridSize,
              gridSize * (letterImages[currentLetter].height / letterImages[currentLetter].width)
            );
          }
        }
      }
    }

    sketch.pop();
  };
};

export const inputs = {};

export const settings = {
  engine: require("@mechanic-design/engine-p5"),
  modules: {},
};