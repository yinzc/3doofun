import { ArcRotateCamera, CreateBox, CreatePlane, CreateRibbon, CreateSphere, Engine, HemisphericLight, Scene, Vector3 } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class BaseActionAndEvent implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        const scene = new Scene(engine);
        const arcRotateCamera = new ArcRotateCamera("ArcRotateCamera", Math.PI/2, Math.PI/4, 10, new Vector3(0, 0, 0), scene);
        arcRotateCamera.setPosition(new Vector3(10, 10, -100));
        arcRotateCamera.attachControl(canvas, true);

        const hemisphericLight = new HemisphericLight("HemisphericLight", new Vector3(0, 1, 0), scene);

        //const box = CreateBox("box", { width: 2, depth: 1, size: 3}, scene);
        //const sphere = CreateSphere("sphere", { diameter: 2 }, scene);
        const plane = CreatePlane("plane", { width: 5, height: 2 }, scene);
        plane.rotation.x = Math.PI / 2;

        //const ribbon = CreateRibbon("ribbon", {}, scene);
        return scene;
    };
}

export default new BaseActionAndEvent();