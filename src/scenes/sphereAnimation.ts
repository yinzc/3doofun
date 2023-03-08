import { ArcRotateCamera, Axis, Engine, HemisphericLight, MeshBuilder, Scene, Space, Vector3 } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class SphereAnimation implements CreateSceneClass {
    turn: number = 0;
    dist: number = 0;

    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 1.5, Math.PI / 5, 15, new Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);

        //create a sphere
        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 0.25 });
        sphere.position = new Vector3(2, 0, 2);

        //draw lines to form a triangle
        const points = [];
        points.push(new Vector3(2, 0, 2));
        points.push(new Vector3(2, 0, -2));
        points.push(new Vector3(-2, 0, -2));
        points.push(points[0]); //close the triangle;
        MeshBuilder.CreateLines("triangle", { points: points });


        //const track:ReturnType<typeof this.slide>[] = [];
        const track:{turn: number; dist: number;}[] = [];
        track.push(this.slide(Math.PI / 2, 4));
        track.push(this.slide(3 * Math.PI / 4, 8));
        track.push(this.slide(3 * Math.PI / 4, 8 + 4 * Math.sqrt(2)));

        let distance = 0;
        let step = 0.05;
        let p = 0;
        scene.onBeforeRenderObservable.add(() => {
            sphere.movePOV(0, 0, step);
            distance += step;
            if (distance > track[p].dist) {
                sphere.rotate(Axis.Y, track[p].turn, Space.LOCAL);
                p += 1;
                p %= track.length;
                if (p === 0) {
                    distance = 0;
                    sphere.position = new Vector3(2, 0, 2); //reset to initial conditaions
                    sphere.rotation = Vector3.Zero(); //prevents error accumulation
                }
            }
        });
        return scene;
    };

    slide(turn: number, dist: number) { //after covering dist apply turn
        this.turn = turn;
        this.dist = dist;
        return { turn, dist }
    }

    /** Build Functions */
    showDebug = (scene: Scene) => {
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

export default new SphereAnimation();