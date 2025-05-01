export const handler = ({ inputs, mechanic, sketch }) => {
  let video;
  const canvasWidth = 1600;
  const canvasHeight = 1200;
  const gridSize = 16; // Tamaño de la cuadrícula
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

    video = sketch.createCapture(sketch.VIDEO, () => {
      console.log("Cámara iniciada. Dimensiones:", video.width, video.height);
      video.size(canvasWidth / gridSize, canvasHeight / gridSize);
      video.hide();
    });
  };

  sketch.draw = () => {
    sketch.background(0);

    sketch.push();
    sketch.translate(canvasWidth, 0);
    sketch.scale(-1, 1);

    if (video && video.width > 0) {
      video.loadPixels();
      for (let y = 0; y < video.height; y++) {
        for (let x = 0; x < video.width; x++) {
          const index = (x + y * video.width) * 4;
          const brightness = (video.pixels[index] + video.pixels[index + 1] + video.pixels[index + 2]) / 3;
          let currentLetter = '';

          // rangos de brillo para 6 letras
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
              x * gridSize + gridSize / 2,
              y * gridSize + gridSize / 2,
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