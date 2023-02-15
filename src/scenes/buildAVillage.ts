import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Sound, Vector3 } from "@babylonjs/core";
import yqsnSoundUrl from "../../assets/sound/rxxw_yqsn.mp3";
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
        
        //adding sound
        const sound = new Sound("sound", yqsnSoundUrl ,scene, null, {loop:true, autoplay:true});
        //setInterval(() => sound.play(), 3000);
        
        const box = MeshBuilder.CreateBox("box", {width: 2, height: 1.5, depth: 3}, scene);
        box.scaling.x = 2;
        box.scaling.y = 1.5;
        box.scaling.z = 3;
        // const box = MeshBuilder.CreateBox("box", {}, scene);
        // box.scaling = new Vector3(2, 1.5, 3);

        box.position.y = 1;

        const ground = MeshBuilder.CreateGround("ground", {width:10, height:10}, scene);
        return scene;
    };
}

export default new BuildAVillage();