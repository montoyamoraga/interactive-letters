export const handler = ({ inputs, mechanic, sketch }) => {
  sketch.setup = () => {
    sketch.createCanvas(1080, 1920);
  };

  sketch.draw = () => {
    sketch.background(220);
  };
};

export const inputs = {};

export const settings = {
  engine: require("@mechanic-design/engine-p5"),
};