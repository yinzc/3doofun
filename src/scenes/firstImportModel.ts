import { ArcRotateCamera, Engine, HemisphericLight, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class FirstImportModel implements CreateSceneClass {
    createScene =async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        const arcRotateCamera = new ArcRotateCamera("ArcRotateCamera", -Math.PI/2, Math.PI/2.5, 15, new Vector3(0,0,0), scene);
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("HemisphericLight", new Vector3(1, 1, 0), scene);
        // SceneLoader.ImportMeshAsync(["ground", "semi_house"], "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon");
        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon").then((result) => {
            const house1 = scene.getMeshByName("detached_house");
            // if (house1) {
            //     house1.position.y = 1;
            // } else{
            //     console.log("house1 is null ... ...");
            // }
            house1!.position.y = 1;
            const house2 = result.meshes[2];
            house2.position.y = 0;
            house2.rotationQuaternion = null;
            house2.rotation = Vector3.Zero();
        });
        return scene;
    };
}

export default new FirstImportModel();