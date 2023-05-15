import { Engine, Scene, FreeCamera, MeshBuilder, StandardMaterial, Vector3, HemisphericLight } from "@babylonjs/core";
import { AdvancedDynamicTexture, Control, TextBlock, StackPanel, ColorPicker} from "@babylonjs/gui";
import { CreateSceneClass } from "../createScene";

export class WebXR implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        let scene = new Scene(engine);
        this.showDebug(scene);
        //scene = await this.basicSceneWithWebXRSupport(scene, canvas);
        scene = await this.webVRCheckForWebXR(scene, canvas);
        return scene;
    };

    webVRCheckForWebXR = async (scene: Scene, canvas: HTMLCanvasElement) => {
        // This creates and positions a free camera (non-mesh)
        var camera = new FreeCamera("camera1", new Vector3(0, 5, -5), scene);
        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
        // Our built-in 'sphere' shape.
        var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 1.4, segments: 32}, scene);
        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;
        sphere.material = new StandardMaterial("sphereMat", scene);
        const environment = scene.createDefaultEnvironment();
        // GUI
        var plane = MeshBuilder.CreatePlane("plane", {size: 1});
        plane.position = new Vector3(1.4, 1.5, 0.4)
        var advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);
        var panel = new StackPanel();    
        advancedTexture.addControl(panel);  
        var header = new TextBlock();
        header.text = "Color GUI";
        header.height = "100px";
        header.color = "white";
        header.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        header.fontSize = "120"
        panel.addControl(header); 
        var picker = new ColorPicker();
        picker.value = (sphere.material as StandardMaterial).diffuseColor;
        picker.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        picker.height = "350px";
        picker.width = "350px";
        picker.onValueChangedObservable.add(function(value) {
            (sphere.material as StandardMaterial).diffuseColor.copyFrom(value);
        });
        panel.addControl(picker);
        // XR
        const xrHelper = await scene.createDefaultXRExperienceAsync({
            floorMeshes: [environment!.ground!]
        });
        return scene;
    };

    basicSceneWithWebXRSupport = async (scene: Scene, canvas: HTMLCanvasElement) => {
        // This creates and positions a free camera (non-mesh)
        var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Our built-in 'sphere' shape.
        var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;
        const environment = scene.createDefaultEnvironment();
        // XR
        const xrHelper = await scene.createDefaultXRExperienceAsync({
            floorMeshes: [environment!.ground!]
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

export default new WebXR();