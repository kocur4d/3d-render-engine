import { useState } from "react";
import { glMatrix, mat4, vec3 } from "gl-matrix";
import cameraTransformations from "./cameraTransformations";
import windowTransformations from "./windowTransformations";

export const INITIAL_DISTANCE = 460;
const TARGET = vec3.fromValues(0, 0, 0);
const UP = vec3.fromValues(0, 1, 0);
const FOV = 30;
const NEAR = 0.02;
const FAR = 1000;

const ROTATION_RATE = -1;

interface Props {
  screenWidth: number;
  screenHeight: number;
}

const useScene = ({ screenHeight, screenWidth }: Props) => {
  const [rotY, setRotY] = useState(0);

  const [cameraPos, setCameraPos] = useState(
    vec3.fromValues(0, 0, INITIAL_DISTANCE)
  );

  const windowTransform = windowTransformations(screenWidth, screenHeight);
  const { MPER, MPP, homogenize } = cameraTransformations(
    cameraPos,
    TARGET,
    UP,
    FOV,
    NEAR,
    FAR,
    screenWidth / screenHeight
  );
  const MVP = mat4.create();
  const MROT = mat4.create();
  const MROTY = mat4.fromYRotation(mat4.create(), glMatrix.toRadian(rotY));
  mat4.mul(MROT, MROT, MROTY);
  const MSCALE = mat4.fromScaling(
    mat4.create(),
    vec3.fromValues(100, 200, 100)
  );

  mat4.mul(MVP, MVP, MPP);
  mat4.mul(MVP, MVP, MPER);
  mat4.mul(MVP, MVP, MSCALE);
  mat4.mul(MVP, MVP, MROT);

  const adjustCameraPosition = () => {
    const angle = glMatrix.toRadian(Math.abs((rotY * 2) % 180));
    const alength = 2 * Math.acos(Math.sqrt(2) / 2);
    const aRatio = alength / Math.PI;
    const dist =
      50 *
      Math.sqrt(2) *
      (Math.sin(Math.PI / 4 + angle * aRatio) - Math.sin(Math.PI / 4));
    console.log({ dist, l: Math.sin(angle), angle });
    setCameraPos((prev) =>
      vec3.fromValues(prev[0], prev[1], INITIAL_DISTANCE + dist)
    );
  };

  const rotateObject = () => {
    const nRot = (rotY + ROTATION_RATE) % 360;
    setRotY(nRot);
  };

  return {
    MVP,
    windowTransform,
    homogenize,
    adjustCameraPosition,
    rotateObject,
  };
};

export default useScene;
