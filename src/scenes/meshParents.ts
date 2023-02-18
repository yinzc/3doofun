import { ArcRotateCamera, Color3, Color4, DynamicTexture, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class MeshParents implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);

        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI/2.2, Math.PI/2.5, 15, new Vector3(0, 0, 0));
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0,1,0), scene);
        const faceColors = [];
        faceColors[0] = new Color4(0, 0, 1); //Color3.Blue();
        faceColors[1] = new Color4(0, 1, 1); //Color3.Teal();
        faceColors[2] = new Color4(1, 0, 0); //Color3.Red();
        faceColors[3] = new  Color4(128, 0, 128); //Color3.Purple();
        faceColors[4] = new Color4(0, 1, 0); //Color3.Green();
        faceColors[5] = new Color4(255, 255, 0); //Color3.Yellow();
        const boxParent = MeshBuilder.CreateBox("Box", {faceColors:faceColors});
        const boxChild = MeshBuilder.CreateBox("Box", {size: 0.5, faceColors:faceColors});
        boxChild.setParent(boxParent);
        boxChild.position.x = 0;
        boxChild.position.y = 2;
        boxChild.position.z = 0;

        boxChild.rotation.x = Math.PI / 4;
        boxChild.rotation.y = Math.PI / 4;
        boxChild.rotation.z = Math.PI / 4;
        
        boxParent.position.x = 2;
        boxParent.position.y = 0;
        boxParent.position.z = 0;

        boxParent.rotation.x = 0;
        boxParent.rotation.y = 0;
        boxParent.rotation.z = -Math.PI / 4;

        const boxChildAxes = localAxes(1, scene);

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

    showAxis = (size, scene) => {
        const makeTextPlane = (text, color, size) => {
            const dynamicTexture = new DynamicTexture("DynamicTexture", 50, scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
            const plane = MeshBuilder.CreatePlane("TextPlane", size, scene);
            plane.material = new StandardMaterial("TextPlaneMaterial", scene);
            plane.material.backFaceCulling = false;
            

    }
}

export default new MeshParents();