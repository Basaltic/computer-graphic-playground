import { Scene } from '../core/scene';
import { Model } from '../model/model';
import { IMesh } from '../model/mesh';

import obj from '../../../models/cube/cube.obj';
// import obj from '../../../models/bunny/bunny.obj';
import Mesh from '../../../libs/obj-loader/mesh';
import { getState } from '../model/globale-state';

console.log(new Mesh(obj));

/**
 *
 */
export class TestSceneWithModel1 extends Scene {
  meshes: IMesh[] = [];

  init() {
    const model = Model.load(obj, this.renderer);

    this.meshes = model.meshes;

    // console.log(this.meshes);
  }

  update(delta: number): void {
    const state = getState();

    state.translate.tx += 0.1;
    state.translate.tz += 0.1;
  }
}