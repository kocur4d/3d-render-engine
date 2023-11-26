import { vec3 } from "gl-matrix";

const cubeColors = [
  "#9c9c9c",
  "#b3d1db",
  "#459865",
  "#c2d699",
  "#d9b3ff",
  "#ffcc99",
];

const drawObject = (
  ctx: CanvasRenderingContext2D,
  windowTransform: (vertices: vec3) => vec3,
  vertices: vec3[],
  face: number[],
  faceIdx: number
) => {
  ctx.beginPath();
  ctx.fillStyle = cubeColors[faceIdx % 6];
  const [v1, ...rest] = face;
  const result = windowTransform(vertices[v1 - 1]);
  ctx.moveTo(result[0], result[1]);
  rest.forEach((v) => {
    const result = windowTransform(vertices[v - 1]);
    ctx.lineTo(result[0], result[1]);
  });
  ctx.fill();
};

export default drawObject;
