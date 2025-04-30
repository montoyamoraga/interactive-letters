export const handler = ({ inputs, mechanic, sketch }) => {
  // Importar Matter.js
  const Matter = require('matter-js');
  const Engine = Matter.Engine;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Body = Matter.Body;
  const Mouse = Matter.Mouse;
  const MouseConstraint = Matter.MouseConstraint;

  let imagenesLetras = {};
  let letrasCuerpos = [];
  let engine;
  let world;
  let mConstraint;
  let video;
  const letraScale = 0.08; // Tamaño de las letras
  let canvasWidth = 1280; // Establecer ancho del canvas
  let canvasHeight = 960; // Establecer alto del canvas

  const centralPoint = { x: canvasWidth / 2, y: canvasHeight / 2 };
  const initialRadius = 200; // Ajustar radio inicial al nuevo tamaño del canvas
  const orbitalSpeed = 0.0001; // Velocidad de órbita reducida (a la mitad)
  const attractionForceMagnitude = 0.00001;
  const tangentialDriftMagnitude = 0.000001;

  sketch.preload = () => {
    for (let i = 0; i < 26; i++) {
      const letra = String.fromCharCode(97 + i);
      imagenesLetras[letra] = sketch.loadImage(`static/letter_${letra}.png`);
    }
  };

  sketch.setup = () => {
    sketch.createCanvas(canvasWidth, canvasHeight);
    sketch.imageMode(sketch.CENTER);

    video = sketch.createCapture(sketch.VIDEO, () => {
      // Callback cuando la transmisión de video está lista
      if (video) {
        console.log("Dimensiones de la cámara:", video.width, video.height);
      } else {
        console.error("Error al iniciar la cámara.");
      }
    });
    video.size(canvasWidth, canvasHeight); // Ajustar el tamaño del video al canvas
    video.hide(); // Ocultar el elemento de video HTML

    engine = Engine.create();
    world = engine.world;

    const numLetters = Object.keys(imagenesLetras).length;
    for (let i = 0; i < numLetters; i++) {
      const caracter = Object.keys(imagenesLetras)[i];
      const img = imagenesLetras[caracter];
      const angle = sketch.map(i, 0, numLetters, 0, sketch.TWO_PI);
      const x = centralPoint.x + initialRadius * sketch.cos(angle);
      const y = centralPoint.y + initialRadius * sketch.sin(angle);
      const randomRotation = sketch.random(-sketch.PI / 12, sketch.PI / 12); // Rango reducido
      const nuevoCuerpo = Bodies.rectangle(x, y, img.width * letraScale, img.height * letraScale, {
        frictionAir: 0.05,
        restitution: 0.3,
        angle: randomRotation,
        label: caracter
      });
      letrasCuerpos.push({ cuerpo: nuevoCuerpo, img: img });
      World.add(world, nuevoCuerpo);
    }

    const canvasMouse = Mouse.create(sketch.canvas.elt);
    canvasMouse.pixelRatio = sketch.pixelDensity();
    mConstraint = MouseConstraint.create(engine, {
      mouse: canvasMouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    World.add(world, mConstraint);

    const bordeGrosor = 50;
    const ground = Bodies.rectangle(canvasWidth / 2, canvasHeight + bordeGrosor / 2, canvasWidth, bordeGrosor, { isStatic: true });
    const ceiling = Bodies.rectangle(canvasWidth / 2, -bordeGrosor / 2, canvasWidth, bordeGrosor, { isStatic: true });
    const leftWall = Bodies.rectangle(-bordeGrosor / 2, canvasHeight / 2, bordeGrosor, canvasHeight, { isStatic: true });
    const rightWall = Bodies.rectangle(canvasWidth + bordeGrosor / 2, canvasHeight / 2, bordeGrosor, canvasHeight, { isStatic: true });
    World.add(world, [ground, ceiling, leftWall, rightWall]);
  };

  sketch.draw = () => {
    sketch.background(0); // Fondo negro

    if (video && video.width > 0 && video.height > 0) {
      sketch.push();
      sketch.translate(canvasWidth, 0);
      sketch.scale(-1, 1);
      sketch.image(video, canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight);
      sketch.pop();
    }

    for (const letraObj of letrasCuerpos) {
      const deltaX = letraObj.cuerpo.position.x - centralPoint.x;
      const deltaY = letraObj.cuerpo.position.y - centralPoint.y;

      const attractionForce = {
        x: -deltaX * attractionForceMagnitude,
        y: -deltaY * attractionForceMagnitude
      };
      Matter.Body.applyForce(letraObj.cuerpo, { x: letraObj.cuerpo.position.x, y: letraObj.cuerpo.position.y }, attractionForce);

      const orbitalForce = {
        x: -deltaY * orbitalSpeed,
        y: deltaX * orbitalSpeed
      };
      Matter.Body.applyForce(letraObj.cuerpo, { x: letraObj.cuerpo.position.x, y: letraObj.cuerpo.position.y }, orbitalForce);

      const angleToCenter = sketch.atan2(deltaY, deltaX);
      const tangentialDriftForceAngle = angleToCenter + sketch.HALF_PI * sketch.random([-1, 1]);
      const tangentialDriftForce = {
        x: sketch.cos(tangentialDriftForceAngle) * tangentialDriftMagnitude * sketch.random(-1, 1),
        y: sketch.sin(tangentialDriftForceAngle) * tangentialDriftMagnitude * sketch.random(-1, 1)
      };
      Matter.Body.applyForce(letraObj.cuerpo, { x: letraObj.cuerpo.position.x, y: letraObj.cuerpo.position.y }, tangentialDriftForce);
    }

    if (engine) {
      Engine.update(engine);
    }

    for (const letraObj of letrasCuerpos) {
      const pos = letraObj.cuerpo.position;
      const angle = letraObj.cuerpo.angle;
      sketch.push();
      sketch.translate(pos.x, pos.y);
      sketch.rotate(angle);
      sketch.image(letraObj.img, 0, 0, letraObj.img.width * letraScale, letraObj.img.height * letraScale);
      sketch.pop();
    }
  };

  // Eliminar la función windowResized ya que el tamaño del canvas ahora es fijo

  sketch.mousePressed = () => {
    let letraTocada = null;
    for (const letraObj of letrasCuerpos) {
      const pos = letraObj.cuerpo.position;
      const img = letraObj.img;
      const escala = letraScale;
      const ancho = img.width * escala;
      const alto = img.height * escala;

      if (sketch.mouseX > pos.x - ancho / 2 &&
          sketch.mouseX < pos.x + ancho / 2 &&
          sketch.mouseY > pos.y - alto / 2 &&
          sketch.mouseY < pos.y + alto / 2) {
        letraTocada = letraObj.cuerpo;
        if (mConstraint && mConstraint.mouse) {
          mConstraint.mouse.element = sketch.canvas.elt;
          mConstraint.body = letraTocada;
          Matter.Mouse.setOffset(mConstraint.mouse, { x: sketch.mouseX - pos.x, y: sketch.mouseY - pos.y });
        }
        break;
      }
    }
  };

  sketch.mouseDragged = () => {
    if (mConstraint && mConstraint.body) {
      Matter.Body.setPosition(mConstraint.body, { x: sketch.mouseX, y: sketch.mouseY });
    }
  };

  sketch.mouseReleased = () => {
    if (mConstraint && mConstraint.mouse) {
      mConstraint.body = null;
      mConstraint.mouse.element = null;
    }
  };
};

export const inputs = {};

export const settings = {
  engine: require("@mechanic-design/engine-p5"),
  modules: {
    matter: require('matter-js')
  }
};