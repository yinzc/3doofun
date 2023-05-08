import { AmmoJSPlugin } from '@babylonjs/core/Physics/Plugins/ammoJSPlugin';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, PointLight, MeshBuilder, StandardMaterial, Color3, Animation, DirectionalLight, ShadowGenerator, SceneLoader, AnimationGroup, Scalar, CircleEase, EasingFunction, BezierCurveEase, FreeCamera, PhysicsImpostor} from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, Control, TextBlock, Slider, Button } from "@babylonjs/gui";
import "@babylonjs/loaders";
import { CreateSceneClass } from "../createScene";

export class AdvancedAnimatingMethods implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        let scene = new Scene(engine);
        //this.showDebug(scene);
        //Create a scaling animation at 30 FPS
        //scene = this.animationsAndPromises(canvas, scene);
        //scene = this.animationEvaluateExample(canvas, scene, engine);
        //scene = this.clickToBlendAnimation(canvas, scene);
        //scene = this.blendingAnimationTogether(canvas, scene);
        //scene = this.additiveAnimationExample(canvas, scene);
        //scene = this.easingBehaviorExamples(canvas, scene);
        //scene = this.loggingStepIdForSphere(canvas, scene);
        scene = this.renderLoopAnimation(canvas, scene);
        return scene;
    };

    renderLoopAnimation = (canvas: HTMLCanvasElement, scene: Scene) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 5, -10), scene);
        freeCamera.setTarget(Vector3.Zero());
        freeCamera.attachControl(canvas, true);
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.7;
        var box = MeshBuilder.CreateBox("box", {size: 1}, scene);
        var direction = true;
        scene.registerBeforeRender(() => {
            if (box.position.x < 2 && direction) {
                box.position.x += 0.05;
            } else {
                direction = false;
            }
            if (box.position.x > -2 && !direction) {
                box.position.x -= 0.05;
            } else {
                direction = true;
            }
        });
        return scene;   
    }

    loggingStepIdForSphere = (canvas: HTMLCanvasElement, scene: Scene) => {
        var physicsEngine = new AmmoJSPlugin(false);
        //var pyhsicsEngine = new PhysicsEngine(new Vector3(0, -9.81, 0),cannonJSplugin);
        scene.enablePhysics(new Vector3(0, -9.81, 0), physicsEngine);
        physicsEngine.setTimeStep(1 / 60);

        // This creates and positions a free camera(non-mesh)
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 5, -10), scene);
        // This targets the camera to scene origin
        freeCamera.setTarget(Vector3.Zero());
        // This attaches the camera to the canvas
        freeCamera.attachControl(canvas, true);
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        hemisphericLight.intensity = 0.7;
        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        var sphere = MeshBuilder.CreateSphere("sphere", {segments: 16, diameter: 2}, scene);
        sphere.position.y = 4;
        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        var ground = MeshBuilder.CreateGround("ground", {width: 15, height: 10, subdivisions: 2}, scene);

        var box = MeshBuilder.CreateBox("box", {height: 2, width: 2, depth: 2}, scene);
        box.position.x = -3;
        box.position.y = 0.5;
        box.position.z = 0.3;
        var materialBox = new StandardMaterial("materialBox", scene);
        materialBox.emissiveColor = new Color3(0, 0, 1);
        box.material = materialBox;

        new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, { mass: 8, restitution: 0.9 }, scene);
        new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
        scene.onBeforeStepObservable.add((theScene) => {
            console.log("StepId: " + theScene.getStepId());
            box.rotation.y += 0.05;
        });
        scene.onAfterStepObservable.add((theScene)=>{
            console.log("StepId: " + theScene.getStepId());
            //if(sphere.physicsImpostor!.getLinearVelocity()!.length() < PhysicsEngine.Epsilon){
            if(sphere.physicsImpostor!.getLinearVelocity()!.length()){
                console.log("Sphere is at rest on stepId: " + theScene.getStepId());
                console.log("box rotation.y is : " + box.rotation.y);
                theScene.onAfterStepObservable.clear();
                theScene.onBeforeStepObservable.clear();
            }
        });
        return scene;
    };

    easingBehaviorExamples = (canvas: HTMLCanvasElement, scene: Scene) => {
        var pointLigth = new PointLight("pointLight", new Vector3(0, 100, 100), scene);
        var arcRotateCamera = new ArcRotateCamera("arcRotateCamera", 0, 0.8, 100, Vector3.Zero(), scene);
        arcRotateCamera.attachControl(canvas, true);
        // Torus
        var torus = MeshBuilder.CreateTorus("torus", {diameter: 8, thickness: 2, tessellation: 32}, scene);
        torus.position.x = 25;
        torus.position.z = 30;
        var materialBox = new StandardMaterial("materialBox", scene);
        materialBox.diffuseColor = new Color3(0, 1, 0);
        // Crate a Vector3 animation at 30 FPS
        var animationTorus = new Animation("animationTorus", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
        // the torus destination position
        var nextPosition = torus.position.add(new Vector3(-80, 0, 0));
        // Animation keys
        var keysTorus = [];
        keysTorus.push({ frame: 0, value: torus.position });
        keysTorus.push({ frame: 120, value: nextPosition });
        animationTorus.setKeys(keysTorus);
        // Adding an easing function
        // You can use :
        //1.	CircleEase()
        //2.	BackEase(amplitude)
        //3.	BounceEase(bounces, bounciness)
        //4.	CubicEase()
        //5.	ElasticEase(oscillations, springiness)
        //6.	ExponentialEase(exponent)
        //7.	PowerEase(power)
        //8.	QuadraticEase()
        //9.	QuarticEase()
        //10.	QuinticEase()
        //11.	SineEase()
        // And if you want a total control, you can use a Bezier Curve animation
        //12.   BezierCurveEase(x1, y1, x2, y2)
        var easingFunction = new CircleEase();
        // For each easing function, you can choose among EASEIN (default), EASEOUT, EASEINOUT
        easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
        // Adding easing function to my animation
        animationTorus.setEasingFunction(easingFunction);
        // Adding animation to my torus animations collection
        torus.animations.push(animationTorus);
        // Finally, launch animations on torus, from key 0 to key 120 with loop activated
        scene.beginAnimation(torus, 0, 120, true);

        // Using Bezier Curve to create a custom easing function
        // See here to see some samples and values: http://cubic-bezier.com
        
        var bezierTorus = MeshBuilder.CreateTorus("bezierTorus", {diameter: 8, thickness: 2, tessellation: 32}, scene);
        bezierTorus.position.x = 25;
        bezierTorus.position.z = 0;

        // Create the animation
        var animationBezierTorus = new Animation("animationBezierTorus", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
        var keysBezierTorus = [];
        keysBezierTorus.push({ frame: 0, value: bezierTorus.position });
        keysBezierTorus.push({ frame: 120, value: bezierTorus.position.add(new Vector3(-80, 0, 0)) });
        animationBezierTorus.setKeys(keysBezierTorus);
        var bezierEasingFunction = new BezierCurveEase(0.32, -0.73, 0.69, 1.59);
        animationBezierTorus.setEasingFunction(bezierEasingFunction);
        bezierTorus.animations.push(animationBezierTorus);
        scene.beginAnimation(bezierTorus, 0, 120, true);

        // Create a simple animation without easing functions
        var simpleTorus = MeshBuilder.CreateTorus("simpleTorus", {diameter: 8, thickness: 2, tessellation: 32}, scene);
        simpleTorus.position.x = 25;
        simpleTorus.position.z = -30;
        simpleTorus.material = materialBox;
        Animation.CreateAndStartAnimation("simpleTorusAnimation", simpleTorus, "position", 30, 120, simpleTorus.position, simpleTorus.position.add(new Vector3(-80, 0, 0)), Animation.ANIMATIONLOOPMODE_CYCLE);
        return scene;
    };

    additiveAnimationExample = (canvas: HTMLCanvasElement, scene: Scene) => {
        let engin = scene.getEngine();
        engin.enableOfflineSupport = false;
        engin.displayLoadingUI();
        //Camera
        var arcRotateCamera = new ArcRotateCamera("arcRotateCamera", Math.PI / 2, Math.PI / 4, 3, new Vector3(0, 1, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        arcRotateCamera.lowerRadiusLimit = 2;
        arcRotateCamera.upperRadiusLimit = 10;
        arcRotateCamera.wheelPrecision = 0.01;
        // Lights
        let hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.6;
        hemisphericLight.specular = Color3.Black();
        let directionalLight = new DirectionalLight("directionalLight", new Vector3(0, -0.5, -1), scene);
        directionalLight.position = new Vector3(0, 5, 5);
        // Shadow
        let shadowGenerator = new ShadowGenerator(1024, directionalLight);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;
        // Model by Mixamo
        SceneLoader.ImportMesh("", "https://playground.babylonjs.com/scenes/", "Xbot.glb", scene, function (newMeshes) {
            shadowGenerator.addShadowCaster(scene.meshes[0], true);
            for (let index = 0; index < newMeshes.length; index++) {
                newMeshes[index].receiveShadows = false;
            }
            let helper = scene.createDefaultEnvironment({
                enableGroundShadow: true
            });
            helper!.setMainColor(Color3.Gray());
            helper!.ground!.position.y += 0.01;
            // Initalize override animations, turn on idle by default
            let idleAnim = scene.animationGroups.find(a => a.name === "idle");
            let idleParam = { name: "Idle", anim: idleAnim, weight: 1 };
            idleAnim?.play(true);
            idleAnim?.setWeightForAllAnimatables(1);
            let walkAnim = scene.animationGroups.find(a => a.name === "walk");
            let walkParam = { name: "Walk", anim: walkAnim, weight: 0 };
            walkAnim?.play(true);
            walkAnim?.setWeightForAllAnimatables(0);
            let runAnim = scene.animationGroups.find(a => a.name === "run");
            let runParam = { name: "Run", anim: runAnim, weight: 0 };
            runAnim?.play(true);
            runAnim?.setWeightForAllAnimatables(0);
            // Initialize additive poses. Slice of reference pose at first frame
            let sadPoseAnim = AnimationGroup.MakeAnimationAdditive(scene.animationGroups.find(a => a.name === 'sad_pose')!);
            let sadPoseParam = { name: "Sad Pose", anim: sadPoseAnim, weight: 0 };
            sadPoseAnim.start(true, 1, 0.03333333507180214 * 60, 0.03333333507180214 * 60);

            let sneakPoseAnim = AnimationGroup.MakeAnimationAdditive(scene.animationGroups.find(a => a.name === 'sneak_pose')!);
            let sneakPoseParam = { name: "Sneak Pose", anim: sneakPoseAnim, weight: 0 };
            sneakPoseAnim.start(true, 1, 0.03333333507180214 * 60, 0.03333333507180214 * 60);

            // Initialize additive animations
            let headShakeAnim = AnimationGroup.MakeAnimationAdditive(scene.animationGroups.find(a => a.name === 'headShake')!);
            let headShakeParam = { name: "Head Shake", anim: headShakeAnim, weight: 0 };
            headShakeAnim.play(true);

            let agreeAnim = AnimationGroup.MakeAnimationAdditive(scene.animationGroups.find(a => a.name === 'agree')!);
            let agreeParam = { name: "Agree", anim: agreeAnim, weight: 0 };
            agreeAnim.play(true);

            // UI
            let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
            let uiPanel = new StackPanel();
            uiPanel.width = "220px";
            uiPanel.fontSize = "14px";
            uiPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            uiPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
            advancedTexture.addControl(uiPanel);

            // Keep track of the current override animation
            let currentParam = idleParam;

            function onBeforeAnimation() {
                // Increment the weight of the current animation
                if (currentParam) {
                    currentParam.weight = Scalar.Clamp(currentParam.weight + 0.01, 0, 1);
                    currentParam.anim?.setWeightForAllAnimatables(currentParam.weight);
                }
                // Decrement the weight of all override animations that aren't current
                if (currentParam !== idleParam) {
                    idleParam.weight = Scalar.Clamp(idleParam.weight - 0.01, 0, 1);
                    idleParam.anim?.setWeightForAllAnimatables(idleParam.weight);
                }
                if (currentParam !== walkParam) {
                    walkParam.weight = Scalar.Clamp(walkParam.weight - 0.01, 0, 1);
                    walkParam.anim?.setWeightForAllAnimatables(walkParam.weight);
                }
                if (currentParam !== runParam) {
                    runParam.weight = Scalar.Clamp(runParam.weight - 0.01, 0, 1);
                    runParam.anim?.setWeightForAllAnimatables(runParam.weight);
                }

                // Remove the callback the current animation weight reaches 1 or 
                // when all override animations reach 0 when current is undefined
                if ((currentParam && currentParam.weight === 1) || (idleParam.weight === 0 && walkParam.weight === 0 && runParam.weight === 0)) {
                    scene.onBeforeAnimationsObservable.removeCallback(onBeforeAnimation);
                }
            };
            // Button for blending to bind pose
            let buttonNone = Button.CreateSimpleButton("buttonNone", "None");
            buttonNone.paddingTop = "10px";
            buttonNone.width = "100px";
            buttonNone.height = "50px";
            buttonNone.color = "white";
            buttonNone.background = "green";
            buttonNone.onPointerDownObservable.add(() => {
                // Remove current animation
                currentParam = {name: "", anim: undefined, weight: 0};
                // Restart animation observer
                scene.onBeforeAnimationsObservable.removeCallback(onBeforeAnimation);
                scene.onBeforeAnimationsObservable.add(onBeforeAnimation);
            });
            uiPanel.addControl(buttonNone);

            // Button for blending to idle
            var buttonIdle = Button.CreateSimpleButton("buttonIdle", "Idle");
            buttonIdle.paddingTop = "10px";
            buttonIdle.width = "100px";
            buttonIdle.height = "50px";
            buttonIdle.color = "white";
            buttonIdle.background = "green";
            buttonIdle.onPointerDownObservable.add(() => {
                // Do nothing if idle is already current animation
                if (currentParam === idleParam) {
                    return;
                }
                // Restart animation observer with walk set to current
                scene.onBeforeAnimationsObservable.removeCallback(onBeforeAnimation);
                currentParam = idleParam;
                scene.onBeforeAnimationsObservable.add(onBeforeAnimation);
            });
            uiPanel.addControl(buttonIdle);

            // Button for blending to walk
            var buttonWalk = Button.CreateSimpleButton("buttonWalk", "Walk");
            buttonWalk.paddingTop = "10px";
            buttonWalk.width = "100px";
            buttonWalk.height = "50px";
            buttonWalk.color = "white";
            buttonWalk.background = "green";
            buttonWalk.onPointerDownObservable.add(() => {
                // Do nothing if walk is already current animation
                if (currentParam === walkParam) {
                    return;
                }
                // Synchronize animations
                if (currentParam) {
                    walkParam.anim?.syncAllAnimationsWith(null);
                    currentParam.anim?.syncAllAnimationsWith(walkParam.anim!.animatables[0]);
                }
                // Restart animation observer with walk set to current
                scene.onBeforeAnimationsObservable.removeCallback(onBeforeAnimation);
                currentParam = walkParam;
                scene.onBeforeAnimationsObservable.add(onBeforeAnimation);
            });
            uiPanel.addControl(buttonWalk);

            // Button for blending to run
            var buttonRun = Button.CreateSimpleButton("buttonRun", "Run");
            buttonRun.paddingTop = "10px";
            buttonRun.width = "100px";
            buttonRun.height = "50px";
            buttonRun.color = "white";
            buttonRun.background = "green";
            buttonRun.onPointerDownObservable.add(() => {
                // Do nothing if run is already current animation
                if (currentParam === runParam) {
                    return;
                }
                // Synchronize animations
                if (currentParam) {
                    runParam.anim?.syncAllAnimationsWith(null);
                    currentParam.anim?.syncAllAnimationsWith(runParam.anim!.animatables[0]);
                }
                // Restart animation observer with run set to current
                scene.onBeforeAnimationsObservable.removeCallback(onBeforeAnimation);
                currentParam = runParam;
                scene.onBeforeAnimationsObservable.add(onBeforeAnimation);
            });
            uiPanel.addControl(buttonRun);

            // Create a slider to control the weight of each additive pose/animation
            var params = [sadPoseParam, sneakPoseParam, headShakeParam, agreeParam];
            params.forEach((param) => {
                // Label
                var header = new TextBlock();
                header.text = param.name + ":" + param.weight.toFixed(2);
                header.height = "40px";
                header.color = "green";
                header.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
                header.paddingTop = "10px";
                uiPanel.addControl(header);

                // Slider
                var slider = new Slider();
                slider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                slider.minimum = 0;
                slider.maximum = 1;
                slider.color = "green";
                slider.value = param.weight
                slider.height = "20px";
                slider.width = "205px";
                uiPanel.addControl(slider);

                // Update animation weight value according to slider value
                slider.onValueChangedObservable.add((value) => {
                    param.anim.setWeightForAllAnimatables(value);
                    param.weight = value;
                    header.text = param.name + ":" + param.weight.toFixed(2);
                });
                slider.value = param.weight;
            });
            engin.hideLoadingUI();
        }, function(){});
        return scene;
    }

    blendingAnimationTogether = (canvas: HTMLCanvasElement, scene: Scene) => {
        var engin = scene.getEngine();
        //engin.enableOfflineSupport = false;
        Animation.AllowMatricesInterpolation = true;
        var arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 2, Math.PI / 4, 3, new Vector3(0, 1, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        arcRotateCamera.lowerRadiusLimit = 2;
        arcRotateCamera.upperRadiusLimit = 10;
        arcRotateCamera.wheelPrecision = 0.01;
  
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.6;
        hemisphericLight.specular = Color3.Black();

        var directionalLight = new DirectionalLight("directionalLight", new Vector3(0, -0.5, -1), scene);
        directionalLight.position = new Vector3(0, 5, 5);

        var shadowGenerator = new ShadowGenerator(1024, directionalLight);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;

        //engin.displayLoadingUI();

        SceneLoader.ImportMesh("", "https://playground.babylonjs.com/scenes/", "dummy2.babylon", scene, function (newMeshes, particleSystem, skeletons) {
            var skeleton = skeletons[0];
            shadowGenerator.addShadowCaster(scene.meshes[0], true);
            for (let index = 0; index < newMeshes.length; index++) {
                newMeshes[index].receiveShadows = false;
            }
            var helper = scene.createDefaultEnvironment({
                enableGroundShadow: true
            });
            helper!.setMainColor(Color3.Gray());
            helper!.ground!.position.y += 0.01;

            var idleAnim = scene.beginWeightedAnimation(skeleton, 0, 89, 1.0, true);
            var walkAnim = scene.beginWeightedAnimation(skeleton, 90, 118, 0.0, true);
            var runAnim = scene.beginWeightedAnimation(skeleton, 119, 135, 0.0, true);

            //UI
            var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
            var uiPanel = new StackPanel();
            uiPanel.width = "220px";
            uiPanel.fontSize = "14px";
            uiPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            uiPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
            advancedTexture.addControl(uiPanel);
            var params = [
                { name: "Idle", anim: idleAnim },
                { name: "Walk", anim: walkAnim },
                { name: "Run", anim: runAnim }
            ]
            params.forEach((param) => {
                var header = new TextBlock();
                header.text = param.name + ":" + param.anim.weight.toFixed(2);
                header.height = "40px";
                header.color = "white";
                header.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                header.paddingTop = "10px";
                uiPanel.addControl(header);
                var slider = new Slider();
                slider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                slider.minimum = 0;
                slider.maximum = 1;
                slider.color = "white";
                slider.value = param.anim.weight;
                slider.height = "20px";
                slider.width = "205px";
                uiPanel.addControl(slider);
                slider.onValueChangedObservable.add((value) => {
                    param.anim.weight = value;
                    header.text = param.name + ":" + param.anim.weight.toFixed(2);
                });
                //param.anim._slider = slider;
            });

            var button = Button.CreateSimpleButton("button", "From idle to walk");
            button.paddingTop = "10px";
            button.width = "100px";
            button.height = "50px";
            button.color = "green";
            button.background = "white";
            button.onPointerDownObservable.add(() => {
              walkAnim.syncWith(null);
              idleAnim.syncWith(walkAnim);
              let obs = scene.onBeforeAnimationsObservable.add(() => {
                if (walkAnim.weight >= 1) {
                  scene.onBeforeAnimationsObservable.remove(obs);
                  idleAnim.stop();
                }
              });
            });
            uiPanel.addControl(button);

            button = Button.CreateSimpleButton("button", "From walk to run");
            button.paddingTop = "10px";
            button.width = "100px";
            button.height = "50px";
            button.color = "green";
            button.background = "white";
            button.onPointerDownObservable.add(() => {
                walkAnim.syncWith(runAnim);
                let obs = scene.onBeforeAnimationsObservable.add(() => {
                    if (runAnim.weight >= 1) {
                        scene.onBeforeAnimationsObservable.remove(obs);
                        walkAnim.stop();
                    }
                });
            });
            uiPanel.addControl(button);
            engin.hideLoadingUI();
        }, function(evt) {});
        return scene;
    }

    clickToBlendAnimation = (canvas: HTMLCanvasElement, scene: Scene) => {
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", 0, 0.8, 100, Vector3.Zero(), scene);
        arcRotateCamera.attachControl(canvas, true);
        var pointLight = new PointLight("pointLight", new Vector3(0, 100, 100), scene);
        
        var box = MeshBuilder.CreateBox("box", {size: 10}, scene);
        var materialBox = new StandardMaterial("materialBox", scene);
        materialBox.diffuseColor = new Color3(0, 1, 0);
        box.material = materialBox;
        //Creation of a basic animation with box 1
        var animationBox = new Animation("animationBox", "position.z", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        // Animation keys
        var keys = [];
        keys.push({
            frame: 0,
            value: 0
        });
        keys.push({
            frame: 30,
            value: 20
        });
        keys.push({
            frame: 60,
            value: 0
        });
        animationBox.setKeys(keys);
        box.animations.push(animationBox);
        scene.beginAnimation(box, 0, 100, true);

        // Blending animation   
        var animation2Box = new Animation("animation2Box", "position.z", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        animation2Box.enableBlending = true;
        animation2Box.blendingSpeed = 0.01;
        // Animation keys
        var keys2 = [];
        keys2.push({
            frame: 0,
            value: 0
        });
        keys2.push({
            frame: 30,
            value: 20
        });
        keys2.push({
            frame: 60,
            value: 0
        });
        animation2Box.setKeys(keys2);
        
        var runtimeAnimation;
        scene.onPointerDown = function (evt, pickResult) {
            if (pickResult.pickedMesh) {
                runtimeAnimation = scene.beginDirectAnimation(box, [animation2Box], 0, 60, false);
            }
        };
        return scene;
    }

    animationEvaluateExample = (canvas: HTMLCanvasElement, scene: Scene, engine: Engine ) => {
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", 0, 0.8, 100, Vector3.Zero(), scene);
        arcRotateCamera.attachControl(canvas, true);
        var pointLight = new PointLight("pointLight", new Vector3(0, 100, 100), scene);
        var box = MeshBuilder.CreateBox("box", {size: 10}, scene);

        var materialBox = new StandardMaterial("materialBox", scene);
        materialBox.diffuseColor = new Color3(0, 1, 0);
        box.material = materialBox;
        //Create a scaling animation at 30 FPS
        var animationBox = new Animation("animationBox", "scaling.x", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
         // Animation keys
        var keys = [];
        //At the animation key 0, the value of scaling is "1"
        keys.push({
            frame: 0,
            value: 1
        });

        //At the animation key 20, the value of scaling is "0.2"
        keys.push({
            frame: 20,
            value: 0.2
        });

        //At the animation key 100, the value of scaling is "1"
        keys.push({
            frame: 100,
            value: 1
        });

        //Adding keys to the animation object
        animationBox.setKeys(keys);
        //Then add the animation object to box.animations
        box.animations.push(animationBox);
        //Finally, launch animations on box, from key 0 to key 100 with loop activated
        scene.beginAnimation(box, 0, 100, true);
        let t = 0;
        scene.onBeforeRenderObservable.add(() => {
            t += engine.getDeltaTime() / 1000;
            let d = Math.sin(t) * 30;
            console.log(animationBox.evaluate(d));
        });
        return scene;
    }

    animationsAndPromises = (canvas: HTMLCanvasElement, scene: Scene) => {
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", 0, 0.8, 100, Vector3.Zero(), scene);
        arcRotateCamera.attachControl(canvas, true);
        var pointLight = new PointLight("pointLight", new Vector3(0, 100, 100), scene);
        var box = MeshBuilder.CreateBox("box", {size: 10}, scene);

        var materialBox = new StandardMaterial("materialBox", scene);
        materialBox.diffuseColor = new Color3(0, 1, 0);
        box.material = materialBox;
        //Create a scaling animation at 30 FPS
        var animationBox = new Animation("animationBox", "scaling.x", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        //Animation keys
        var keys = [];
        //At the animation key 0, the value of scaling is "1"
        keys.push({
            frame: 0,
            value: 1
        });
        //At the animation key 20, the value of scaling is "0.2"
        keys.push({
            frame: 20,
            value: 0.2
        });
        //At the animation key 100, the value of scaling is "1"
        keys.push({
            frame: 100,
            value: 1
        });
        //Add these keys to the animation
        animationBox.setKeys(keys);
        //Finally, launch animations on your mesh, once the promise is resolved
        box.animations.push(animationBox);
        setTimeout(async () => {
            var anim = scene.beginAnimation(box, 0, 100, false);
            console.log("before anim");
            await anim.waitAsync();
            console.log("after anim");
        }, 10000);
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

export default new AdvancedAnimatingMethods();