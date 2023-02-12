import { ArcRotateCamera, Color3, CreateSphere, Engine, HemisphericLight, PointLight, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class MaterialActionAndEvent implements CreateSceneClass {
    createScene =async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        const scene = new Scene(engine);
        const arcRotateCamera = new ArcRotateCamera("ArcRotateCamera", Math.PI/2, Math.PI/4, 10, new Vector3(0, 0, 0), scene);
        arcRotateCamera.setPosition(new Vector3(10, 10, -100));
        arcRotateCamera.attachControl(canvas, true);
        arcRotateCamera.upVector = new Vector3(0, 0, -1);

        // 第一种
        // const hemisphericLight = new HemisphericLight("HemisphericLight", new Vector3(0, 1, 0), scene);
        // const redMat = new StandardMaterial("redMat", scene);
        // redMat.emissiveColor = new Color3(1, 0, 0);
        // const sphere = CreateSphere("sphere", { diameter: 10 }, scene);
        // sphere.material = redMat;

        // 第二种
        // const greenMat = new StandardMaterial("greenMat", scene);
        // greenMat.diffuseColor = new Color3(0, 1, 0);
        // const pointLight = new PointLight("PointLight", new Vector3(0, 10, 0), scene);
        // pointLight.diffuse = new Color3(0, 1, 0);
        // const sphere2 = CreateSphere("sphere2", { diameter: 2.5 }, scene);
        // sphere2.material = greenMat;

        // 第三种
        const blueMat = new StandardMaterial("blueMat", scene);
        blueMat.specularColor = new Color3(0, 0, 1);
        const pointLight2 = new PointLight("PointLight2", new Vector3(0, 10, 0), scene);
        pointLight2.specular = new Color3(0, 0, 1);
        const sphere3 = CreateSphere("sphere3", { diameter: 2.5 }, scene);
        sphere3.material = blueMat;

        // 第四种
        // const whiteMat = new StandardMaterial("whiteMat", scene);
        // whiteMat.ambientColor = new Color3(1, 1, 1);
        // scene.ambientColor = new Color3(1, 1, 1);
        // const sphere4 = CreateSphere("sphere4", { diameter: 25 }, scene);
        // sphere4.material = whiteMat;

        return scene;
    };
}

export default new MaterialActionAndEvent();
