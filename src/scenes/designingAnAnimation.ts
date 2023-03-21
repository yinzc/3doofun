import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, MeshBuilder, Animation, Color3, StandardMaterial } from "@babylonjs/core";
import "@babylonjs/loaders";
import { CreateSceneClass } from "../createScene";

export class DesigningAnAnimation implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        //this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 2, Math.PI / 4, 10, new Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);

        const directionalLigh = new DirectionalLight("directionalLight", new Vector3(0, -1, 1), scene);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        directionalLigh.intensity = 0.75;
        hemisphericLight.intensity = 0.5;

        const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
        box.position.x = 2;
        const material = new StandardMaterial("material", scene);
        material.diffuseColor = new Color3(1, 0, 0);

        

        // const frameRate = 10;
        // const xSlide = new Animation("xSlide", "position.x", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

        // const keyFrames = [];
        // keyFrames.push({
        //     frame: 0,
        //     value: 2
        // });
        // keyFrames.push({
        //     frame: frameRate,
        //     value: -2
        // });
        // keyFrames.push({
        //     frame: frameRate * 2,
        //     value: 2
        // });

        // xSlide.setKeys(keyFrames);
        // box.animations.push(xSlide);
        // scene.beginAnimation(box, 0, frameRate * 2, true);

        const startFrame = 0;
        const mideFrame = 25;
        const endFrame = 50;
        const frameRate = 10;
        const xSlide = new Animation("xSlide", "position.x", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        const keyFrames = [];
        keyFrames.push({
            frame: startFrame,
            value: 2
        });
        keyFrames.push({
            frame: mideFrame,
            value: 0
        });
        keyFrames.push({
            frame: endFrame,
            value: -2
        });
        xSlide.setKeys(keyFrames);

        const animationColor = new Animation("animationColor", "material.diffuseColor", 30, Animation.ANIMATIONTYPE_COLOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
        const keyFramesColor = [];
        keyFramesColor.push({
            frame: startFrame,
            value: new Color3(1, 0, 0)
        });
        keyFramesColor.push({
            frame: mideFrame,
            value: new Color3(0, 1, 0)
        });
        keyFramesColor.push({
            frame: endFrame,
            value: new Color3(0, 0, 1)
        });
        // 将动画帧添加到动画中
        animationColor.setKeys(keyFramesColor);

        //box.animations.push(xSlide);
        //box.animations.push(animationColor);
        // forward animation    
        //scene.beginAnimation(box, startFrame, endFrame, false);
        //scene.beginAnimation(box, endFrame, startFrame, true);
        // box.animations.push(xSlide, animationColor);
        // scene.beginAnimation(box, startFrame, endFrame, true);
        const myAnimation = scene.beginDirectAnimation(box, [xSlide], startFrame, endFrame, true);
        setTimeout(() => { myAnimation.stop()}, 5000);
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

export default new DesigningAnAnimation();