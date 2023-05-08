import * as BABYLON from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class CrowdNavigationSystem implements CreateSceneClass {
    createScene = async (
        engine: BABYLON.Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<BABYLON.Scene> => {
        const scene = new BABYLON.Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new BABYLON.ArcRotateCamera("arcRotateCamera", -Math.PI / 1.5, Math.PI / 5, 15, new BABYLON.Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(1, 1, 0), scene);
        
        return scene;
    };
    
    createStaticMesh = (scene: BABYLON.Scene) => {
        var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
    
        // Materials
        var mat1 = new BABYLON.StandardMaterial('mat1', scene);
        mat1.diffuseColor = new BABYLON.Color3(1, 1, 1);
    
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere1", {diameter: 2, segments: 16}, scene);
        sphere.material = mat1;
        sphere.position.y = 1;
    
        var cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 1, height: 3 }, scene);
        cube.position = new BABYLON.Vector3(1, 1.5, 0);
        //cube.material = mat2;
    
        var mesh = BABYLON.Mesh.MergeMeshes([sphere, cube, ground]);
        return mesh;
    }

    navigationMeshComputationWithAWebWorker = async (scene : BABYLON.Scene, canvas: HTMLCanvasElement) => {
        
    };
    /** Build Functions */
    showDebug = (scene : BABYLON.Scene) => {
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

export default new CrowdNavigationSystem();