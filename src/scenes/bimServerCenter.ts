import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders";
import { CreateSceneClass } from "../createScene";

export class BimServerCenter implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 1.5, Math.PI / 5, 15, new Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);

        SceneLoader.ImportMesh("", "https://models.bimserver.center/ifc/steel-structure-house-modern-2-story-small-SZAV39TZLAXG2KUXW2Q4A4TF4I.ifc", "scene.ifc", scene, function (meshes) {
            scene.createDefaultCameraOrLight(true, true, true);
        });
        
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

export default new BimServerCenter();