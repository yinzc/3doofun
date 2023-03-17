import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader, Mesh, TransformNode } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";
import "@babylonjs/loaders";
//import * as GUI from "@babylonjs/gui";
import {AdvancedDynamicTexture, StackPanel, Control, Checkbox, TextBlock} from "@babylonjs/gui";

// digital assets
import cvteFiveModel from "../../assets/glb/fivefactory.glb";

export class LoadCVTEFive implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 2, Math.PI / 2.5, 60, new Vector3(0, 0, 0), scene);
        arcRotateCamera.setTarget(Vector3.Zero());
        arcRotateCamera.attachControl(canvas, true);
        arcRotateCamera.useFramingBehavior = true;
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);
        SceneLoader.ImportMeshAsync("", "" , cvteFiveModel, scene).then((bimModel) => {
            console.log("bimModel: " + bimModel.meshes);
            const meshes = bimModel.meshes as Mesh[];
            const floors = this.getFloorsFromMeshes(meshes, scene);
            console.log("floors : " + floors);
            this.createGUI(floors);
        });
        // const importResult = await SceneLoader.ImportMeshAsync(
        //     "",
        //     "",
        //     cvteFiveModel,
        //     scene,
        //     undefined,
        //     ".glb"
        // );


        // // just scale it so we can see it better
        // importResult.meshes[0].scaling.scaleInPlace(10);

        // SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb").then(() => {
        //     const ground = scene.getMeshByName("ground");
        //     if (ground?.material) {
        //         const material = ground.material as StandardMaterial;
        //         material.maxSimultaneousLights = 5;
        //     }
        // });

        return scene;
    };
    
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
            
            const panel = Control.AddHeader(checkbox, `Floor ${floor}`, 10, {isHorizontal: true, controlFirst: true});
            panel.height = "30px";
            stackPanel.addControl(panel);

            checkbox.onIsCheckedChangedObservable.add(() => {
                floors.get(floor)?.setEnabled(checkbox.isChecked);
            });

        }

    };

    getFloorsFromMeshes = (meshes: Mesh[] , scene: Scene) => {
        const floors = new Map<number, TransformNode>();
        meshes.forEach((mesh) => {
            console.log(`floor --> :${mesh.position} --- ${mesh.name}`);
            const floor = Math.floor(mesh.position.y);
            if (!floors.has(floor)) {
                const floorNode = new TransformNode(`floor_${floor}`, scene);
                floors.set(floor, floorNode);
            }
            if(floors.get(floor)){
                const tempFloor = floors.get(floor)! ;
                mesh.setParent(tempFloor);
            }
        });
        return floors;
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

export default new LoadCVTEFive();