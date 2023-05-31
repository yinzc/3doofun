import { LoadCVTEFive } from './loadCVTEFive';
import { Engine, Scene, ArcRotateCamera, Vector3, Mesh, HemisphericLight, Color3, Texture, MeshBuilder, SceneLoader, TransformNode, CubeTexture, Animation, StandardMaterial } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";
import "@babylonjs/loaders";
//import * as GUI from "@babylonjs/gui";
import { AdvancedDynamicTexture, StackPanel, Control, Checkbox, TextBlock } from "@babylonjs/gui";

// digital assets
import moonGlbModel from "../../assets/glb/moon.glb";
import ferAzzurroGlbModel from "../../assets/glb/ferrari_550_barchetta_2000_azzurro_hyperion.glb";
import ferPininfarinaGlbModel from "../../assets/glb/ferrari_550_barchetta_pininfarina_2000.glb";
import cvteFiveFactoryGlbModel from "../../assets/glb/fivefactory.glb";
import controllerModel from "../../assets/glb/samsung-controller.glb";
import roomEnvironment from "../../assets/environment/room.env"
import plantSceneGlbModel from "../../assets/glb/plants_scene_free.glb";

export class WebGLTechPer implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        let scene = new Scene(engine);
        //scene.texturesEnabled = true;
        this.showDebug(scene);
        //scene = await this.loadVRCVTEFiveModel(scene, canvas);
        scene = await this.loadXRCVTEFiveModel(scene, canvas);
        //scene = await this.loadXRFerAzzurroModel(scene, canvas);
        return scene;
    };

    createSkeyBox = (scene: Scene) => {
        //Skybox
        const skybox = MeshBuilder.CreateBox("skyBox", {size: 800.0}, scene);
        const skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }

    loadXRCVTEFiveModel = async (scene: Scene, canvas: HTMLCanvasElement) => {
        // Lights and camera
        const camera = new ArcRotateCamera("arcRotateCamera", -Math.PI/1.25, Math.PI/5, 330, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        //const light = new DirectionalLight("hemisphericLight", new Vector3(100, -100, 100), scene);
        const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

        this.createSkeyBox(scene);
        // Create fiveFactory
        await SceneLoader.ImportMeshAsync("", "", cvteFiveFactoryGlbModel, scene).then((bimModel) => {
            let fiveFactory = scene.getMeshByUniqueId(7);
            if(fiveFactory != (undefined || null)){
                fiveFactory.position = new Vector3(0, 0, 0);
                console.log("fiveFactory uniqueId:" + fiveFactory.uniqueId);
            } else {
                console.log("fiveFactory is null ... ... ");
            }
        });
        // create XR environment
        const environment = scene.createDefaultEnvironment();
        // XR
        const xrHelper = await scene.createDefaultXRExperienceAsync({
            floorMeshes: [environment!.ground!]
        });
        return scene;
    }

    // load VR model
    loadVRCVTEFiveModel = async (scene: Scene, canvas: HTMLCanvasElement) => {
        // Lights and camera
        const camera = new ArcRotateCamera("arcRotateCamera", -Math.PI/1.25, Math.PI/2, 130, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        //const light = new DirectionalLight("hemisphericLight", new Vector3(100, -100, 100), scene);
        const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

        this.createSkeyBox(scene);
        // Create fiveFactory
        await SceneLoader.ImportMeshAsync("", "", cvteFiveFactoryGlbModel, scene).then((bimModel) => {
            let fiveFactory = scene.getMeshByUniqueId(7);
            if(fiveFactory != (undefined || null)){
                fiveFactory.position = new Vector3(0, 0, 0);
                console.log("fiveFactory uniqueId:" + fiveFactory.uniqueId);
            } else {
                console.log("fiveFactory is null ... ... ");
            }
        });
        // create VR environment
        var VRHelper = scene.createDefaultVRExperience();
        VRHelper.enableInteractions();
        // Only show gaze dot on meshes with Flags in their name (eg. flags above user)
        VRHelper.raySelectionPredicate = (mesh) => {
            if (mesh.name.indexOf("Flags") !== -1) {
                return true;
            }
            return false;
        };
        // Only fire onNewMeshSelected event if the selected mesh's name contains Flags01 (eg. only one of the flags)
        VRHelper.meshSelectionPredicate = (mesh) => {
            if (mesh.name.indexOf("Flags01") !== -1) {
                return true;
            }
            return false;
        };
        VRHelper.onNewMeshSelected.add((mesh) => {
            console.log(mesh.name);
        });
        return scene;
    }

    loadXRFerAzzurroModel = async (scene: Scene, canvas: HTMLCanvasElement) =>  {
        // Lights and camera
        const camera = new ArcRotateCamera("arcRotateCamera", -Math.PI/2.25, Math.PI/2.5, 10, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

        SceneLoader.ImportMeshAsync("", "", ferAzzurroGlbModel, scene).then((ferAzzurroModel) => {
            console.log("ferAzzurroModel: " + ferAzzurroModel.meshes);
            let ferAzzurro = scene.getMeshByUniqueId(2629)!;
            //ferAzzurro.rotation = new Vector3(0, -Math.PI/1.9, 0);
            //ferAzzurro.position = new Vector3(350, -19, 75);
            ferAzzurro.scaling = new Vector3(20, 20, 20);
            let ferAzzurroGround = scene.getMeshByUniqueId(2737)!;
            ferAzzurroGround.material!.alpha = 0;
            const animCar = new Animation("animCar", "position.x", 350, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
            const carKeys = [];
            carKeys.push({
                frame: 0,
                value: 350
            });
            carKeys.push({
                frame: 1000,
                value: 300
            });
            carKeys.push({
                frame: 2000,
                value: 200
            });
            animCar.setKeys(carKeys);
            ferAzzurro.animations.push(animCar);
            scene.beginAnimation(ferAzzurro, 0, 2000, true);
        });
        // create XR environment
        const environment = scene.createDefaultEnvironment();
        // XR
        const xrHelper = await scene.createDefaultXRExperienceAsync({
            floorMeshes: [environment!.ground!]
        });
        return scene;
    }

    createGUI = (floors: Map<number, TransformNode>) => {
        const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        gui.idealHeight = 720;

        const stackPanel = new StackPanel();
        stackPanel.width = "220px";
        stackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        gui.addControl(stackPanel);

        for (const floor of floors.keys()) {
            const checkbox = new Checkbox();
            checkbox.width = "20px";
            checkbox.height = "20px";
            checkbox.isChecked = true;

            const textBlock = new TextBlock();
            textBlock.text = `Floor ${floor}`;
            textBlock.width = "150px";
            textBlock.fontSize = "14px";
            textBlock.paddingLeft = "10px";

            const panel = Control.AddHeader(checkbox, `Floor ${floor}`, 10, { isHorizontal: true, controlFirst: true });
            panel.height = "30px";
            stackPanel.addControl(panel);

            checkbox.onIsCheckedChangedObservable.add(() => {
                floors.get(floor)?.setEnabled(checkbox.isChecked);
            });

        }

    };

    getFloorsFromMeshes = (meshes: Mesh[], scene: Scene) => {
        const floors = new Map<number, TransformNode>();
        meshes.forEach((mesh) => {
            console.log(`floor --> :${mesh.position} --- ${mesh.name}`);
            const floor = Math.floor(mesh.position.y);
            if (!floors.has(floor)) {
                const floorNode = new TransformNode(`floor_${floor}`, scene);
                floors.set(floor, floorNode);
            }
            if (floors.get(floor)) {
                const tempFloor = floors.get(floor)!;
                mesh.setParent(tempFloor);
            }
        });
        return floors;
    };

    /** Build Functions */
    showDebug = (scene: Scene) => {
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

export default new WebGLTechPer();