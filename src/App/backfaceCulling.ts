import { vec3 } from "gl-matrix";

const backfaceCulling = (vertices: vec3[]) => (f: number[]) => {
  const e1 = vec3.subtract(
    vec3.create(),
    vertices[f[1] - 1],
    vertices[f[0] - 1]
  );
  const e2 = vec3.subtract(
    vec3.create(),
    vertices[f[2] - 1],
    vertices[f[1] - 1]
  );
  const cross = vec3.cross(vec3.create(), e1, e2);
  return cross[2] > 0;
};

export default backfaceCulling;
