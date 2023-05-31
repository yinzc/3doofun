import { Engine, Scene, Matrix, FreeCamera, MeshBuilder, Vector3, HemisphericLight, HavokPlugin, PhysicsBody, PhysicsViewer, PhysicsHelper, PhysicsMotionType, PhysicsAggregate, PhysicsShapeType, PhysicsRadialImpulseFalloff, DynamicTexture, PBRMaterial, int, StandardMaterial, Color3, PhysicsShapeSphere, PhysicsShapeBox, Quaternion, PhysicsImpostor, Mesh } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control, TextBlock, StackPanel, Checkbox} from "@babylonjs/gui";
import HavokPhysics from "@babylonjs/havok";
import { CreateSceneClass } from "../createScene";

export class PhysicsEngine implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        let scene = new Scene(engine);
        this.showDebug(scene);
        //scene = await this.simpleFallingSphere(scene, canvas);
        //scene = await this.sleepMode(scene, canvas);
        scene = await this.simpleShapeScene(scene, canvas);
        return scene;
    };

    addButton = (parent: StackPanel, text: string, fn: any) => {
        var btn = Button.CreateSimpleButton("btn", text);
        btn.width = "100%";
        btn.height = "40px";
        btn.background = "green";
        btn.color = "white";
        btn.onPointerClickObservable.add(fn);
        parent.addControl(btn);
    }
    
    addCheck = (parent: StackPanel, text: string, startValue: boolean, fn: any) => {
        const useAggregateCheck = new Checkbox("check");
        useAggregateCheck.width = "20px";
        useAggregateCheck.height = "20px";
        useAggregateCheck.isChecked = startValue;
        useAggregateCheck.color = "white";
        useAggregateCheck.onIsCheckedChangedObservable.add(fn);
        const selector = Control.AddHeader(useAggregateCheck, text, "300px", { isHorizontal: true, controlFirst: true });
        selector.width = "100%";
        selector.height = "40px";
        selector.color = "white";
        parent.addControl(selector);
    }

    physicsHelpers = (scene: Scene, canvas: HTMLCanvasElement) => {
        var baseBox: Mesh;
        let useAggregate = false;
        let useViewer = false;
        let useInstances = false;
        // Physics engine
        var physicsViewer: PhysicsViewer;
        const useV2 = true;

        //var plugin = useV2 ? new HavokPlugin() : new AmmoJSPlugin();
        var plugin = useV2 ? new HavokPlugin() : new HavokPlugin();
        scene.enablePhysics(new Vector3(0, -10, 0), plugin);
        if (useViewer) {
            physicsViewer = new PhysicsViewer();
        }
        var physicsHelper = new PhysicsHelper(scene);
        this.createCameraAndLight(scene, canvas, new Vector3(0, 24, -64), new Vector3(0, 1, 0));
        // Ground
        var ground = MeshBuilder.CreateGround("ground1", {width: 64, height: 64, subdivisions: 2}, scene);
        if (useV2) {
            if (useAggregate) {
                new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0, restitution: 0.3, friction: 0.2 }, scene);
            } else {
                const shape = new PhysicsShapeBox(new Vector3(0, 0, 0), Quaternion.Identity(), new Vector3(64, 0.001, 64), scene);
                const material = { friction: 0.2, restitution: 0.3 };
                const body = new PhysicsBody(ground, PhysicsMotionType.STATIC, false, scene);

                shape.material = (material);
                body.shape = (shape);
                body.setMassProperties({
                    mass: 0,
                });
            }
        } else {
            ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 }, scene);
        }

        var ui = AdvancedDynamicTexture.CreateFullscreenUI("ui");
        var panel = new StackPanel("control-panel");
        panel.width = "300px";
        panel.adaptHeightToChildren = true;
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        ui.addControl(panel);

        if (useV2) {
            var bodiesCounter = new TextBlock("bodiesCounter", "bodies: 0");
            bodiesCounter.color = "white";
            bodiesCounter.resizeToFit = true;
            bodiesCounter.fontSize = "20px";
            panel.addControl(bodiesCounter);
            scene.onBeforeRenderObservable.add(() => {
                const n = plugin.numBodies;
                bodiesCounter.text = `bodies: ${n}`;
            });
        }

        this.addCheck(panel, "Use Aggregate", useAggregate, (value: any) => {
            useAggregate = value;
        });

        this.addCheck(panel, "Use Viewer", useViewer, (value: any) => {
            useViewer = value;
        });

        this.addCheck(panel, "Use Instances", useInstances, (value: any) => {
            useInstances = value;
        });

        const boxes: any[] = [];
        var boxSize = 2;
        // Common physic material for non aggregate case
        const boxesPhysicMaterial = { friction: 0.2, restitution: 0.3 };
        const boxesPhysicShape = new PhysicsShapeBox(new Vector3(0, 0, 0), Quaternion.Identity(), new Vector3(boxSize, boxSize, boxSize), scene);
        boxesPhysicShape.material = boxesPhysicMaterial;
        // Boxes
        function createBoxes() {
            console.log('create boxes with aggregate', useAggregate, 'and viewer', useViewer, 'and v2', useV2);
            var boxPadding = 4;
            var minXY = -12;
            var maxXY = 12;
            var maxZ = 8;
            var boxParams = { height: boxSize, width: boxSize, depth: boxSize };
            var boxImpostorParams = { mass: boxSize, restitution: 0.2, friction: 0.3 };
            var boxMaterial = new StandardMaterial("boxMaterial");
            let index = 0;
            
            let baseMatrix;
            //let baseMatrixArray = [];
            if (useInstances) {
                baseBox = MeshBuilder.CreateBox("baseBox", boxParams, scene);
                baseBox.material = new StandardMaterial("baseBoxMat");
                (baseBox.material as StandardMaterial).diffuseColor = new Color3(0,0,1);
                baseMatrix = Matrix.Identity();
            }
            boxMaterial.diffuseColor = new Color3(1, 0, 0);
            for (var x = minXY; x <= maxXY; x += boxSize + boxPadding) {
                for (var z = minXY; z <= maxXY; z += boxSize + boxPadding) {
                    for (var y = boxSize / 2; y <= maxZ; y += boxSize) {
                        var boxName = "box: " + index++;
                        var box = MeshBuilder.CreateBox(boxName, boxParams, scene);
                        box.position = new Vector3(x, y, z);
                        box.material = boxMaterial;
                        boxes.push(box);
                        if (useV2 && !useInstances) {
                            if (useAggregate) {
                                const aggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, boxImpostorParams, scene);
                                if (useViewer) {
                                    physicsViewer.showBody(box.physicsBody!);
                                }
                                // Store the aggregate so we can dispose of it later
                                box.metadata = { aggregate };
                            } else {
                                const body = new PhysicsBody(box, PhysicsMotionType.DYNAMIC, false, scene);
                                body.shape = (boxesPhysicShape);
                                body.setMassProperties({
                                    mass: boxSize,
                                });
                                if (useViewer) {
                                    physicsViewer.showBody(body);
                                }
                            }
                        } else if (!useV2) {
                            box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, boxImpostorParams, scene);
                            if (useViewer) {
                                physicsViewer.showImpostor(box.physicsImpostor);
                            }
                        } else if (useInstances) {
                            //baseMatrix.setTranslationFromFloats(x, y, z);
                            // baseBox.thinInstanceAdd(baseMatrix);
                            box.dispose();
                            //baseMatrixArray.push(baseMatrix.clone());
                        }
                    }
                }
            }

            if (useInstances) {
                boxes.length = 0;
                //var buffer = new Float32Array(baseMatrixArray.length*16);
                //for (let i = 0; i < baseMatrixArray.length; i++) {
                //    baseMatrixArray[i].copyToArray(buffer, i*16);
                //}
                //baseBox.thinInstanceSetBuffer("matrix", buffer);
                if (useAggregate) {
                    const aggregate = new PhysicsAggregate(baseBox, PhysicsShapeType.BOX, boxImpostorParams, scene);
                    if (useViewer) {
                        //physicsViewer.showBody(box.physicsBody);
                    }
                    // Store the aggregate so we can dispose of it later
                    //box.metadata = { aggregate };
                } else {
                    const body = new PhysicsBody(baseBox, PhysicsMotionType.DYNAMIC, false, scene);
                    body.shape = (boxesPhysicShape);
                    body.setMassProperties({
                        mass: boxSize,
                    });
                    if (useViewer) {
                        physicsViewer.showBody(body);
                    }
                }
            }
        }
        createBoxes();

        var radius = 8;
        var strength = 20;

        this.addButton(panel, "Radial Explosion", () => {
            // Radial explosion impulse/force
            var origins = [
                new Vector3(-8, 6, 0),
                new Vector3(0, 0, 0),
            ];
            for (var i = 0; i < origins.length; i++) {
                var origin = origins[i];

                setTimeout(function (origin) {
                    var event = physicsHelper.applyRadialExplosionImpulse( // or .applyRadialExplosionForce
                        origin,
                        radius,
                        strength,
                        PhysicsRadialImpulseFalloff.Linear // or BABYLON.PhysicsRadialImpulseFalloff.Constant
                    );

                    var sphere = MeshBuilder.CreateSphere("debug", { diameter: radius * 2 });
                    sphere.position = origin.clone();
                    addMaterialToMesh(sphere);

                    setTimeout(() => {
                        event!.dispose();
                        sphere.dispose();
                    }, 1500);
                    // Debug - END
                }, i * 2000 + 1000, origin);
            }
        });

        // Gravitational field
        this.addButton(panel, "Gravitational Field", () => {
            var gravitationalFieldOrigin = new Vector3(0, 6, 10);
            setTimeout(function () {
                var event = physicsHelper.gravitationalField(
                    gravitationalFieldOrigin,
                    radius,
                    strength,
                    PhysicsRadialImpulseFalloff.Linear
                );
                event!.enable();

                var sphere = MeshBuilder.CreateSphere("debug", { diameter: radius * 2 });
                sphere.position = gravitationalFieldOrigin.clone();
                addMaterialToMesh(sphere);

                setTimeout(function (sphere) {
                    event!.disable();
                    event!.dispose(); // we need to cleanup/dispose, after we don't use the data anymore
                    sphere.dispose();
                }, 3000, sphere);
                // Debug - END
            }, 1000);
        });


        // Updraft
        this.addButton(panel, "Updraft", () => {
            var updraftOrigin = new Vector3(10, 0, 10);
            setTimeout(function () {
                var event = physicsHelper.updraft(
                    updraftOrigin,
                    12,
                    2,
                    20
                );
                event!.enable();

                var cylinder = MeshBuilder.CreateCylinder("debug", {
                    height: 20,
                    diameter: 24
                });
                cylinder.position = updraftOrigin.add(new Vector3(0, 10, 0));
                addMaterialToMesh(cylinder);

                setTimeout(function (cylinder) {
                    event!.disable();
                    event!.dispose(); // we need to cleanup/dispose, after we don't use the data anymore
                    cylinder.dispose();
                }, 2000, cylinder);
                // Debug - END
            }, 1000);
        });


        // Vortex
        this.addButton(panel, "Vortex", () => {
            var vortexOrigin = new Vector3(0, -8, 8);
            setTimeout(function () {
                var event = physicsHelper.vortex(
                    vortexOrigin,
                    20,
                    40,
                    30
                );
                event!.enable();

                var cylinder = MeshBuilder.CreateCylinder("debug", {
                    height: 30,
                    diameter: 40
                });
                cylinder.position = vortexOrigin.add(new Vector3(0, 15, 0));
                addMaterialToMesh(cylinder);

                setTimeout(function (cylinder) {
                    event!.disable();
                    event!.dispose(); // we need to cleanup/dispose, after we don't use the data anymore
                    cylinder.dispose();
                }, 10000, cylinder);
                // Debug - END
            }, 1000);
        });


        // Helpers
        function addMaterialToMesh(sphere : Mesh) {
            var sphereMaterial = new StandardMaterial("sphereMaterial", scene);
            sphereMaterial.alpha = 0.5;
            sphere.material = sphereMaterial;
        }


        function restartScene() {
            console.log('restart scene');
            // if (useHelper) {
            if (physicsViewer) {
                physicsViewer.dispose();
                //physicsViewer = null;
            }
            // }
            let numDisposed = 0;
            if (baseBox) {
                baseBox.dispose();
            }
            for (const mesh of boxes) {
                // Check if it's a box mesh
                if (mesh.name.startsWith("box")) {
                    // console.log('disposing mesh', mesh.name);
                    // dispose of aggregate
                    if (mesh.metadata && mesh.metadata.aggregate) {
                        // console.log('aggregate dispose');
                        mesh.metadata.aggregate.dispose();
                        mesh.metadata.aggregate = null;
                    } else {
                        // console.log('body dispose');
                        if (mesh.physicsBody) {
                            mesh.physicsBody.dispose();
                        }
                    }
                    // dispose of mesh
                    mesh.dispose();
                    numDisposed++;
                }
            }
            console.log('disposed', numDisposed, 'meshes');
            boxes.length = 0;
            // recreate viewer
            if (useViewer) {
                //physicsViewer = new Debug.PhysicsViewer(scene);
            }
            // recreate boxes
            createBoxes();
        }
        this.addButton(panel, "Restart scene", restartScene);
        return scene;
    };

    createCameraAndLight = (scene: Scene, canvas: HTMLCanvasElement, cameraPosition: Vector3, lightPosition: Vector3) => {
        // This creates and positions a free camera (non-mesh)
        var camera = new FreeCamera("camera1", cameraPosition, scene);
        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", lightPosition, scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
    };

    simpleShapeScene = async (scene: Scene, canvas: HTMLCanvasElement) => {
        let cameraPosition: Vector3 = new Vector3(0, 3, -15);
        let lightPosition: Vector3 = new Vector3(0, 1, 0);
        this.createCameraAndLight(scene, canvas, cameraPosition, lightPosition);

        // initialize plugin
        const havokInstance = await HavokPhysics();
        const hk = new HavokPlugin(true, havokInstance);
        // enable physics in the scene with a gravity
        scene.enablePhysics(new Vector3(0, -9.8, 0), hk);
        
        let shapeSphere = new PhysicsShapeSphere(
            new Vector3(0, 0, 0),
            1,
            scene
        );
        
        let shapeBox = new PhysicsShapeBox(
            new Vector3(0, 0, 0),
            new Quaternion(0, 0, 0, 1),
            new Vector3(1, 1, 1),
            scene
        );

        
        // Our built-in 'sphere' shape.
        var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
        // Move the sphere upward at 4 units
        sphere.position.y = 4;
        // Our built-in 'ground' shape.
        var ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);

        // Create a sphere shape and the associated body. Size will be determined automatically.
        var sphereAggregate = new PhysicsAggregate(sphere, shapeSphere, { mass: 1, restitution:0.75}, scene);
        // Create a static box shape.
        //var groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);
        var groundAggregate = new PhysicsAggregate(ground, shapeBox, { mass: 0 }, scene);
        
        return scene;
    };

    createLabel = (scene: Scene, position: Vector3, text: string) => {
        var dynamicTexture = new DynamicTexture(
            "dynamicTexture" + text,
            512,
            scene,
            true
        );
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(
            text,
            null,
            null,
            "32px Arial",
            "white",
            "transparent"
        );
    
        var plane = MeshBuilder.CreatePlane("label" + text, {size: 2}, scene);
        plane.scaling.scaleInPlace(3);
        plane.position.copyFrom(position);
        plane.position.y += 2.5;
        plane.position.x += 1.4;
        plane.rotation.z += 1;
        plane.material = new PBRMaterial("material" + text, scene);
        (plane.material as PBRMaterial).unlit = true;
        plane.material.backFaceCulling = false;
        (plane.material as PBRMaterial).albedoTexture = dynamicTexture;
        (plane.material as PBRMaterial).useAlphaFromAlbedoTexture = true;
    };

    createBoxes = (size: int, numBoxes: int, startAsleep: boolean, pos: Vector3, yOffset: int, scene: Scene) => {
        for (let i = 0; i < numBoxes; i++) {
            var box = MeshBuilder.CreateBox("box", {size }, scene);
            box.material = new StandardMaterial("boxMat", scene);
            (box.material as StandardMaterial).diffuseColor = Color3.Random();
            box.position = pos.clone();
            box.position.y += i * (yOffset + size) + 0.5;
            new PhysicsAggregate(box, PhysicsShapeType.BOX, { mass: 1, startAsleep }, scene);
        }
    }

    sleepMode = async (scene: Scene, canvas: HTMLCanvasElement) => {
        // This creates and positions a free camera (non-mesh)
        var camera = new FreeCamera("camera1", new Vector3(0, 3, -15), scene);
        // This targets the camera to scene origin
        camera.setTarget(new Vector3(0, 3, 0));
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.9;

        // Our built-in 'ground' shape.
        var ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);

        // initialize plugin
        const havokInstance = await HavokPhysics();
        const hk = new HavokPlugin(true, havokInstance);
        // enable physics in the scene with a gravity
        scene.enablePhysics(new Vector3(0, -1, 0), hk);

        // Create a static box shape.
        var groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

        var boxesSize = 1;
        var boxesHeight = 3;
        var yOffset = 0.5;

        // Create boxes that start in sleep mode
        this.createBoxes(boxesSize, boxesHeight, true, new Vector3(-2, 0, 0), yOffset, scene);
        this.createLabel(scene, new Vector3(-3, 3, 0), "Start asleep");
        // Create boxes that start awake
        this.createBoxes(boxesSize, boxesHeight, false, new Vector3(2, 0, 0), yOffset, scene);
        this.createLabel(scene, new Vector3(1, 3, 0), "Start awake");
        var ui = AdvancedDynamicTexture.CreateFullscreenUI("ui");
        var btn = Button.CreateSimpleButton("btn", "Drop object on towers");
        btn.widthInPixels = 300;
        btn.heightInPixels = 40;
        btn.background = "green";
        btn.color = "white";
        btn.top = "-40%";
        btn.onPointerClickObservable.add(() => {
            this.createBoxes(0.2, 1, false, new Vector3(-2, 5, 0), 0, scene);
            this.createBoxes(0.2, 1, false, new Vector3(2, 5, 0), 0, scene);
        });
        ui.addControl(btn);
        return scene;
    };

    simpleFallingSphere =async (scene: Scene, canvas: HTMLCanvasElement) => {
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
        // Move the sphere upward at 4 units
        sphere.position.y = 4;
        // Our built-in 'ground' shape.
        var ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);

        // initialize plugin
        const havokInstance = await HavokPhysics();
        const hk = new HavokPlugin(true, havokInstance);
        // enable physics in the scene with a gravity
        scene.enablePhysics(new Vector3(0, -9.8, 0), hk);

        // Create a sphere shape and the associated body. Size will be determined automatically.
        var sphereAggregate = new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1, restitution:0.75}, scene);
        // Create a static box shape.
        var groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

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

export default new PhysicsEngine();