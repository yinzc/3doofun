import { Engine, Scene } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class CopyingMeshes implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        
        return scene;
    };
}

export default new CopyingMeshes();