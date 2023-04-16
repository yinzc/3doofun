import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class CameraBehaviors implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        var scene = new Scene(engine);
        this.showDebug(scene);
        //scene = this.bouncingBehavior(scene, canvas);
        //scene = this.autoRotationBehavior(scene, canvas);
        scene = this.framingBehavior(scene, canvas);
        return scene;
    };

    framingBehavior = (scene : Scene, canvas: HTMLCanvasElement) => {
        var arcRotateCamera = new ArcRotateCamera("arcRotateCamera", 3 * Math.PI / 2, - Math.PI / 2.5, 50, Vector3.Zero(), scene);
        arcRotateCamera.attachControl(canvas, true);
        arcRotateCamera.useFramingBehavior = true;
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        var box = MeshBuilder.CreateBox("box", { size: 3 }, scene);
        arcRotateCamera.setTarget(box);
        return scene;
    };

    autoRotationBehavior = (scene : Scene, canvas: HTMLCanvasElement) => {
        var arcRotateCamera = new ArcRotateCamera("arcRotateCamera", 3 * Math.PI / 2, Math.PI / 8, 50, Vector3.Zero(), scene);
        arcRotateCamera.attachControl(canvas, true);
        arcRotateCamera.lowerAlphaLimit = 6;
        arcRotateCamera.upperAlphaLimit = 20;
        arcRotateCamera.useAutoRotationBehavior = true;
        arcRotateCamera.autoRotationBehavior
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        var box = MeshBuilder.CreateBox("box", { size: 3 }, scene);
        return scene;
    };

    bouncingBehavior = (scene : Scene, canvas : HTMLCanvasElement) => {
        var arcRotateCamera = new ArcRotateCamera("arcRotateCamera", 3 * Math.PI / 2, Math.PI / 8, 50, new Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
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