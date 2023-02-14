import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Sound, Vector3 } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class BuildAVillage implements CreateSceneClass {
    createScene =async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI/2, Math.PI/2.5, 10, new Vector3(0,0,0), scene);
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1,1,0), scene);
        const box = MeshBuilder.CreateBox("box", {}, scene);
        box.position.y = 0.5;
        //adding sound
        const sound = new Sound("sound", "");
        const ground = MeshBuilder.CreateGround("ground", {width:10, height:10}, scene);
        return scene;
    };
}

export default new BuildAVillage();