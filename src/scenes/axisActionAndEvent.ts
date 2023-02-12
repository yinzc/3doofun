import { ArcRotateCamera, Scene, Vector3, Engine, HemisphericLight, Mesh, CreateSphere, CreateGround } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class AxisActionAndEvent implements CreateSceneClass {
    createScene =async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        const scene = new Scene(engine);

        const arcRotateCamera = new ArcRotateCamera("ArcRotateCamera", Math.PI/2, Math.PI/4, 10, new Vector3(0, 0, 0), scene);
        arcRotateCamera.setPosition(new Vector3(10, 10, -100));
        arcRotateCamera.attachControl(canvas, true);


        const hemisphericLight = new HemisphericLight("HemisphericLight", new Vector3(0, 1, 0), scene);
        const sphere = CreateSphere("sphere", { segments: 16, diameter: 0.8 }, scene);
        sphere.position.y = 1;
        
        const sphere2 = CreateSphere("sphere2", { segments: 16, diameter: 1 }, scene);

        const sphere3 = CreateSphere("sphere3", { segments: 16, diameter: 1.2}, scene);
        sphere3.position.z = 1;

        const ground = CreateGround("ground", { width: 7, height: 6, subdivisions: 2 }, scene);
        ground.rotation.x = - Math.PI / 2;
        
        return scene; 
        
    };
}

export default new AxisActionAndEvent();
