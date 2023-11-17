import { glMatrix, mat4, vec3, vec4 } from "gl-matrix";

const cameraTransformations = (
  pos: vec3,
  target: vec3,
  up: vec3,
  fov: number,
  near: number,
  far: number,
  aspect: number
) => {
  const MPER = mat4.lookAt(mat4.create(), pos, target, up);
  const MPP = mat4.perspectiveNO(
    mat4.create(),
    glMatrix.toRadian(fov),
    aspect,
    near,
    far
  );

  const homogenize = (vec: vec4) =>
    vec3.fromValues(vec[0] / vec[3], vec[1] / vec[3], vec[2] / vec[3]);

  return {
    MPER,
    MPP,
    homogenize,
  };
};

export default cameraTransformations;
