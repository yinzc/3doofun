import { Animation, ArcRotateCamera, Engine, HemisphericLight, SceneLoader, Scene, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders";
import { CreateSceneClass } from "../createScene";

export class CarAnimation implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI/2, Math.PI/2.5, 15, new Vector3(0, 0, 0));
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1,1,0), scene);
        //SceneLoader.ImportMeshAsync("village.glb", "http://babylon.3doofun.com:8080/assets/glb/", "village.glb");
        //SceneLoader.ImportMeshAsync("car.glb", "http://babylon.3doofun.com:8080/assets/glb/", "car.glb").then(() => {
        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "village.glb");
        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.glb").then(() => {
            const car = scene.getMeshByName("car");
            if(car != (undefined || null)){
                car.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
                car.position.y = 0.16;
                car.position.x = -3;
                car.position.z = 8;
                const animCar = new Animation("carAnimation", "position.z", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
                const carKeys = [];
                carKeys.push({
                    frame: 0,
                    value: 8
                });
                carKeys.push({
                    frame: 150,
                    value: -7
                });
                carKeys.push({
                    frame: 200,
                    value: -7
                });
                animCar.setKeys(carKeys);
                car.animations = [];
                car.animations.push(animCar);
                scene.beginAnimation(car, 0, 200, true);
                //wheel animation
                const wheelRB = scene.getMeshByName("wheelRB");
                const wheelRF = scene.getMeshByName("wheelRF");
                const wheelLB = scene.getMeshByName("wheelLB");
                const wheelLF = scene.getMeshByName("wheelLF");
                scene.beginAnimation(wheelRB, 0, 30, true);
                scene.beginAnimation(wheelRF, 0, 30, true);
                scene.beginAnimation(wheelLB, 0, 30, true);
                scene.beginAnimation(wheelLF, 0, 30, true);
            } else {
                console.info("car is null ... ...");
                return ;
            }
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

export default new CarAnimation();