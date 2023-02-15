import { ArcRotateCamera, Color3, Engine, HemisphericLight, MeshBuilder, Scene, Sound, StandardMaterial, Texture, Tools, Vector3 } from "@babylonjs/core";
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
        
        const box1 = MeshBuilder.CreateBox("box1", {width: 2, height: 1.5, depth: 3}, scene);
        box1.position.y = 0.75;

        const box2 = MeshBuilder.CreateBox("box2", {}, scene);
        box2.scaling.x = 2;
        box2.scaling.y = 1.5;
        box2.scaling.z = 3;
        box2.position = new Vector3(-3, 0.75, 0);
        

        const box3 = MeshBuilder.CreateBox("box3", {}, scene);
        box3.scaling = new Vector3(2, 1.5, 3);
        box3.position.x = 3;
        box3.position.y = 0.75;
        box3.position.z = 0;
        //box3.rotation.y = Math.PI / 4;
        box3.rotation.y = Tools.ToRadians(45);

        const box4 = MeshBuilder.CreateBox("box4", {}, scene);
        box4.position.x = 6;
        box4.position.y = 0.5;
        box4.position.z = 0;
        const box4Materil = new StandardMaterial("Box4Materil", scene);
        box4Materil.diffuseTexture = new Texture("https://www.babylonjs-playground.com/textures/floor.png");
        box4.material = box4Materil;

        const roof4 = MeshBuilder.CreateCylinder("roof4", {diameter: 1.3, height: 1.2, tessellation: 3}, scene);
        roof4.scaling.x = 0.75;
        roof4.rotation.z = Math.PI / 2;
        roof4.position.x = 6;
        roof4.position.y = 1.22;
        const roof4Materil = new StandardMaterial("Roof4Materil",scene);
        roof4Materil.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg");
        roof4.material = roof4Materil;

        const ground = MeshBuilder.CreateGround("ground", {width:20, height:10}, scene);
        const groundMateril = new StandardMaterial("GroundMateril", scene);
        //groundMateril.diffuseColor = new Color3(0, 1, 0);
        groundMateril.diffuseColor = Color3.Green();
        ground.material = groundMateril;
        return scene;
    };
}

export default new BuildAVillage();