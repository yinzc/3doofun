import { Control } from '@babylonjs/gui';
import { AdvancedDynamicTexture, TextBlock } from '@babylonjs/gui';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Color3, DirectionalLight, MeshBuilder, StandardMaterial, CubeTexture, Texture, SceneLoader, AnimationGroup, ActionManager, ExecuteCodeAction} from "@babylonjs/core";
import "@babylonjs/loaders";
import { CreateSceneClass } from "../createScene";

export class AnimatingCharacters implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        // 注意：如果你想在这里使用 Babylon.js Inspector，你需要在这里禁用离线支持
        engine.enableOfflineSupport = false;
        var scene = new Scene(engine);
        this.showDebug(scene);

        var arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 2, Math.PI / 4, 10, new Vector3(0, -5, 0), scene);
        scene.activeCamera = arcRotateCamera;
        scene.activeCamera.attachControl(canvas, true);
        arcRotateCamera.lowerRadiusLimit = 5;
        arcRotateCamera.upperRadiusLimit = 10;
        arcRotateCamera.wheelDeltaPercentage = 0.01;
        
        // Light 
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.6;
        hemisphericLight.specular = Color3.Black();

        var directionalLight = new DirectionalLight("directionalLight", new Vector3(0, -0.5, -1.0), scene);
        directionalLight.position = new Vector3(0, 5, 5);

        // Skybox
        var skybox = MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
        var skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox2", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        // UI
        var advancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var textBlock = new TextBlock();
        textBlock.text =  "Move w/ WASD keys, B for Samba, look with the mouse";
        textBlock.color = "white";
        textBlock.fontSize = 24;
        textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        textBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        advancedDynamicTexture.addControl(textBlock);

        // Ground
        var ground = MeshBuilder.CreateGround("ground", {width: 50, height: 50, subdivisions: 4}, scene);
        var groundMaterial = new StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new Texture("https://playground.babylonjs.com/textures/wood.jpg", scene);
        groundMaterial.diffuseTexture.scale(30);
        groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
        ground.material = groundMaterial;

        var inputMap: any = {};
        scene.actionManager = new ActionManager(scene);
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            
        }));
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));

        SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "HVGirl.glb", scene, function (newMeshes, particleSystem, skeletons, animationGroup) {
            var hero = newMeshes[0];
            hero.scaling.scaleInPlace(0.1);
            arcRotateCamera.target = hero.position;
            var heroSpeed = 0.03;
            var heroSpeedBackwards = 0.01;
            var heroRotationSpeed = 0.1;

            var animating = true;
            var walkAnim = scene.getAnimationGroupByName("Walking");
            var walkBackAnim = scene.getAnimationGroupByName("WalkingBack");
            var idleAnim = scene.getAnimationGroupByName("Idle");
            var sambaAnim = scene.getAnimationGroupByName("Samba") as AnimationGroup;
            // Rendering loop (executed for everyframe)
            scene.onBeforeRenderObservable.add(() => {
                // Manage the movements of the character (e.g. position, direction, etc.)
                var keydown: boolean = false;
                if (inputMap["w"]) {
                    hero.moveWithCollisions(hero.forward.scaleInPlace(heroSpeed));
                    keydown = true;
                }
                if (inputMap["s"]) {
                    hero.moveWithCollisions(hero.forward.scaleInPlace(-heroSpeedBackwards));
                    keydown = true;
                }
                if (inputMap["a"]) {
                    hero.rotate(Vector3.Up(), -heroRotationSpeed);
                    keydown = true;
                }
                if (inputMap["d"]) {
                    hero.rotate(Vector3.Up(), heroRotationSpeed);
                    keydown = true;
                }
                if (inputMap["b"]) {
                    keydown = true;
                }
                
                // Manage animations to be played
                if (keydown) {
                    if (!animating) {
                        animating = true;
                        if (inputMap["s"]) {
                            // Walk Back
                            walkBackAnim?.start(true, 1.0, walkBackAnim.from, walkBackAnim.to, false);
                        }
                        else if (inputMap["b"]) {
                            // Samba
                            walkAnim?.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
                        }
                        else {
                            // Walk
                            walkAnim?.start(true, 1.0, walkAnim.from, walkAnim.to, false);
                        }
                    }
                } else {
                    if (animating) {
                        // Default animation is idle when no key is down
                        idleAnim?.start(true, 1.0, idleAnim.from, idleAnim.to, false);

                        // Stop all animations besides idle Anim when no key is down
                        sambaAnim?.stop();
                        walkAnim?.stop();
                        walkBackAnim?.stop();

                        // Ensure animation are played only once per rendering loop
                        animating = false;
                    }
                }
            });

            sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
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

export default new AnimatingCharacters();