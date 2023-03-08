import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader, Axis, Tools, Space } from "@babylonjs/core";
import "@babylonjs/loaders";
import { CreateSceneClass } from "../createScene";

export class WalkAroundTheVillage implements CreateSceneClass {
    turn:number = 0;
    dist:number = 0;
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 1.5, Math.PI / 5, 15, new Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);

        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "village.glb");

        const track: ReturnType<typeof this.walk>[] = [];
        track.push(this.walk(86, 7));
        track.push(this.walk(-85, 14.8));
        track.push(this.walk(-93, 16.5));
        track.push(this.walk(48, 25.5));
        track.push(this.walk(-112, 30.5));
        track.push(this.walk(-72, 33.2));
        track.push(this.walk(42, 37.5));
        track.push(this.walk(-98, 45.2));
        track.push(this.walk(0, 47));

        SceneLoader.ImportMeshAsync("him","https://playground.babylonjs.com/scenes/Dude/", "Dude.babylon", scene).then((result) => {
            var dude = result.meshes[0];
            dude.scaling = new Vector3(0.008, 0.008, 0.008);
            dude.position = new Vector3(-6, 0, 0);
            dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
            const startRotation = dude.rotationQuaternion?.clone();

            scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
            
            let distance = 0;
            let step = 0.005;
            let p = 0;

            scene.onBeforeRenderObservable.add(() => {
                dude.movePOV(0, 0, step);
                distance += step;
                if (distance > track[p].dist) {
                    dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
                    p += 1;
                    p %= track.length;
                    if (p === 0) {
                        distance = 0;
                        dude.position = new Vector3(-6, 0, 0);
                        dude.rotationQuaternion = startRotation!.clone();
                    }
                }
            });
        });
        return scene;
    };
    
    walk(turn:number, dist:number) {
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

export default new WalkAroundTheVillage();