import { Engine,Ray,Scene,DeviceSourceManager,PointerInput,DeviceType,Matrix, ArcRotateCamera,Axis,Texture,CubeTexture, Vector3, HemisphericLight,Vector4, Camera, SceneLoader, Mesh, VRCameraMetrics, VRDeviceOrientationFreeCamera, FreeCamera, Viewport, Color4, Color3, MeshBuilder, StandardMaterial, DynamicTexture } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";
import "@babylonjs/loaders";

export class MultiviewsPart implements CreateSceneClass {
    omittedMeshes = [];
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        var scene = new Scene(engine);
        this.showDebug(scene);
        //scene = this.vRExperienceMultiviewExample(scene, canvas);
        //scene = this.vRDeviceOrientationFreeCameraMultiviewExample(scene, canvas);
        //scene = this.viewportExample(scene, canvas);
        //scene = this.gunSightCrosshairExample(scene, canvas);
        scene = this.pictureInPictureVisualCameraExample(engine, scene, canvas);
        return scene;
    };


    /******************** Helper functions ********************/
    /**
     * Given a scene object, create the head mesh to represent a camera
     * 
     * This head makes use of the UV code from a playground found on the
     * Map Materials to Individual Mesh Faces page:
     * https://doc.babylonjs.com/divingDeeper/materials/using/texturePerBoxFace
     */
    createHead = (scene: Scene) => {
        // Create a texture for our head
        var mat = new StandardMaterial("mat", scene);
        var texture = new Texture("https://i.imgur.com/vxH5bCg.jpg", scene);
        mat.diffuseTexture = texture;
        // Define the UVs (coordinates) for our box faces
        var faceUV = new Array(6);
        faceUV[0] = new Vector4(0, 0.5, 1 / 3, 1);  // Right ear
        faceUV[1] = new Vector4(1 / 3, 0, 2 / 3, 0.5);  // Top of head
        faceUV[2] = new Vector4(2 / 3, 0, 1, 0.5); // Bottom
        faceUV[3] = new Vector4(0, 0, 1 / 3, 0.5); //Back of Head
        faceUV[4] = new Vector4(1 / 3, 0.5, 2 / 3, 1); // Face
        faceUV[5] = new Vector4(2 /3, 0.5, 1, 1); // Left Ear
        var options = {
            faceUV: faceUV,
            wrap: true
        };
        // Create the head, rotate it into place, and set the texture.
        let head = MeshBuilder.CreateBox('head', options, scene);
        head.rotate(Axis.Y, Math.PI);
        head.material = mat;
        return head;
    };

    /**
     * Given a scene, create a basic skybox to surround the area.
     * 
     * For more information on Skyboxes, check out the Skyboxes doc page:
     * https://doc.babylonjs.com/divingDeeper/environment/skybox
     */
    createSkyBox = (scene: Scene) => {
        var skybox = MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
        skybox.layerMask = 0x10000000;
        var skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    };

    /**
     * Given a scene, the overhead camera, and the picture-in-picture plane, 
     * cast a ray from the pip camera to the player and check for all meshes 
     * that are in-between them.  Each mesh that the ray hits will have its 
     * layer mask changed to 0x20000000 so that it's only visible to the primary
     * camera and not the pip camera.  When a mesh is no longer being picked by 
     * the ray being cast, it will have its layer mask changed back to 0x10000000
     * (visible to both cameras).
     * 
     * This function makes use of rays for mesh picking.  For more information, 
     * check out Mesh Picking:
     * https://doc.babylonjs.com/divingDeeper/mesh/interactions/picking_collisions
     */
    castRay = (scene: Scene, mainCamera: FreeCamera, pipCamera: FreeCamera) => {
        // Since we're just pointing straight down, we can just use the given vector
        let direction = new Vector3(0, -1, 0);
        // The length will be the distance between each camera
        let length = pipCamera.position.y - mainCamera.position.y;
        let ray = new Ray(pipCamera.position, direction, length);
        let hits = scene.multiPickWithRay(ray);
        // If we have any picked meshes, add all picked meshes and removed any that are not tagged by our ray
        if (hits) {
            let meshesToCheck: any = []; // Array to hold currently picked meshes
            hits.forEach((hit) => {
                hit.pickedMesh!.layerMask = 0x20000000; // Set layer mask so that only the main camera can see the mesh
                meshesToCheck.push(hit.pickedMesh);
            });
            let meshesToReAdd = this.omittedMeshes.filter(omittedMesh => meshesToCheck.indexOf(omittedMesh) < 0);
            meshesToReAdd.forEach((omittedMesh: any) => {
                omittedMesh.layerMask = 0x10000000;
            });
            this.omittedMeshes = meshesToCheck;
        }
    };

    /**
     * Rather than use the default attachedControls from the Input Manager, 
     * We're using the DeviceSourceManager to add FPS-like controls.  The 
     * arrow keys have been given rotation behaviors for users who want to 
     * just use keyboard or potentially add gamepad support during their 
     * experimentations.
     * 
     * Device Source Manager:
     * https://doc.babylonjs.com/divingDeeper/input/deviceSourceManager
     */
    initializeInput = (scene: Scene, camera: FreeCamera, pipCamera: FreeCamera) => {
        let dsm = new DeviceSourceManager(scene.getEngine());
        dsm.onDeviceConnectedObservable.add((device) => {
            // KEYBOARD CONFIG
            if (device.deviceType === DeviceType.Keyboard) {
                scene.onBeforeRenderObservable.add(() => {
                    let transformMatrix = Matrix.Zero();
                    let localDirection = Vector3.Zero();
                    let transformedDirection = Vector3.Zero();
                    let isMoving = false;
                    // WASD will move and strafe
                    if (device.getInput(65) === 1) {
                        localDirection.x = -0.1;
                        isMoving = true;
                    }
                    if (device.getInput(68) === 1) {
                        localDirection.x = 0.1;
                        isMoving = true;
                    }
                    if (device.getInput(87) === 1) {
                        localDirection.z = 0.1;
                        isMoving = true;
                    }
                    if (device.getInput(83) === 1) {
                        localDirection.z = -0.1;
                        isMoving = true;
                    }
                    // Arrow keys to rotate
                    if (device.getInput(37) === 1) {
                        camera.rotation.y -= 0.01;
                    }
                    if (device.getInput(39) === 1) {
                        camera.rotation.y += 0.01;
                    }
                    if (device.getInput(38) === 1) {
                        camera.rotation.x -= 0.01;
                    }
                    if (device.getInput(40) === 1) {
                        camera.rotation.x += 0.01;
                    }
                    if (isMoving) {
                        camera.getViewMatrix().invertToRef(transformMatrix);
                        Vector3.TransformNormalToRef(localDirection, transformMatrix, transformedDirection);
                        camera.position.addInPlace(transformedDirection);
                        pipCamera.position.addInPlace(transformedDirection);
                        this.castRay(scene, camera, pipCamera);
                    }
                });
            }
            // POINTER CONFIG
            else if (device.deviceType === DeviceType.Mouse || device.deviceType === DeviceType.Touch) {
                device.onInputChangedObservable.add((deviceData) => {
                    if (deviceData.inputIndex === PointerInput.Move && device.getInput(PointerInput.LeftClick) === 1) {
                        camera.rotation.y += deviceData.movementX * 0.00175;
                        camera.rotation.x += deviceData.movementY * 0.00175;
                    }
                });
                // Move forward if 2 fingers are pressed against screen
                if (!scene.beforeRender && device.deviceType === DeviceType.Touch ) {
                    scene.beforeRender = () => {
                        let transformMatrix = Matrix.Zero();
                        let localDirection = Vector3.Zero();
                        let transformedDirection = Vector3.Zero();
                        let isMoving = false;
                        if (dsm.getDeviceSources(DeviceType.Touch).length === 2) {
                            localDirection.z = 0.1;
                            isMoving = true;
                        }
                        if (isMoving) {
                            camera.getViewMatrix().invertToRef(transformMatrix);
                            Vector3.TransformNormalToRef(localDirection, transformMatrix, transformedDirection);
                            camera.position.addInPlace(transformedDirection);
                            pipCamera.position.addInPlace(transformedDirection);
                            this.castRay(scene, camera, pipCamera);
                        }
                    };
                }
            }
        });
        return dsm;
    };

    pictureInPictureVisualCameraExample = (engine: Engine, scene: Scene, canvas: HTMLCanvasElement) => {
        // This creates our primary camera
        var camera = new FreeCamera("freeCamera", new Vector3(0, 5, 0), scene);
        // Load glTF scene.  Once loaded, begin to configure everything.
        SceneLoader.Append("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sponza/glTF/", "Sponza.gltf", scene, (scene) => {
            var pipCamera = new FreeCamera("pipCamera", new Vector3(0,20,0), scene);
            pipCamera.setTarget(Vector3.Zero());
            // We want to preserve the square PIP look so we'll use the main camera's aspect ratio to adjust the sizes accordingly
            // Aspect ratio < 1 = Portrait, > 1 = Landscape
            let ar = engine.getAspectRatio(camera);
            let pipW = (ar < 1) ? 0.3 : 0.3 * (1/ar);
            let pipH = (ar < 1) ? 0.3 * ar : 0.3;
            let pipX = 1 - pipW;
            let pipY = 1 - pipH;
            // Specify location and amount of screen each camera should take
            // Note: All values for the viewport are going to be 0 to 1.  Think about it as a percentage of the screen.
            camera.viewport = new Viewport(0, 0, 1, 1);
            pipCamera.viewport = new Viewport(pipX, pipY, pipW, pipH);
            // We are setting layer masks for cameras (and later on, our meshes)
            // This is being done because there parts of the Sponza mesh that we won't want to display
            // on the PIP camera (logic found in castRay function).
            camera.layerMask = 0x30000000;  // Set layer mask so that it can see 0x10000000 and 0x20000000 objects
            pipCamera.layerMask = 0x10000000; // Set layer mask to only see 0x10000000 objects
            // Add cameras to active camera list.  
            // Each camera MUST be in the active camera list to be displayed with its defined viewport
            scene.activeCameras!.push(camera);
            scene.activeCameras!.push(pipCamera);
            // Create head mesh to represent where the camera is looking.
            var head = this.createHead(scene);
            head.isPickable = false; // We're turning off picking on the head mesh because we don't want it to be picked up by our overhead ray
            head.setParent(camera);
            head.position = Vector3.Zero();
            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
            // Default intensity is 1. Let's dim the light a small amount
            light.intensity = 0.7;
            // For each part of the Sponza mesh, we want to increase the size and set its layer mask so that
            // it's visible to both cameras
            scene.meshes.forEach((mesh) => {
                mesh.scaling = new Vector3(3,3,3);
                mesh.layerMask = 0x10000000; // Set layer mask so that meshes are visible to all cameras
            });
            // Set camera to look down the hall and show face
            camera.setTarget(new Vector3(1,6,0));
            // Create a basic skybox
            this.createSkyBox(scene);
            // Create and initialize our DeviceSourceManager
            var dsm = this.initializeInput(scene, camera, pipCamera);
        });
        return scene;
    };


    addGunSight(scene: Scene){
        if (scene.activeCameras!.length === 0){
            scene.activeCameras!.push(scene.activeCamera!);
        }              
        var secondCamera = new FreeCamera("GunSightCamera", new Vector3(0, 0, -50), scene);                
        secondCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
        secondCamera.layerMask = 0x20000000;
        scene.activeCameras!.push(secondCamera);
        
        var meshes = [];
        var h = 250;
        var w = 250;
        
        var y = MeshBuilder.CreateBox("y", {size: h * 0.2}, scene);
        y.scaling = new Vector3(0.05, 1, 1);
        y.position = new Vector3(0, 0, 0);
        meshes.push(y);
        
        var x = MeshBuilder.CreateBox("x", {size: h * 0.2}, scene);
        x.scaling = new Vector3(1, 0.05, 1);
        x.position = new Vector3(0, 0, 0);
        meshes.push(x);
            
        // var lineTop = MeshBuilder.CreateBox("lineTop", {size:w * 0.8}, scene);
        // lineTop.scaling = new Vector3(1, 0.005, 1);
        // lineTop.position = new Vector3(0, h * 0.5, 0);
        // meshes.push(lineTop);
        
        // var lineBottom = MeshBuilder.CreateBox("lineBottom", {size: w * 0.8}, scene);
        // lineBottom.scaling = new Vector3(1, 0.005, 1);
        // lineBottom.position = new Vector3(0, h * -0.5, 0);
        // meshes.push(lineBottom);
        
        // var lineLeft = MeshBuilder.CreateBox("lineLeft", {size: h}, scene);
        // lineLeft.scaling = new Vector3(0.010, 1,  1);
        // lineLeft.position = new Vector3(w * -.4, 0, 0);
        // meshes.push(lineLeft);
        
        // var lineRight = MeshBuilder.CreateBox("lineRight", {size: h}, scene);
        // lineRight.scaling = new Vector3(0.010, 1,  1);
        // lineRight.position = new Vector3(w * .4, 0, 0);
        // meshes.push(lineRight);
        
        var gunSight = Mesh.MergeMeshes(meshes);
        gunSight!.name = "gunSight";
        gunSight!.layerMask = 0x20000000;
        gunSight!.freezeWorldMatrix();
        
        var mat = new StandardMaterial("emissive mat",scene);
        mat.checkReadyOnlyOnce = true;
        mat.emissiveColor = new Color3(0,0,1);
        gunSight!.material = mat;
    }

    gunSightCrosshairExample = (scene: Scene, canvas: HTMLCanvasElement) => {
        var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);
        var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        var sphere = MeshBuilder.CreateSphere("sphere1",{segments: 16, diameter: 2}, scene);
        sphere.position.y = 1;
        var ground = MeshBuilder.CreateGround("ground1", {width: 6, height: 6, subdivisions: 2}, scene);
        this.addGunSight(scene);
        return scene;
    };

    viewportExample = (scene: Scene, canvas: HTMLCanvasElement) => {
        scene.clearColor = new Color4(0.5, 0.5, 0.5, 1);
        // camera 1
        var camera1 = new ArcRotateCamera("camera1",  3 * Math.PI / 8, 3 * Math.PI / 8, 15, new Vector3(0, 2, 0), scene);
        camera1.attachControl(canvas, true);

        //camera 2
        var camera2 = new ArcRotateCamera("camera2",  5 * Math.PI / 8, 5 * Math.PI / 8, 30, new Vector3(0, 2, 0), scene);
        camera2.attachControl(canvas, true);

        // Two Viewports
        camera1.viewport = new Viewport(0, 0.5, 1, 1);
        camera2.viewport = new Viewport(0, 0, 1, 0.5);
        scene.activeCameras!.push(camera1);
        scene.activeCameras!.push(camera2);
    
        // lights
        var light1 = new HemisphericLight("light1", new Vector3(1, 0.5, 0), scene);
        light1.intensity = 0.7;
        var light2 = new HemisphericLight("light2", new Vector3(-1, -0.5, 0), scene);
        light2.intensity = 0.8;
    
        var faceColors = [];
        faceColors[0] = Color4.FromColor3(Color3.Blue());
        faceColors[1] = Color4.FromColor3(Color3.White());
        faceColors[2] = Color4.FromColor3(Color3.Red());
        faceColors[3] = Color4.FromColor3(Color3.Black());
        faceColors[4] = Color4.FromColor3(Color3.Green());
        faceColors[5] = Color4.FromColor3(Color3.Yellow());
        var box = MeshBuilder.CreateBox("Box", {faceColors:faceColors, size:2, updatable: true}, scene);
        box.material = new StandardMaterial("", scene);
        
        var showAxis = function(size: number) {
            var makeTextPlane = function(text: string, color: string, size: number) {
                var dynamicTexture = new DynamicTexture("DynamicTexture", 50, scene, true);
                dynamicTexture.hasAlpha = true;
                dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
                var plane = MeshBuilder.CreatePlane("TextPlane", {size: size, updatable: true}, scene);
                plane.material = new StandardMaterial("TextPlaneMaterial", scene);
                plane.material.backFaceCulling = false;
                (plane.material as StandardMaterial).specularColor = new Color3(0, 0, 0);
                (plane.material as StandardMaterial).diffuseTexture = dynamicTexture;
                return plane;
            };
            var axisX = MeshBuilder.CreateLines("axisX", {points:[Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0), new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)]}, scene);
            axisX.color = new Color3(1, 0, 0);
            var xChar = makeTextPlane("X", "red", size / 10);
            xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
            var axisY = MeshBuilder.CreateLines("axisY", {points:[Vector3.Zero(), new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0), new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)]}, scene);
            axisY.color = new Color3(0, 1, 0);
            var yChar = makeTextPlane("Y", "green", size / 10);
            yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
            var axisZ = MeshBuilder.CreateLines("axisZ", {points:[Vector3.Zero(), new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95), new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)]}, scene);
            axisZ.color = new Color3(0, 0, 1);
            var zChar = makeTextPlane("Z", "blue", size / 10);
            zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
        };
        showAxis(6);
        return scene;
    };
    
    vRExperienceMultiviewExample = (scene: Scene, canvas: HTMLCanvasElement) => {
        let camera = new Camera("camera", Vector3.Zero(), scene);
        SceneLoader.Append("https://www.babylonjs.com/Scenes/hillvalley/", "HillValley.babylon", scene, () => {
            //scene.createDefaultVRExperience({useMultiview: true});
            scene.createDefaultXRExperienceAsync();
        });
        return scene;
    }

    vRDeviceOrientationFreeCameraMultiviewExample = (scene: Scene, canvas: HTMLCanvasElement) => {
        let camera = new Camera("camera", Vector3.Zero(), scene);
        SceneLoader.Append("https://www.babylonjs.com/Scenes/hillvalley/", "HillValley.babylon", scene, () => {
            // Enable multview
            var multiviewMeterics = VRCameraMetrics.GetDefault();
            multiviewMeterics.multiviewEnabled = true;
            // Create camera
            var multiviewCamera = new VRDeviceOrientationFreeCamera("VRDeviceOrientationFreeCamera", new Vector3(-10, 5, 0), scene, undefined, multiviewMeterics);
            scene.activeCamera = multiviewCamera;
            multiviewCamera.attachControl(canvas, true);
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

export default new MultiviewsPart();