import { DEG_TO_RAD } from '../../../libs/math/const';
import { Matrix4 } from '../../../libs/math/matrix4';
import { Vector3 } from '../../../libs/math/vector3';

/**
 * Limit value in a range [min, max]
 *
 * @param v
 * @param min
 * @param max
 * @returns
 */
export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/**
 * 获取模型矩阵 - 也就是变换矩阵
 */
export const getModelMatrix = (
  rotate?: { zRotationAngle?: number; yRotationAngle?: number; xRotationAngle?: number },
  translate?: { tx?: number; ty?: number; tz?: number },
  scale?: { sx?: number; sy?: number; sz?: number }
) => {
  const { zRotationAngle = 0, yRotationAngle = 0, xRotationAngle = 0 } = rotate || {};
  const { tx = 0, ty = 0, tz = 0 } = translate || {};
  const { sx = 0, sy = 0, sz = 0 } = scale || {};

  const identity = Matrix4.identity();

  const z_rad_angle = zRotationAngle * DEG_TO_RAD;
  const z_cos_value = Math.cos(z_rad_angle);
  const z_sin_value = Math.sin(z_rad_angle);
  const rotateByZMatrix = Matrix4.from2DArray([
    [z_cos_value, -z_sin_value, 0, 0],
    [z_sin_value, z_cos_value, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]);

  const y_rad_angle = yRotationAngle * DEG_TO_RAD;
  const y_cos_value = Math.cos(y_rad_angle);
  const y_sin_value = Math.sin(y_rad_angle);
  const rotateByYMatrix = Matrix4.from2DArray([
    [y_cos_value, 0, y_sin_value, 0],
    [0, 1, 0, 0],
    [-y_sin_value, 0, y_cos_value, 0],
    [0, 0, 0, 1]
  ]);

  const x_rad_angle = xRotationAngle * DEG_TO_RAD;
  const x_cos_value = Math.cos(x_rad_angle);
  const x_sin_value = Math.sin(x_rad_angle);
  const rotateByXMatrix = Matrix4.from2DArray([
    [1, 0, 0, 0],
    [0, x_cos_value, -x_sin_value, 0],
    [0, x_sin_value, x_cos_value, 0],
    [0, 0, 0, 1]
  ]);

  const rotateMatrix = rotateByXMatrix.multiply(rotateByYMatrix).multiply(rotateByZMatrix);

  const translateMatrix = Matrix4.from2DArray([
    [1, 0, 0, tx],
    [0, 1, 0, ty],
    [0, 0, 1, tz],
    [0, 0, 0, 1]
  ]);

  const scaleMatrix = Matrix4.from2DArray([
    [sx, 0, 0, 0],
    [0, sy, 0, 0],
    [0, 0, sz, 0],
    [0, 0, 0, 1]
  ]);

  return identity.multiply(translateMatrix).multiply(rotateMatrix).multiply(scaleMatrix);
};

/**
 * 根据摄像机（观察）所在的位置，生成一个平移矩阵，移动到（0，0，0）的位置
 * @param eyePos
 */
export const getViewMatrix = (eyePos: Vector3) => {
  const viewTranslateMatrix = Matrix4.from2DArray([
    [1, 0, 0, -eyePos.x],
    [0, 1, 0, -eyePos.y],
    [0, 0, 1, -eyePos.z],
    [0, 0, 0, 1]
  ]);
  return viewTranslateMatrix;
};

/**
 * 获取投影矩阵
 *
 * @param eyeFov 摄像机的视野角度
 * @param aspectRatio 宽长比
 * @param zNear 近平面距离（）
 * @param zFar 远平面距离
 */
export const getProjectionMatrix = (eyeFov: number, aspectRatio: number, zNear: number, zFar: number) => {
  const identity = Matrix4.identity();

  const radian_fov = eyeFov * DEG_TO_RAD;
  const tan_fov = Math.tan(radian_fov / 2);

  const top = tan_fov * Math.abs(zNear);
  const right = aspectRatio * top;

  const right_to_left = right * 2;
  const top_to_bottom = top * 2;
  const near_to_far = zNear - zFar;

  // 这里默认 摄像机 在z轴上，那么不需要 x & y 轴的平移了
  // 正交矩阵
  const o1 = Matrix4.from2DArray([
    [2 / right_to_left, 0, 0, 0],
    [0, 2 / top_to_bottom, 0, 0],
    [0, 0, 2 / near_to_far, 0],
    [0, 0, 0, 1]
  ]);
  const o2 = Matrix4.from2DArray([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, -(zNear + zFar) / 2],
    [0, 0, 0, 1]
  ]);
  const ortho = o1.multiply(o2);

  // 透视转为正交的矩阵
  const persp_to_ortho = Matrix4.from2DArray([
    [zNear, 0, 0, 0],
    [0, zNear, 0, 0],
    [0, 0, zNear + zFar, -zNear * zFar],
    [0, 0, 1, 0]
  ]);

  const proj = ortho.multiply(persp_to_ortho).multiply(identity);
  return proj;
};
