import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader, SpotLight, Color3, MeshBuilder, StandardMaterial, CubeTexture, Texture, Material } from "@babylonjs/core";
import {AdvancedDynamicTexture, StackPanel, Control, TextBlock, Slider} from "@babylonjs/gui";
import { CreateSceneClass } from "../createScene";

export class DayToNight implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        //this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 2.2, Math.PI / 2.2, 15, new Vector3(0, 0, 0), scene);
        arcRotateCamera.upperBetaLimit = Math.PI / 2.2;
        arcRotateCamera.attachControl(canvas, true);

        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);
        hemisphericLight.intensity = 1;

        //GUI
        const adt = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const panel = new StackPanel();
        panel.width = "220px";
        panel.top = "-25x";
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        adt.addControl(panel);

        const header = new TextBlock();
        header.text = "Night to Day";
        header.height = "30px";
        header.color = "white";
        panel.addControl(header);

        const slider = new Slider();
        slider.minimum = 0;
        slider.maximum = 1;
        slider.borderColor = "black";
        slider.color = "gray";
        slider.background = "white";
        slider.height = "20px";
        slider.width = "200px";
        slider.onValueChangedObservable.add((value) => {
            if (hemisphericLight) {
                hemisphericLight.intensity = value;
            }
        });
        panel.addControl(slider);

        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "lamp.babylon").then(() => {
            const lampLight = new SpotLight("lampLight", Vector3.Zero(), new Vector3(0, -1, 0), 0.8 * Math.PI, 0.01, scene);
            lampLight.diffuse = Color3.Yellow();
            lampLight.parent = scene.getMeshByName("bulb");
            
            const lamp = scene.getMeshByName("lamp");
            lamp!.position = new Vector3(2, 0, 2);
            lamp!.rotation = Vector3.Zero();
            lamp!.rotation.y = -Math.PI / 4;

            console.log("parent : " + lamp!.parent)
            const lamp3 = lamp!.clone("lamp3", lamp!.parent);
            lamp3!.position.z = -8;

            const lamp1 = lamp!.clone("lamp1", lamp!.parent);
            lamp1!.position.x = -8;
            lamp1!.position.z = 1.2;
            lamp1!.rotation.y = Math.PI / 2;

            const lamp2 = lamp1?.clone("lamp2", lamp1.parent);
            lamp2!.position.x = -2.7;
            lamp2!.position.z = 0.8;
            lamp2!.rotation.y = -Math.PI / 2;
        });

        //Skybox
        const skybox = MeshBuilder.CreateBox("skyBox", {size: 150}, scene);
        const skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial; 

        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb").then(() => {
            const ground = scene.getMeshByName("ground");
            const groundMaterial = ground!.material as StandardMaterial;
            groundMaterial.maxSimultaneousLights = 5;
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

export default new DayToNight();