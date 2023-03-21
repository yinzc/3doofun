import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, MeshBuilder, Animation, Mesh } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class CombineAnimations implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        var scene = new Scene(engine);
        //this.showDebug(scene);
        var arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 2, Math.PI / 4, 10, new Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        var directionalLight = new DirectionalLight("directionalLight", new Vector3(0, -1, 1), scene);
        directionalLight.intensity = 0.75;
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.5;

        var frameRate: number = 10;
        var box = this.createBox(scene);
        //this.simpleSlideAnimation(scene, frameRate, box);
        //this.slideAndRotateAnimation(scene, frameRate, box, 1);
        //this.slideAndRotateAnimation(scene, frameRate, box, 1, [0, 1, 2]);
        //this.slideAndRotateAnimation(scene, frameRate, box, 3, [0, 1, 2]);
        //this.slideAndRotateAnimation(scene, frameRate, box, 3, [0, 1.5, 2]);
        //this.rotateThenSlideAnimation(scene, frameRate, box, 2, [0, 2.5, 5]);
        this.rotateThenRotateAndSlideAnimation(scene, frameRate, box, 2, [0, 2.5, 5]);
        return scene;
    };
    
    rotateThenRotateAndSlideAnimation = (scene: Scene, frameRate: number, box: Mesh, fast: number, frameVary: number[]) => {
        var yRotate = this.createRotateAnimation(scene, frameRate, fast, frameVary);
        var xSlide = this.crateSlideAnimation(scene, frameRate);
        var nextAnimation =  function () {
            scene.beginDirectAnimation(box, [xSlide, yRotate], 0, frameRate * 2, true);
        }
        scene.beginDirectAnimation(box, [yRotate], 0, frameRate * 2, false, 1, nextAnimation);
    }

    rotateThenSlideAnimation = (scene: Scene, frameRate: number, box: Mesh, fast: number, frameVary: number[]) => {
        var yRotate = this.createRotateAnimation(scene, frameRate, fast, frameVary);
        var xSlide = this.crateSlideAnimation(scene, frameRate);
        var nextAnimation =  function () {
            scene.beginDirectAnimation(box, [xSlide], 0, frameRate * 2, true);
        }
        scene.beginDirectAnimation(box, [yRotate], 0, frameRate * 2, false, 1, nextAnimation);
        
    }
    // Complex Animation
    slideAndRotateAnimation = (scene: Scene, frameRate: number, box: Mesh, fast: number, frameVary: number[]) => {
        var yRotate = this.createRotateAnimation(scene, frameRate, fast, frameVary);
        var xSlide = this.crateSlideAnimation(scene, frameRate);
        scene.beginDirectAnimation(box, [xSlide, yRotate], 0, frameRate * 2, true);
    }
    // Simple Animation
    simpleSlideAnimation = (scene: Scene, frameRate: number, box: Mesh) => {
        var xSlide = this.crateSlideAnimation(scene, frameRate);
        scene.beginDirectAnimation(box, [xSlide], 0, frameRate * 2, true);
    }

    createRotateAnimation = (scene: Scene, frameRate: number, fast: number, frameVary: number[]): Animation => {
        var rotate = new Animation("rotate", "rotation.y", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        var keyFrames = [];
        keyFrames.push({
            frame: 0 * frameVary[0],
            value: 0
        });
        keyFrames.push({
            frame: frameRate * frameVary[1],
            value: Math.PI * fast
        });
        keyFrames.push({
            frame: frameRate * frameVary[2],
            value: Math.PI * 2 * fast
        });
        rotate.setKeys(keyFrames);
        return rotate;
    }

    crateSlideAnimation = (scene: Scene, frameRate: number): Animation => {
        var xSlide = new Animation("xSlide", "position.x", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        var keyFrames = [];
        keyFrames.push({
            frame: 0,
            value: 2
        });
        keyFrames.push({
            frame: frameRate,
            value: -2
        });
        keyFrames.push({
            frame: frameRate * 2,
            value: 2
        });
        xSlide.setKeys(keyFrames);
        return xSlide;
    }

    // crate box
    createBox = (scene: Scene): Mesh => {
        var box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
        box.position.x = 2;
        return box;
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

export default new CombineAnimations();