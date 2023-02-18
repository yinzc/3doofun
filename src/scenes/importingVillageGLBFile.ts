import { ArcRotateCamera, Engine, HemisphericLight, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class ImportingVillageGLBFile implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI/2, Math.PI/2.5, 15, new Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);
        //const box = MeshBuilder.CreateBox("box", {}, scene);

        SceneLoader.ImportMeshAsync("village", "https://assets.babylonjs.com/meshes/village.glb");

        return scene;
    };

    /** Build Functions */
    showDebug = (scene : Scene) => {
        void Promise.all([
            import("@babylonjs/core/Debug/debugLayer"),
            import("@babylonjs/inspector"),
        ]).then((_values) => {
            console.log(_values);
            scene.debugLayer.show({
                handleResize: true,
                overlay: true,
                globalRoot: document.getElementById("#root") || undefined,
            });
        });
    }
}

export default new ImportingVillageGLBFile();



