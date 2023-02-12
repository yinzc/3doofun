import { ArcRotateCamera, Color3, CreateGround, CreateSphere, DirectionalLight, Engine, HemisphericLight, PointLight, Scene, SpotLight, Vector3 } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class LightsActionAndEvent implements CreateSceneClass {
    createScene =async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene>  => {
        const scene = new Scene(engine);

        const camera = new ArcRotateCamera("Camera", Math.PI / 2, 0, 15, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        // Add lights to the scene
        // 点光源
        // const pointLight = new PointLight("PointLight", new Vector3(0, -1, 0), scene);
        // pointLight.diffuse = new Color3(1, 0, 0);
        // pointLight.specular = new Color3(0, 1, 0);

        // 方向光
        // const directionalLight = new DirectionalLight("DirectionalLight", new Vector3(0, -1, 0), scene);
        // directionalLight.diffuse = new Color3(1, 0, 0);

        // 聚光灯
        const spotLight = new SpotLight("SpotLight", new Vector3(-1, 1, -1), new Vector3(0, -1, 0), Math.PI / 2, 3, scene);
        spotLight.diffuse = new Color3(1, 0 , 0);
        spotLight.specular = new Color3(0, 1, 0);

        // 半球光
        // const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        // hemisphericLight.diffuse = new Color3(1, 0, 0);
        // hemisphericLight.specular = new Color3(0, 1, 0);

        const sphere = CreateSphere("sphere", {}, scene);


        const ground = CreateGround("ground", {width: 7, height: 6, subdivisions: 2}, scene);
        return  scene;
    };
}

export default new LightsActionAndEvent();