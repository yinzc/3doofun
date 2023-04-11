import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class CameraBehaviors implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        var scene = new Scene(engine);
        this.showDebug(scene);
        //const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 1.5, Math.PI / 5, 15, new Vector3(0, 0, 0), scene);
        //arcRotateCamera.attachControl(canvas, true);
        //const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);
        scene = this.bouncingBehavior(scene, canvas);
        
        return scene;
    };

    framingBehavior = (scene : Scene) => {

    };

    autoRotationBehavior = (scene : Scene) => {

    };

    bouncingBehavior = (scene : Scene, canvas : HTMLCanvasElement) => {
        var arcRotateCamera = new ArcRotateCamera("arcRotateCamera", 3 * Math.PI / 2, Math.PI / 8, 50, new Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        arcRotateCamera.lowerRadiusLimit = 6;
        arcRotateCamera.upperRadiusLimit = 20;
        arcRotateCamera.useBouncingBehavior = true;
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        var box = MeshBuilder.CreateBox("box", { size: 3 }, scene);
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

export default new CameraBehaviors();