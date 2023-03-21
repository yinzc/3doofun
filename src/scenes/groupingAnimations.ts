import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, PointLight, MeshBuilder, StandardMaterial, Color3, Animation, AnimationGroup, Mesh } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, Control, Button } from "@babylonjs/gui";
import { CreateSceneClass } from "../createScene";

export class GroupingAnimations implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);

        var pointLight = new PointLight("pointLight", new Vector3(0, 100, 100), scene);
        var arcRotateCamera = new ArcRotateCamera("arcRotateCamera", 0, 0.8, 100, Vector3.Zero(), scene);
        arcRotateCamera.attachControl(canvas, true);
        // Animation Group Example 1
        //var exampScene = this.exampleOne(scene, canvas);
        // Animation Group Example 2
        //var exampScene = this.exampleTwo(scene, canvas);
        // Animation Group Example 3
        var exampScene = this.exampleThree(scene, canvas);
        
        return exampScene;
    };
    

    exampleOne(scene: Scene, canvas: HTMLCanvasElement): Scene {
        //Boxes
        var box1 = this.createBox1(scene);
        var box2 = this.createBox2(scene);
        // Animations
        var animation1 = this.createAnimation1();
        var animation2 = this.createAnimation2();
        // Creating a group of animations
        var animationGroup = new AnimationGroup("my group");
        animationGroup.addTargetedAnimation(animation1, box1);
        animationGroup.addTargetedAnimation(animation2, box1);
        // Make sure to normalize animations to the same timeline
        animationGroup.normalize(0, 100);
        // UI
        this.createUI(animationGroup);

        return scene;
    }

    exampleTwo(scene: Scene, canvas: HTMLCanvasElement): Scene {
        //Boxes
        var box1 = this.createBox1(scene);
        var box2 = this.createBox2(scene);
        // Animations
        var animation1 = this.createAnimation1();
        var animation2 = this.createAnimation2();
        // Creating a group of animations
        var animationGroup = new AnimationGroup("my group");
        animationGroup.addTargetedAnimation(animation1, box1);
        animationGroup.addTargetedAnimation(animation2, box2);
        // Make sure to normalize animations to the same timeline
        animationGroup.normalize(0, 100);
        // UI
        this.createUI(animationGroup);

        return scene;
    }

    exampleThree(scene: Scene, canvas: HTMLCanvasElement): Scene {
        //Boxes
        var box1 = this.createBox1(scene);
        var box2 = this.createBox2(scene);
        // Animations
        var animation1 = this.createAnimation1();
        var animation2 = this.createAnimation2();
        // Creating a group of animations
        var animationGroup = new AnimationGroup("my group");
        animationGroup.addTargetedAnimation(animation1, box1);
        animationGroup.addTargetedAnimation(animation2, box1);
        animationGroup.addTargetedAnimation(animation2, box2);
        // Make sure to normalize animations to the same timeline
        animationGroup.normalize(0, 100);
        animationGroup.speedRatio = 5;
        animationGroup.onAnimationEndObservable.add(() => {
            var boxMaterial = new StandardMaterial("boxMaterial", scene);
            boxMaterial.diffuseColor = Color3.Red();
            box2.material = boxMaterial;
        });
        // UI
        this.createUI(animationGroup);

        return scene;
    }


    createBox1 = (scene: Scene) : Mesh => {
        var box1 = MeshBuilder.CreateBox("box1", { size: 10 }, scene);
        box1.position.x = -20;
        var materialBox = new StandardMaterial("materialBox", scene);
        materialBox.diffuseColor = new Color3(0, 1, 0);
        // Applying materials
        box1.material = materialBox;
        return box1;
    }

    createBox2 = (scene: Scene) : Mesh => {
        var box2 = MeshBuilder.CreateBox("box2", { size: 10 }, scene);
        var materialBox2 = new StandardMaterial("materialBox2", scene);
        materialBox2.diffuseColor = Color3.Blue();
        // Positioning box
        box2.position.x = 20;
        box2.material = materialBox2;
        return box2;
    }

    createAnimation1 = () : Animation => {
        var animation1 = new Animation("tutoAnimation", "scaling.x", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
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
        // Adding keys to my animation
        animation1.setKeys(keys);
        return animation1;
    }

    //Create a second rotation animation with different timeline
    createAnimation2 = () : Animation => {
        var animation2 = new Animation("tutoAnimation", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        // Animation keys
        var keys2 = [];
        keys2.push({
            frame: 0,
            value: 0
        });
        keys2.push({
            frame: 40,
            value: Math.PI
        });
        keys2.push({
            frame: 80,
            value: 0
        });
        animation2.setKeys(keys2);
        return animation2;
    }

    // UI
    createUI = (animationGroup: AnimationGroup) => {
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var panel = new StackPanel();
        panel.isVertical = false;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

        advancedTexture.addControl(panel);
        this.addButton(panel, "Play", function () {
            animationGroup.play(true);
        });
        this.addButton(panel, "Pause", function () {
            animationGroup.pause();
        });
        this.addButton(panel, "Stop", function () {
            animationGroup.reset();
            animationGroup.stop();
        });
    }

    addButton = function (panel: StackPanel, text: string, callback: () => void) {
        var button = Button.CreateSimpleButton("button", text);
        button.width = "140px";
        button.height = "40px";
        button.color = "white";
        button.background = "green";
        button.paddingLeft = "10px";
        button.paddingRight = "10px";
        button.onPointerUpObservable.add(function () {
            callback();
        });
        panel.addControl(button);
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

export default new GroupingAnimations();