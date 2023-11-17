import React, { useEffect, useState } from "react";
import { useSetupCanvas } from "./useSetupCanvas";
import { glMatrix, mat4, vec3, vec4 } from "gl-matrix";
import obj from "./cube.json";
// import obj from "./pyramid.json";
import cameraTransformations from "./cameraTransformations";
import windowTransformations from "./windowTransformations";
import backfaceCulling from "./backfaceCulling";

const POS = vec3.fromValues(0, 0, 400);
const TARGET = vec3.fromValues(0, 0, 0);
const UP = vec3.fromValues(0, 1, 0);
const FOV = 45;
const NEAR = 0.02;
const FAR = 1000;

const cubeColors = [
  "#9c9c9c",
  "#b3d1db",
  "#459865",
  "#c2d699",
  "#d9b3ff",
  "#ffcc99",
];

function App() {
  const { ref, ctx } = useSetupCanvas();
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      // setRotY((rotY - 5) % 360);
      // setRotX((rotX + 3) % 360);
      // setRotZ((rotZ + 4) % 360);
    }, 100);
    return () => clearTimeout(timer);
  }, [rotX, rotY, rotZ]);

  useEffect(() => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      const windowTransform = windowTransformations(
        ctx.canvas.width,
        ctx.canvas.height
      );
      const { MPER, MPP, homogenize } = cameraTransformations(
        POS,
        TARGET,
        UP,
        FOV,
        NEAR,
        FAR,
        ctx.canvas.width / ctx.canvas.height
      );
      const MVP = mat4.create();
      const MROT = mat4.create();
      const MROTX = mat4.fromXRotation(mat4.create(), glMatrix.toRadian(rotX));
      const MROTY = mat4.fromYRotation(mat4.create(), glMatrix.toRadian(rotY));
      const MROTZ = mat4.fromZRotation(mat4.create(), glMatrix.toRadian(rotZ));
      mat4.mul(MROT, MROT, MROTX);
      mat4.mul(MROT, MROT, MROTY);
      mat4.mul(MROT, MROT, MROTZ);
      const MSCALE = mat4.fromScaling(
        mat4.create(),
        vec3.fromValues(100, 200, 100)
      );

      mat4.mul(MVP, MVP, MPP);
      mat4.mul(MVP, MVP, MPER);
      mat4.mul(MVP, MVP, MSCALE);
      mat4.mul(MVP, MVP, MROT);

      const vertices = obj.vertices.map((v) => {
        const vector = vec4.fromValues(v[0], v[1], v[2], 1);
        vec4.transformMat4(vector, vector, MVP);
        return homogenize(vector);
      });

      obj.faces.filter(backfaceCulling(vertices)).forEach((f, i) => {
        ctx.beginPath();
        ctx.fillStyle = cubeColors[i];
        const [v1, ...rest] = f;
        const result = windowTransform(vertices[v1 - 1]);
        ctx.moveTo(result[0], result[1]);
        rest.forEach((v) => {
          const result = windowTransform(vertices[v - 1]);
          ctx.lineTo(result[0], result[1]);
        });
        ctx.fill();
      });
    }
  }, [ctx, rotX, rotY, rotZ]);

  return <canvas ref={ref} />;
}

export default App;
