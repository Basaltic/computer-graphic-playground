import { Vector3 } from '../../../../libs/math/vector3';
import { RGBColor } from '../../../../libs/utils/color';
import { randomNum } from '../../../../libs/utils/number';
import { HittableList } from './hittable-list';
import { Dielectric, Lambertian, Material, Metal } from './material';
import { Sphere } from './sphere';

export class World extends HittableList {}

/**
 * 生成随机的场景
 */
export function randomWorld(): World {
  const world = new World();

  const groundMat = new Lambertian(new RGBColor(0.5, 0.5, 0.5));
  const groundSph = new Sphere(new Vector3(0, -1000, 0), 1000, groundMat);
  world.add(groundSph);

  for (let a = -11; a < 11; a += 1) {
    for (let b = -11; b < 11; b += 1) {
      const chooseMat = randomNum();
      const center = new Vector3(a + 0.9 * randomNum(), 0.2, b + 0.9 * randomNum());

      const limitRadius = center.subtract(new Vector3(4, 0.2, 0)).getMagnitude();
      if (limitRadius > 0.9) {
        if (chooseMat < 0.8) {
          // 漫反射材质 diffuse
          const albedo = RGBColor.random().multiply(RGBColor.random()) as RGBColor;

          const mat = new Lambertian(albedo);
          const sphere = new Sphere(center, 0.2, mat);
          world.add(sphere);
        } else if (chooseMat < 0.95) {
          // 金属材质 metal
          const albedo = RGBColor.random(0.5, 1) as RGBColor;
          const fuzz = randomNum(0, 0.5);
          const mat = new Metal(albedo, fuzz);
          const sphere = new Sphere(center, 0.2, mat);
          world.add(sphere);
        } else {
          // 玻璃材质 glass
          const mat = new Dielectric(1.5);
          const sphere = new Sphere(center, 0.2, mat);
          world.add(sphere);
        }
      }
    }
  }

  const mat1 = new Dielectric(1.5);
  const sph1 = new Sphere(new Vector3(0, 1, 0), 1, mat1);

  const mat2 = new Lambertian(new RGBColor(0.4, 0.2, 0, 1));
  const sph2 = new Sphere(new Vector3(-4, 1, 0), 1, mat2);

  const mat3 = new Metal(new RGBColor(0.7, 0.6, 0.5), 0);
  const sph3 = new Sphere(new Vector3(4, 1, 0), 1, mat3);

  world.add(sph2);
  world.add(sph1);
  world.add(sph3);

  return world;
}
