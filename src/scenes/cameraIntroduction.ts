import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, FreeCamera, MeshBuilder, Vector4, SolidParticleSystem, DeviceOrientationCamera, UniversalCamera, StandardMaterial, Color3, Mesh, Animation, CircleEase, EasingFunction, AbstractMesh, PointerEventTypes, KeyboardEventTypes, Texture, FollowCamera, DirectionalLight, PointLight, Matrix, VRDeviceOrientationFreeCamera } from "@babylonjs/core";
import { AdvancedDynamicTexture, Control, TextBlock, StackPanel, Button, Rectangle, Image, Grid} from "@babylonjs/gui";
import { CreateSceneClass } from "../createScene";

export class CameraIntroduction implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        let scene = new Scene(engine);
        //this.showDebug(scene);
        //scene = this.addingScrollWheelToUniversalCamera(scene, canvas); 
        //scene = this.arcRotateCameraExample(scene, canvas);
        //scene = this.arcRotateCameraOffsetDemo(scene, canvas);
        //scene = this.followCameraExample(scene, canvas);
        //scene = this.deviceOrientationCameraExample(scene, canvas);
        scene = this.vRDeviceOrientationCameraExample(scene, canvas);
        return scene;
    };

    vRDeviceOrientationCameraExample(scene: Scene, canvas: HTMLCanvasElement) {
        /********** DEVICE ORIENTATION CAMERA EXAMPLE **************************/
        // This creates and positions a device orientation camera 	
        var camera = new VRDeviceOrientationFreeCamera("VRDeviceOrientationFreeCamera",  Vector3.Zero(), scene);
        // This targets the camera to scene origin
        camera.setTarget(new Vector3(0, 0, 10));
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
        /**************************************************************/
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        //Materials
        var redMat = new StandardMaterial("red", scene);
        redMat.diffuseColor = new Color3(1, 0, 0);
        redMat.emissiveColor = new Color3(1, 0, 0);
        redMat.specularColor = new Color3(1, 0, 0);
        
        var greenMat = new StandardMaterial("green", scene);
        greenMat.diffuseColor = new Color3(0, 1, 0);
        greenMat.emissiveColor = new Color3(0, 1, 0);
        greenMat.specularColor = new Color3(0, 1, 0);
        
        var blueMat = new StandardMaterial("blue", scene);
        blueMat.diffuseColor = new Color3(0, 0, 1);
        blueMat.emissiveColor = new Color3(0, 0, 1);
        blueMat.specularColor = new Color3(0, 0, 1);
        
        // Shapes
        var plane1 = MeshBuilder.CreatePlane("plane1", { size:3, updatable: true, sideOrientation:Mesh.DOUBLESIDE }, scene);
        plane1.position.x = -3;
        plane1.position.z = 0;
        plane1.material = redMat;
        
        var plane2 = MeshBuilder.CreatePlane("plane2", { size: 3, updatable: true, sideOrientation: Mesh.DOUBLESIDE }, scene);
        plane2.position.x = 3;
        plane2.position.z = -1.5;
        plane2.material = greenMat;
        
        var plane3 = MeshBuilder.CreatePlane("plane3", { size: 3, updatable: true, sideOrientation: Mesh.DOUBLESIDE }, scene);
        plane3.position.x = 3;
        plane3.position.z = 1.5;
        plane3.material = blueMat;
        var ground = MeshBuilder.CreateGround("ground1", { width: 10, height: 10, subdivisions: 2 }, scene);
        return scene;
    }
    

    deviceOrientationCameraExample = function(scene: Scene, canvas: HTMLCanvasElement) {
        /********** DEVICE ORIENTATION CAMERA EXAMPLE **************************/
        // This creates and positions a device orientation camera 	
        var deviceOrientationCamera = new DeviceOrientationCamera("deviceOrientationCamera", new Vector3(0, 0, 0), scene);
        // This targets the camera to scene origin
        deviceOrientationCamera.setTarget(new Vector3(0, 0, 10));
        // This attaches the camera to the canvas
        deviceOrientationCamera.attachControl(canvas, true);
        /**************************************************************/
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        //Materials
        var redMat = new StandardMaterial("red", scene);
        redMat.diffuseColor = new Color3(1, 0, 0);
        redMat.emissiveColor = new Color3(1, 0, 0);
        redMat.specularColor = new Color3(1, 0, 0);
        var greenMat = new StandardMaterial("green", scene);
        greenMat.diffuseColor = new Color3(0, 1, 0);
        greenMat.emissiveColor = new Color3(0, 1, 0);
        greenMat.specularColor = new Color3(0, 1, 0);
        var blueMat = new StandardMaterial("blue", scene);
        blueMat.diffuseColor = new Color3(0, 0, 1);
        blueMat.emissiveColor = new Color3(0, 0, 1);
        blueMat.specularColor = new Color3(0, 0, 1);
        // Shapes
        var plane1 = MeshBuilder.CreatePlane("plane1",{size: 3, sideOrientation: Mesh.DOUBLESIDE, updatable: true},scene);
        plane1.position.x = -3;
        plane1.position.z = 0;
        plane1.material = redMat;
        
        var plane2 = MeshBuilder.CreatePlane("plane2", {size: 3, sideOrientation: Mesh.DOUBLESIDE, updatable: true}, scene);
        plane2.position.x = 3;
        plane2.position.z = -1.5;
        plane2.material = greenMat;
        
        var plane3 = MeshBuilder.CreatePlane("plane3", {size: 3, sideOrientation: Mesh.DOUBLESIDE, updatable: true}, scene);
        plane3.position.x = 3;
        plane3.position.z = 1.5;
        plane3.material = blueMat;
        var ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10, subdivisions: 2}, scene);
        return scene;
    }

    followCameraExample(scene: Scene, canvas: HTMLCanvasElement) {
        var followCamera = new FollowCamera("FollowCamera", new Vector3(0, 10, -10), scene);
        followCamera.radius = 30;
        followCamera.heightOffset = 10;
        followCamera.rotationOffset = 0;
        followCamera.cameraAcceleration = 0.005;
        followCamera.maxCameraSpeed = 10;
        followCamera.attachControl(true);
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        //Material
        var standardMaterial = new StandardMaterial("standardMaterial", scene);
        standardMaterial.alpha = 1.0;
        standardMaterial.diffuseColor = new Color3(0.5, 0.5, 1.0);
        var texture = new Texture("https://i.imgur.com/vxH5bCg.jpg", scene);
        standardMaterial.diffuseTexture = texture;
        //Different face for each side of box to show camera rotation
        var hSpriteNb =  3;  // 3 sprites per row
        var vSpriteNb =  2;  // 2 sprite rows	
        var faceUV = new Array(6);
        for (var i = 0; i < 6; i++) {
            faceUV[i] = new Vector4(i/hSpriteNb, 0, (i+1)/hSpriteNb, 1 / vSpriteNb);
        } 
        // Shape to follow
        var box = MeshBuilder.CreateBox("box", {size: 2, faceUV: faceUV }, scene);
        box.position = new Vector3(20, 0, 10);
        box.material = standardMaterial;
        //create solid particle system of stationery grey boxes to show movement of box and camera
        var boxesSPS = new SolidParticleSystem("boxes", scene, {updatable: false});
        //function to position of grey boxes
        var set_boxes = function(particle: Mesh) {
            particle.position = new Vector3(-50 + Math.random()*100, -50 + Math.random()*100, -50 + Math.random()*100); 
        }
        
        //add 400 boxes
        boxesSPS.addShape(box, 400, {positionFunction:set_boxes});  
        var boxes = boxesSPS.buildMesh(); // mesh of boxes
        /*****************SET TARGET FOR CAMERA************************/ 
        followCamera.lockedTarget = box;
        /**************************************************************/
        //box movement variables
        var alpha = 0;
        var orbit_radius = 20
        //Move the box to see that the camera follows it 	
        scene.registerBeforeRender(function () {
            alpha +=0.01;
            box.position.x = orbit_radius*Math.cos(alpha);
            box.position.y = orbit_radius*Math.sin(alpha);
            box.position.z = 10*Math.sin(2*alpha);
            //change the viewing angle of the camera as it follows the box
            followCamera.rotationOffset = (18*alpha)%360;
        });
        return scene;
    }

    //Create spheres that are pickable in scene
    createMeshes = function (scene: Scene) {
        let dim = 5;
        let sphereNum = 0;
        let sphereNode = new Mesh("spheres", scene);
        for (let i = -dim; i < dim; i++) {
            for (let j = -dim; j < dim; j++) {
                for (let k = -dim; k < dim; k++) {
                    let name = `sphere${sphereNum++}`;
                    let sphere = MeshBuilder.CreateSphere(name, {diameter: 2, segments: 32}, scene);
                    let variance = Math.floor(Math.random()*5);
                    sphere.position = new Vector3(i*12 + variance, j*12 + variance, k*12 + variance);
                    sphere.outlineWidth = 0.1;
                    sphereNode.addChild(sphere);
                }
            }
        }
    };

    /********** ANIMATION SECTION **********/
    //Fade target sphere back into scene
    fadeInTarget = function(scene: Scene, targetLocation: Mesh) {
        const fadeFrames = [];
        const frameRate = 10;
        const fadeTarget = new Animation("fadeInTarget", "alpha", frameRate, Animation.ANIMATIONTYPE_FLOAT);
        fadeFrames.push({
            frame: 0,
            value: 0
        });
        fadeFrames.push({
            frame: frameRate/4,
            value: 0.75
        });
        fadeTarget.setKeys(fadeFrames);
        targetLocation!.material!.animations = [];
        targetLocation!.material!.animations.push(fadeTarget);
        scene.beginAnimation(targetLocation.material, 0, frameRate, false);
    };
    
    //Move target sphere to picked mesh/target
    moveToMesh = function (mesh: AbstractMesh, scene: Scene, targetLocation: Mesh) {
        const moveFrames = [];
        const fadeFrames = [];
        const frameRate = 10;
        const origin = targetLocation.position.clone();
        const destination = mesh.position.clone();
        const moveTarget = new Animation("moveTarget", "position", frameRate, Animation.ANIMATIONTYPE_VECTOR3);
        const fadeTarget = new Animation("fadeTarget", "alpha", frameRate, Animation.ANIMATIONTYPE_FLOAT);
        const mergeEase = new CircleEase();
        mergeEase.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
        moveTarget.setEasingFunction(mergeEase);
        moveFrames.push({
            frame: 0,
            value: origin
        });
        moveFrames.push({
            frame: frameRate,
            value: destination
        });
        fadeFrames.push({
            frame: 0,
            value: 0.75
        });
        fadeFrames.push({
            frame: frameRate,
            value: 0
        });
        moveTarget.setKeys(moveFrames);
        fadeTarget.setKeys(fadeFrames);
        targetLocation!.material!.animations = [];
        targetLocation.animations = [];
        targetLocation.animations.push(moveTarget);
        targetLocation!.material!.animations.push(fadeTarget);
        scene.beginAnimation(targetLocation, 0, frameRate, false);
        scene.beginAnimation(targetLocation.material, 0, frameRate, false);
    };
    /******** END ANIMATION SECTION **********/

    
    //Reset the camera's target so that it's back at the center of it's viewpoint
    resetCameraTarget = function (camera: ArcRotateCamera, activeMesh: Mesh, targetLocation: Mesh) {
        if (activeMesh) {
            /**
             * Basically, we're going reverse what we did when we set the offsets.  Our goal is just to
             * set our camera to be looking at the center with a default radius of 10.  We first get the
             * difference between our current radius and desired one.  Next, we set our localDirection to
             * be our we'd want to pan the camera in relative space.  We calculate and move our camera's
             * target in absolute space and then remove our offsets.
             */
            let diff = camera.radius - 10;
            let relPos = activeMesh.getPositionInCameraSpace(camera);
            let localDirection = new Vector3(relPos.x, relPos.y, diff);
            let viewMatrix = camera.getViewMatrix();
            let transformMatrix = camera.getTransformationMatrix();
            let transformedDirection = Vector3.Zero();
            viewMatrix.invertToRef(transformMatrix);
            localDirection.multiplyInPlace(new Vector3(1,1,1));
            Vector3.TransformNormalToRef(localDirection, transformMatrix, transformedDirection);
            camera.target.subtractInPlace(transformedDirection);
            camera.targetScreenOffset.x = 0;
            camera.targetScreenOffset.y = 0;
            activeMesh.renderOutline = false;
            activeMesh = new Mesh("activeMesh");
            camera.radius = 10;
        }
        targetLocation!.material!.alpha = 0.75;
        targetLocation.position = camera.target;
    };

    //Sets the camera's target to a specific point and configures offsets to move it back into position.
    setCameraOffset = function (camera: ArcRotateCamera, mesh: AbstractMesh, activeMesh: AbstractMesh, animationsActive: Boolean, targetLocation: Mesh) {
        // If we have a mesh to set that hasn't already been set
        if (mesh && mesh !== activeMesh) {
            // Disable outline for previous mesh
            if (activeMesh) {
                activeMesh.renderOutline = false;
            }
            if (!animationsActive) {
                targetLocation!.material!.alpha = 0;
            }

            /** 
             * This is an important part.  The getPositionInCameraSpace function will give us the location of the mesh, as if we were to pan
             * the camera to it.  We then take this value and set our offsets to the relative x and y of that position and use the z as our
             * radius.  By copying the alpha and beta angles, we're effectively performing a 3D Pan and then immediately offsetting the 
             * camera back into the original position.
             * */
            let relPos = mesh.getPositionInCameraSpace(camera);
            let alpha = camera.alpha;
            let beta = camera.beta;
            mesh.renderOutline = true;
            camera.target = mesh.position.clone();
            camera.targetScreenOffset.x = relPos.x;
            camera.targetScreenOffset.y = relPos.y;
            camera.radius = relPos.z;
            camera.alpha = alpha;
            camera.beta = beta;
            activeMesh = mesh;
        }
    };

    arcRotateCameraOffsetDemo = (scene: Scene, canvas: HTMLCanvasElement) => {
        // Actively selected mesh to use as camera's target
        var activeMesh: Mesh = new Mesh("activeMesh") ;
        var targetLocation: Mesh = new Mesh("targetLoaction");
        var animationsActive = true;
        var waitForPanning = false;
        // This creates and positions an ArcRotateCamera
        var camera = new ArcRotateCamera("camera", Math.PI/3, Math.PI/3, 10, Vector3.Zero(), scene);;
        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
        light.specular = new Color3(0, 0, 0);
        // Create all spheres that can be picked
        this.createMeshes(scene);
        // Create the target sphere to be a visual indicator of where the focus is
        targetLocation = MeshBuilder.CreateSphere("targetLoc", {diameter: 0.75, segments: 32}, scene);
        targetLocation.position = camera.target;
        let targetMat = new StandardMaterial("targetMat", scene);
        targetMat.diffuseColor = Color3.Red();
        targetMat.alpha = 0.75;
        targetLocation.material = targetMat;

        // GUI
        let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        let targetText = new TextBlock();
        targetText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        targetText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        targetText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        targetText.text = "Target: none";
        targetText.color = "red";
        targetText.fontSize = 24;
        targetText.width = "200px";
        targetText.height = "30px";
        if (canvas.width < 500) {
            targetText.isVisible = false;
        }
        advancedTexture.addControl(targetText);

        let buttonPanel = new StackPanel();
        buttonPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        advancedTexture.addControl(buttonPanel);  

        // Animation Toggle Button
        let animButton = Button.CreateSimpleButton("anim", "Toggle Animations");
        animButton.width = "300px";
        animButton.height = "30px";
        animButton.color = "white";
        animButton.background = "grey";
        animButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        animButton.onPointerClickObservable.add((eventData: any) => {
            if (animationsActive) {
                animButton!.textBlock!.color = "red";
            } else {
                animButton!.textBlock!.color = "white";
            }
            animationsActive = !animationsActive 
        });
        buttonPanel.addControl(animButton);

        // Reset Camera Position Button
        let resetButton = Button.CreateSimpleButton("reset", "Reset Camera");
        resetButton.width = "300px";
        resetButton.height = "30px";
        resetButton.color = "white";
        resetButton.background = "grey";
        resetButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        resetButton.onPointerClickObservable.add((eventData: any) => {
            camera.target = Vector3.Zero();
            camera.alpha = Math.PI/3;
            camera.beta = Math.PI/3;
            camera.radius = 10;

            if (animationsActive && activeMesh) { 
                this.fadeInTarget(scene,targetLocation); 
            }
            camera.targetScreenOffset.x = 0;
            camera.targetScreenOffset.y = 0;

            activeMesh!.renderOutline = false;
            activeMesh = new Mesh("activeMesh");
            targetLocation!.material!.alpha = 0.75;
            targetLocation.position = camera.target;
            
            targetText.text = "Target: none";
        });
        buttonPanel.addControl(resetButton);

        // This section exists solely because we need to account for panning inertial.
        scene.beforeRender = () => {
            if (waitForPanning && camera.inertialPanningX === 0 && camera.inertialPanningY === 0) {
                let mesh = activeMesh;
                activeMesh = new Mesh("activeMesh");
                this.setCameraOffset(camera, mesh, activeMesh, animationsActive,targetLocation);
                waitForPanning = false;
            }
        };

        // Double-tap: If you double-tap on mesh, highlight and set that mesh as the target
        // Else, reset target to center of view with a radius of 10
        scene.onPointerObservable.add((eventData) => {
            let mesh = eventData!.pickInfo!.pickedMesh;
            if (mesh) {
                if (animationsActive) { 
                    this.moveToMesh(mesh, scene, targetLocation); 
                }
                this.setCameraOffset(camera, mesh, activeMesh, animationsActive, targetLocation);
                targetText.text = `Target: ${mesh.name}`;
            }
            else {
                if (animationsActive && activeMesh) { 
                    this.fadeInTarget(scene, targetLocation); 
                }
                this.resetCameraTarget(camera, activeMesh, targetLocation);
                targetText.text = "Target: none";
            }
        }, PointerEventTypes.POINTERDOUBLETAP);

        // To prevent loss of using mesh as target, we track the active mesh that we were using and just re-set it
        // as the targetted mesh after the pan is complete
        scene.onPointerObservable.add((eventData) => {
            if (activeMesh) {
                // If we're still moving, wait for movement to finish and then reset
                if (camera.inertialPanningX !== 0 || camera.inertialPanningY !== 0) {
                    waitForPanning = true;
                }
                // If someone release right-click on the mouse
                // else if ((eventData.event.button === 2 && eventData.event.pointerType === "mouse") ||
                //     // or let's go of their touches
                //     (eventData.event.buttons === 0 && eventData.event.pointerType === "touch") ||
                //     // or let's go of a pointer button while Ctrl is pressed
                //     eventData.event.ctrlKey) {
                else if (eventData.event.button === 2 || eventData.event.buttons === 0 || eventData.event.ctrlKey) {
                    // Reset the mesh offset so we don't lose the target
                    let mesh = activeMesh;
                    activeMesh = new Mesh("activeMesh");
                    this.setCameraOffset(camera, mesh, activeMesh, animationsActive, targetLocation);
                }
            }
        }, PointerEventTypes.POINTERUP);

        scene.onKeyboardObservable.add((eventData) => {
            // If we're still moving, wait for movement to finish and then reset
            if (camera.inertialPanningX !== 0 || camera.inertialPanningY !== 0) {
                    waitForPanning = true;
            }
            // Since we can combine Ctrl with a drag to pan, we also need to account for Ctrl being released first
            else if (activeMesh && (eventData.event.keyCode === 17 || eventData.event.key === "Control")) {
                let mesh = activeMesh;
                activeMesh = new Mesh("activeMesh");
                this.setCameraOffset(camera, mesh, activeMesh, animationsActive, targetLocation);
            }
        }, KeyboardEventTypes.KEYUP);
        return scene;
    }

    arcRotateCameraExample = (scene: Scene, canvas: HTMLCanvasElement) => {
        /********** ARC ROTATE CAMERA EXAMPLE **************************/
        // Creates, angles, distances and targets the camera
        var camera = new ArcRotateCamera("Camera", 0, 0, 10, new Vector3(0, 0, 0), scene);
        // This positions the camera
        camera.setPosition(new Vector3(0, 0, -10));
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
        /**************************************************************/
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        //Materials
        var redMat = new StandardMaterial("red", scene);
        redMat.diffuseColor = new Color3(1, 0, 0);
        //设置材质的自发光颜色为红色。自发光颜色是指物体通过资深发出光线的颜色，而不是反射颜色中的光线的颜色。在渲染场景时，这个属性可以让被设置的物体看起来会向外散发出红色的光芒。
        redMat.emissiveColor = new Color3(1, 0, 0);
        //设置材质的高光颜色为红色。高光颜色是指照射在表面上时，产生的高亮部分的颜色。在渲染场景时，这个属性可设置的物体看起来有红色的高光效果。
        redMat.specularColor = new Color3(1, 0, 0);
        var greenMat = new StandardMaterial("green", scene);
        greenMat.diffuseColor = new Color3(0, 1, 0);
        greenMat.emissiveColor = new Color3(0, 1, 0);
        greenMat.specularColor = new Color3(0, 1, 0);
        var blueMat = new StandardMaterial("blue", scene);
        blueMat.diffuseColor = new Color3(0, 0, 1);
        blueMat.emissiveColor = new Color3(0, 0, 1);
        blueMat.specularColor = new Color3(0, 0, 1);
        // Shapes
        //设置平面的朝向。在这里，我们将它设置为 Mesh.DOUBLESIDE，即正反面都能看到。其他可选值有 Mesh.FRONTSIDE 和 Mesh.BACKSIDE。
        var plane1 = MeshBuilder.CreatePlane("plane1", {size: 3, sideOrientation: Mesh.DOUBLESIDE}, scene);
        plane1.position.x = -3;
        plane1.position.z = 0;
        plane1.material = redMat;
        var plane2 = MeshBuilder.CreatePlane("plane2", {size: 3, sideOrientation: Mesh.DOUBLESIDE});
        plane2.position.x = 3;
        plane2.position.z = -1.5;
        plane2.material = greenMat;
        var plane3 = MeshBuilder.CreatePlane("plane3", {size: 3, sideOrientation: Mesh.DOUBLESIDE});
        plane3.position.x = 3;
        plane3.position.z = 1.5;
        plane3.material = blueMat;
        var ground = MeshBuilder.CreateGround("ground1", {width: 10, height: 10, subdivisions: 2}, scene);
        return scene;
    }
    
    universalCameraExample = (scene: Scene, canvas: HTMLCanvasElement) => {
        // This creates and positions a free camera (non-mesh)
        //var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
        var universalCamera = new UniversalCamera("universalCamera", new Vector3(0, 0, -10), scene);
        // Enable mouse wheel inputs.
        universalCamera.inputs.addMouseWheel();
        // This targets the camera to scene origin
        universalCamera.setTarget(Vector3.Zero());
        // This attaches the camera to the canvas
        universalCamera.attachControl(true);
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
        // Our built-in 'sphere' shape.
        var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;
        // Our built-in 'ground' shape.
        var ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
        return scene;

    }

    addingScrollWheelToUniversalCamera = (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 5, -10), scene);
        // Enable mouse wheel zoom
        freeCamera.inputs.addMouseWheel();
        //freeCamera.inputs.attached["mousewheel"].wheeelPrecisionY = -1
        freeCamera.setTarget(Vector3.Zero());
        freeCamera.attachControl(canvas, true);
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.7;
        var sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
        sphere.position.y = 1;
        var ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
        return scene;
    }
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

export default new CameraIntroduction();