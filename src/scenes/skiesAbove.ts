import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, CubeTexture, Texture, Color3, SceneLoader, Animation } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";
import "@babylonjs/loaders";

export class SkiesAbove implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene);
        arcRotateCamera.upperBetaLimit = Math.PI / 2.2;
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);

        //Skybox
        const skybox = MeshBuilder.CreateBox("skybox", {size: 150}, scene);
        const skyboxMaterial = new StandardMaterial("skyboxMaterial", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb");
        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.glb").then(() => {
            const car = scene.getMeshByName("car");
            car!.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
            car!.position.y = 0.16;
            car!.position.x = -3;
            car!.position.z = 8;

            const animCar = new Animation("carAnimation", "position.z", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
            const carKeys = []; 
            carKeys.push({
                frame: 0,
                value: 10
            });
            carKeys.push({
                frame: 200,
                value: -15
            });
            animCar.setKeys(carKeys);
            car!.animations = [];
            car!.animations.push(animCar);
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

export default new SkiesAbove();