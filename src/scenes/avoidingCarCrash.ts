import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, StandardMaterial, MeshBuilder, SceneLoader, Animation, Axis, Tools, Space } from "@babylonjs/core";
import "@babylonjs/loaders";
import { CreateSceneClass } from "../createScene";

export class AvoidingCarCrash implements CreateSceneClass {
    turn: number = 0;
    dist: number = 0;
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 2.2, Math.PI / 2.2, 15, new Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);
        
        const wireMat = new StandardMaterial("wireMat");
        //wireMat.wireframe = true;
        wireMat.alpha = 0;

        const hitBox = MeshBuilder.CreateBox("carbox", {width: 0.5, height: 0.6, depth: 4.5});
        hitBox.material = wireMat;
        hitBox.position.x = 3.1;
        hitBox.position.y = 0.3;
        hitBox.position.z = -5;

        let carReady = false;
        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.glb").then(() => {
            const car = scene.getMeshByName("car");
            carReady = true;
            car!.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
            car!.position.y = 0.16;
            car!.position.x = -3;
            car!.position.z = 8;

            const animCar = new Animation("carAnimation", "position.z", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

            const carKeys = [];
            carKeys.push({
                frame: 0,
                value: 8
            });
            carKeys.push({
                frame: 150,
                value: -7
            });
            carKeys.push({
                frame: 200,
                value: -7
            });

            animCar.setKeys(carKeys);

            car!.animations = [];
            car!.animations.push(animCar);
            scene.beginAnimation(car, 0, 200, true);
            //wheel animation
            const wheelRB = scene.getMeshByName("wheelRB");
            const wheelRF = scene.getMeshByName("wheelRF");
            const wheelLB = scene.getMeshByName("wheelLB");
            const wheelLF = scene.getMeshByName("wheelLF");

            scene.beginAnimation(wheelRB, 0, 30, true);
            scene.beginAnimation(wheelLF, 0, 30, true);
            scene.beginAnimation(wheelLB, 0, 30, true);
            scene.beginAnimation(wheelLF, 0, 30, true);
        });

        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "village.glb");
        const track: {turn: number; dist: number } [] = [];
        track.push(this.walk(180, 2.5));
        track.push(this.walk(0, 5));

        SceneLoader.ImportMeshAsync("him","https://playground.babylonjs.com/scenes/Dude/", "Dude.babylon", scene).then((result) => {
            var dude = result.meshes[0];
            dude.scaling = new Vector3(0.008, 0.008, 0.008);

            dude.position = new Vector3(1.5, 0, -6.9);
            dude.rotate(Axis.Y, Tools.ToRadians(-90), Space.LOCAL);
            const startRotation = dude.rotationQuaternion?.clone();
            scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
            let distance = 0;
            let step = 0.015;
            let p = 0;
            scene.onBeforeRenderObservable.add(() => {
                if(carReady) {
                    if(!dude.intersectsMesh(hitBox) && scene.getMeshByName("car")?.intersectsMesh(hitBox)){
                        return;
                    }
                    dude.movePOV(0, 0, step);
                    distance += step;
                    if(distance > track[p].dist) {
                        dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
                        p += 1;
                        p %= track.length;
                        if(p === 0) {
                            distance = 0;
                            dude.position = new Vector3(1.5, 0, -6.9);
                            dude.rotationQuaternion = startRotation!.clone();
                        }
                    }
                }
            });
        });

        return scene;
    };

    walk(turn: number, dist: number) {
        this.turn = turn;
        this.dist = dist;
        return {turn, dist}
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

export default new AvoidingCarCrash();