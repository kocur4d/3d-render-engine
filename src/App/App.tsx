import React, { useEffect } from "react";
import { useSetupCanvas } from "./useSetupCanvas";
import { vec4 } from "gl-matrix";
import obj from "./cube.json";
// import obj from "./hexaprism.json";
import backfaceCulling from "./backfaceCulling";
import useScene from "./useScene";
import drawObject from "./drawObject";
import drawGizmos from "./drawGizmos";

const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 868;

function App() {
  const { ref, ctx } = useSetupCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  const {
    MVP,
    windowTransform,
    homogenize,
    rotateObject,
    adjustCameraPosition,
  } = useScene({
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      rotateObject();
      adjustCameraPosition();
    }, 100);
    return () => clearTimeout(timer);
  }, [adjustCameraPosition, rotateObject]);

  useEffect(() => {
    if (ctx) {
      ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

      const vertices = obj.vertices.map((v) => {
        const vector = vec4.fromValues(v[0], v[1], v[2], 1);
        vec4.transformMat4(vector, vector, MVP);
        return homogenize(vector);
      });

      obj.faces.forEach((f, i) => {
        if (!backfaceCulling(vertices)(f)) return;
        drawObject(ctx, windowTransform, vertices, f, i);
      });

      drawGizmos(ctx, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
  }, [MVP, ctx, homogenize, windowTransform]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <canvas ref={ref} />
    </div>
  );
}

export default App;
