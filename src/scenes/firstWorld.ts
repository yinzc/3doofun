import { ArcRotateCamera, Color3, CreateBox, CreateGround, CreateSphere, DirectionalLight, Engine, HemisphericLight, PointLight, Scene, SpotLight, Vector3 } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class FirstWorld implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        // This creates a basic Babylon Scene object(non-mesh)
        const scene = new Scene(engine);

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

        const arcRotateCamera = new ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0),scene);
        
        const hemisphericLight = new HemisphericLight("HemisphericLight", new Vector3(0, 1, 0), scene);

        const box = CreateBox("box", {}, scene);

        return scene;
    };
}

export default new FirstWorld();