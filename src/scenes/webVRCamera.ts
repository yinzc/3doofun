import { WebGPUEngine } from '@babylonjs/core/Engines/webgpuEngine';
//import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight } from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { CreateSceneClass } from "../createScene";

export class WebVRCamera implements CreateSceneClass {
    createScene = async (
        engine: BABYLON.Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<BABYLON.Scene> => {
        let scene = new BABYLON.Scene(engine);
        this.showDebug(scene);
        //const arcRotateCamera = new BABYLON.ArcRotateCamera("arcRotateCamera", -Math.PI / 1.5, Math.PI / 5, 15, new BABYLON.Vector3(0, 0, 0), scene);
        //arcRotateCamera.attachControl(canvas, true);
        //const hemisphericLight = new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(1, 1, 0), scene);
        //scene = this.vrHelmetExample(scene, canvas);
        //scene = this.baseVRSceneExample(scene, canvas);
        //scene = this.fallbackOrientationCameraExample(scene, canvas);
        //scene = this.accessingVRDevicePositionAndRotationExample(scene, canvas);
        //scene = this.gazeAndInteractionExample(scene, canvas);
        //scene = this.gazeTrackerMeshExample(scene, canvas);
        scene = this.grabbingObjectsExample(scene, canvas);
        return scene;
    };
    fruitNinjaExample = (scene: BABYLON.Scene, canvas: HTMLCanvasElement) => {};
    minecraftJMJExample = (scene: BABYLON.Scene, canvas: HTMLCanvasElement) => {};
    hillValleyExample = (scene: BABYLON.Scene, canvas: HTMLCanvasElement) => {};
    mansionExample = (scene: BABYLON.Scene, canvas: HTMLCanvasElement) => {};
    sponzaExample = (scene: BABYLON.Scene, canvas: HTMLCanvasElement) => {};

    createGround = (scene: BABYLON.Scene) => {
        var ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 12, height: 36, subdivisions: 2 }, scene);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
        (groundMaterial.diffuseTexture as BABYLON.Texture).uScale = 6;
        (groundMaterial.diffuseTexture as BABYLON.Texture).vScale = 6;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground.material = groundMaterial;
    };
    
    createCubes = (cubes: BABYLON.Mesh[], scene: BABYLON.Scene) => {
        for (var i = 0; i < 4; i++) {
            cubes.push(BABYLON.MeshBuilder.CreateBox("cube" + i, { size: 2 }, scene));
            cubes[i].position.y = 1;
            cubes[i].material = new BABYLON.StandardMaterial("cubeMat", scene);
        }
        cubes[0].position.z = 8;
        cubes[1].position.x = 8;
        cubes[2].position.x = -8;
        cubes[3].position.z = -8;
    };
    grabbingObjectsExample = (scene: BABYLON.Scene, canvas: HTMLCanvasElement) => {
        var cubes: BABYLON.Mesh[] = [];
        var selectedMesh : BABYLON.AbstractMesh | null = null;
        var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 6, 0), scene);
        this.createGround(scene);
        this.createCubes(cubes, scene);
        var VRHelper = scene.createDefaultVRExperience();
        VRHelper.enableInteractions();
        VRHelper.enableTeleportation({ floorMeshName: "ground1"});

        VRHelper.onControllerMeshLoaded.add((webVRController)=>{
            webVRController.onTriggerStateChangedObservable.add((stateObject)=>{
                if(webVRController.hand=="left"){  
                    if(selectedMesh !=null){
                        //grab
                        if(stateObject.value > 0.01){
                            webVRController.mesh!.addChild(selectedMesh);
                        //ungrab   
                        }else{
                            webVRController.mesh!.removeChild(selectedMesh);
                        }
                    }
                }
            });
        });
        VRHelper.onNewMeshSelected.add(function(mesh) {
            selectedMesh = mesh;
        });

        VRHelper.onSelectedMeshUnselected.add(function() {
            selectedMesh = null;
        });
        return scene;
    };

    gazeTrackerMeshExample = (scene: BABYLON.Scene, canvas: HTMLCanvasElement) => {
        var vrHelper = scene.createDefaultVRExperience();
        vrHelper.gazeTrackerMesh = BABYLON.MeshBuilder.CreateSphere("sphere1", {segments: 4, diameter: 0.1}, scene);
        vrHelper.enableInteractions();

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        // Create some spheres at the default eye level (2m)
        this.createSphereBox(scene, 2, 2);
        this.createSphereBox(scene, 3, 2);  
        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        var ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 6, height: 6, subdivisions: 2 }, scene);
        return scene;
    };

    createSphereBox = (scene: BABYLON.Scene, distance: number, height: number) => {    
        this.createSphere(scene,  distance, height,  distance);
        this.createSphere(scene,  distance, height, -distance);
        this.createSphere(scene, -distance, height,  distance);
        this.createSphere(scene, -distance, height, -distance);    
    }
    createSphere = (scene: BABYLON.Scene, x: number, y: number, z: number) => {
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere1", { segments: 4, diameter: 0.4 }, scene);
        sphere.position.x = x;
        sphere.position.y = y;
        sphere.position.z = z;
    }

    gazeAndInteractionExample = (scene: BABYLON.Scene, canvas: HTMLCanvasElement) => {
        var camera = new BABYLON.Camera("camera", BABYLON.Vector3.Zero(), scene);
        BABYLON.SceneLoader.Append("https://www.babylonjs.com/scenes/sponza/", "sponza.babylon", scene, function () {
            var VRHelper = scene.createDefaultVRExperience();
            VRHelper.enableInteractions()
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
        });
        return scene;
    };

    accessingVRDevicePositionAndRotationExample = (scene: BABYLON.Scene, canvas: HTMLCanvasElement) => {
        var vrHelper = scene.createDefaultVRExperience();
        //var vrHelper = scene.createDefaultXRExperienceAsync();
        var camera = new BABYLON.FreeCamera("",new BABYLON.Vector3(0,0,-1),scene)
        var light = new BABYLON.DirectionalLight("", new BABYLON.Vector3(0,-1,1), scene)
        light.position.y = 10;
        var sphere = BABYLON.MeshBuilder.CreateSphere("", {segments: 10, diameter: 1}, scene);
        sphere.position.set(0, 1, 10);
        var ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 6, height: 6, subdivisions: 2 }, scene);

        var leftHand = BABYLON.MeshBuilder.CreateBox("",{ size: 0.1 }, scene)
        leftHand.scaling.z = 2;
        var rightHand = leftHand.clone()
        var head = BABYLON.MeshBuilder.CreateBox("",{ size: 0.2 }, scene) 

        // Logic to be run every frame
        scene.onBeforeRenderObservable.add(() => {
            // Left and right hand position/rotation
            if(vrHelper.webVRCamera.leftController){
                leftHand.position = vrHelper.webVRCamera.leftController.devicePosition.clone()
                leftHand.rotationQuaternion = vrHelper.webVRCamera.leftController.deviceRotationQuaternion.clone()
            }
            if(vrHelper.webVRCamera.rightController){
                rightHand.position = vrHelper.webVRCamera.rightController.devicePosition.clone()
                rightHand.rotationQuaternion = vrHelper.webVRCamera.rightController.deviceRotationQuaternion.clone()
            }
            // Head position/rotation
            head.position = vrHelper.webVRCamera.devicePosition.clone()
            head.rotationQuaternion = vrHelper.webVRCamera.deviceRotationQuaternion.clone()
            head.position.z = 2;
        })
        return scene;
    };

    fallbackOrientationCameraExample = (scene: BABYLON.Scene, canvas: HTMLCanvasElement) => {
        // Create simple sphere
        var sphere = BABYLON.MeshBuilder.CreateIcoSphere("sphere", {radius:0.2, flat:true, subdivisions: 1}, scene);
        sphere.position.y = 3;
        sphere.material = new BABYLON.StandardMaterial("sphere material",scene)
        // Lights and camera
        var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -0.5, 1.0), scene);
        light.position = new BABYLON.Vector3(0, 5, -2);
        var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 3, new BABYLON.Vector3(0, 3, 0), scene);
        camera.attachControl(canvas, true);
        //scene.activeCamera.beta += 0.8;

        // Default Environment
        var environment = scene.createDefaultEnvironment({ enableGroundShadow: true, groundYBias: 1 })!;
        environment!.setMainColor(BABYLON.Color3.FromHexString("#74b9ff"))
        
        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;
        shadowGenerator.addShadowCaster(sphere, true);

        // Enable VR
        var vrHelper = scene.createDefaultVRExperience({createDeviceOrientationCamera:false});
        //vrHelper.enableTeleportation({floorMeshes: [environment.ground]});

        // Runs every frame to rotate the sphere
        scene.onBeforeRenderObservable.add(()=>{
            sphere.rotation.y += 0.0001*scene.getEngine().getDeltaTime();
            sphere.rotation.x += 0.0001*scene.getEngine().getDeltaTime();
        });

        // GUI
        var plane = BABYLON.MeshBuilder.CreatePlane("plane", {size: 1});
        plane.position = new BABYLON.Vector3(0.4, 4, 0.4)
        var advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane);
        var panel = new GUI.StackPanel();    
        advancedTexture.addControl(panel);  
        var header = new GUI.TextBlock();
        header.text = "Color GUI";
        header.height = "100px";
        header.color = "white";
        header.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        header.fontSize = "120"
        panel.addControl(header); 
        var picker = new GUI.ColorPicker();
        picker.value = (sphere.material as BABYLON.StandardMaterial).diffuseColor;
        picker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        picker.height = "350px";
        picker.width = "350px";
        picker.onValueChangedObservable.add(function(value) {
            (sphere.material as BABYLON.StandardMaterial).diffuseColor.copyFrom(value);
        });
        panel.addControl(picker);
        vrHelper.onAfterEnteringVRObservable.add(()=>{
            if(scene.activeCamera === vrHelper.vrDeviceOrientationCamera){
                BABYLON.FreeCameraDeviceOrientationInput.WaitForOrientationChangeAsync(1000).then(()=>{
                    // Successfully received sensor input
                }).catch(()=>{
                    alert("Device orientation camera is being used but no sensor is found, prompt user to enable in safari settings");
                })
            }
        }); 
        return scene;
    };

    colors = {
        seaFoam: BABYLON.Color3.FromHexString("#16a085"),
        green: BABYLON.Color3.FromHexString("#27ae60"),
        blue: BABYLON.Color3.FromHexString("#2980b9"),
        purple: BABYLON.Color3.FromHexString("#8e44ad"),
        navy: BABYLON.Color3.FromHexString("#2c3e50"),
        yellow: BABYLON.Color3.FromHexString("#f39c12"),
        orange: BABYLON.Color3.FromHexString("#d35400"),
        red: BABYLON.Color3.FromHexString("#c0392b"),
        white: BABYLON.Color3.FromHexString("#bdc3c7"),
        gray: BABYLON.Color3.FromHexString("#7f8c8d")
    };

    baseVRSceneExample = (scene: BABYLON.Scene, canvas: HTMLCanvasElement) => {
        var camera = new BABYLON.WebVRFreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
        //var camera = new BABYLON.WebXRCamera("camera1", scene,new BABYLON.WebXRSessionManager(scene));
        camera.deviceScaleFactor = 1;
        // required for chrome
        scene.onPointerDown = function () {
            scene.onPointerDown = undefined;
            camera.attachControl(true);
            camera.controllers.forEach((gp) => {
                console.log(gp);
                let mesh = gp.hand === 'right' ? rightBox : leftBox;

                gp.onPadValuesChangedObservable.add(function (stateObject) {
                    let r = (stateObject.x + 1) / 2;
                    let g = (stateObject.y + 1) / 2;
                    (mesh.material as BABYLON.StandardMaterial).diffuseColor.copyFromFloats(r, g, 1);
                });
                gp.onTriggerStateChangedObservable.add(function (stateObject) {
                    let scale = 2 - stateObject.value;
                    mesh.scaling.x = scale;
                });
                // oculus only
                /*gp.onSecondaryTriggerStateChangedObservable.add(function (stateObject) {
                    let scale = 2 - stateObject.value;
                    mesh.scaling.z = scale;
                });*/
                gp.attachToMesh(mesh);
            });
        }
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
        var s = BABYLON.MeshBuilder.CreateTorusKnot('knot', {}, scene);
        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        var rightBox = BABYLON.Mesh.CreateBox("sphere1", 0.1, scene);
        rightBox.scaling.copyFromFloats(2, 1, 2);
        var leftBox = BABYLON.Mesh.CreateBox("sphere1", 0.1, scene);
        leftBox.scaling.copyFromFloats(2, 1, 2);
        rightBox.material = new BABYLON.StandardMaterial('right', scene);
        leftBox.material = new BABYLON.StandardMaterial('right', scene);
        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        //var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
        return scene;
    };

    vrHelmetExample = (scene: BABYLON.Scene, canvas: HTMLCanvasElement) => {
        // Create VR camera assuming user height is 2 meters
        //var camera = new BABYLON.WebVRFreeCamera("camera", new BABYLON.Vector3(0, 2, 0), scene);
        let sessionManager = new BABYLON.WebXRSessionManager(scene);
        var camera = new BABYLON.WebXRCamera("camera", scene, sessionManager);
        // Enable VR onClick
        scene.onPointerDown = function () {
            scene.onPointerDown = undefined;
            camera.attachControl(true);
        }    

        BABYLON.SceneLoader.ImportMesh("", "https://www.babylonjs.com/Assets/DamagedHelmet/glTF/", "DamagedHelmet.gltf", scene, function (meshes) {
            meshes[0].scaling.scaleInPlace(0.5)
            meshes[0].position.set(0,1.5,1)
            // Create light
            var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-2, -3, 1), scene);
            light.position = new BABYLON.Vector3(6, 9, 3);
            light.intensity = 0.5;  
            // Add shadows
            var generator = new BABYLON.ShadowGenerator(512, light);
            generator.useBlurExponentialShadowMap = true;
            generator.blurKernel = 32;
            for (var i = 0; i < scene.meshes.length; i++) {
                generator.addShadowCaster(scene.meshes[i]);    
            }
            // Create basic scene
            var helper = scene.createDefaultEnvironment({
                enableGroundMirror: true,
                groundShadowLevel: 0.6
            });       
            helper!.setMainColor(BABYLON.Color3.Teal());
            scene.onBeforeRenderObservable.add(()=>{
                meshes[0].rotation.y+=0.005
            })
        });
        return scene;
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

export default new WebVRCamera();