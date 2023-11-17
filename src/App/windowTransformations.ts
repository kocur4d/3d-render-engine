import { mat3, vec3 } from "gl-matrix";

const windowTransformations = (width: number, height: number) => {
  const MWIND = mat3.fromValues(width, 0, 0, 0, -height, 0, width, height, 0);
  mat3.multiplyScalar(MWIND, MWIND, 0.5);

  return (vertex: vec3) => vec3.transformMat3(vec3.create(), vertex, MWIND);
};

export default windowTransformations;
