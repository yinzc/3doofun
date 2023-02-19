import { ArcRotateCamera, Color3, Color4, DynamicTexture, Engine, HemisphericLight, MeshBuilder, Nullable, Scene, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
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

        const boxChildAxes = this.localAxes(1, scene);
        boxChildAxes.parent = boxChild;
        this.showAxis(6, scene);
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

    showAxis = (size: number, scene: Scene) => {
        const makeTextPlane = (text = "", color = "", size = undefined) => {
            const dynamicTexture = new DynamicTexture("DynamicTexture", 50, scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
            const plane = MeshBuilder.CreatePlane("TextPlane", size, scene);
            const planeMaterial = new StandardMaterial("TextPlaneMaterial", scene);
            planeMaterial.backFaceCulling = false;
            planeMaterial.specularColor = new Color3(0, 0, 0);
            planeMaterial.diffuseTexture = dynamicTexture;
            plane.material = planeMaterial;
            return plane;
        };
        const xoptions = {
            points: [
                new Vector3(0, 0, 0) , new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0), 
                new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
            ],
            updatable: true,
        };
        const axisX = MeshBuilder.CreateLines("axisX", xoptions, scene);
        axisX.color = new Color3(1, 0, 0);
        const xChar = makeTextPlane("X", "red", size / 10);
        xChar.position = new Vector3(0.9*size, -0.05*size, 0);

        const yoptions = {
            points: [
                new Vector3(0, 0, 0), new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0), 
                new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)
            ],
            updatable: true,
        };
        const axisY = MeshBuilder.CreateLines("axisY", yoptions, scene);
        axisY.color = new Color3(0, 1, 0);
        const yChar = makeTextPlane("Y", "red", size / 10);
        yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

        const zoptions = {
            points: [
                new Vector3(0, 0, 0), new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95),
                new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)
            ],
            updatable: true,
        };
        const axisZ = MeshBuilder.CreateLines("axisZ", zoptions, scene);
        axisZ.color = new Color3(0, 0, 1);
        const zChar = makeTextPlane("Z", "blue", size / 10);
        zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
    };

    /** localAxes */
    localAxes = (size: number, scene:Scene) => {
        const local_axisX_options = {
            points: [
                new Vector3(0, 0, 0), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
                new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)],
            updatable: true,
        };
        const local_axisX = MeshBuilder.CreateLines("local_axisX", local_axisX_options, scene);
        local_axisX.color = new Color3(1, 0, 0);

        const local_axisY_options = {
            points: [
                new Vector3(0, 0, 0), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
                new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
            ],
            updatable: true,
        };
        const local_axisY = MeshBuilder.CreateLines("local_axisY", local_axisY_options, scene);
        local_axisY.color = new Color3(0, 1, 0);

        const local_axisZ_options = {
            points: [
                new Vector3(0, 0, 0), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
                new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
            ],
            updatable: true,
        };
        const local_axisZ = MeshBuilder.CreateLines("local_axisZ", local_axisZ_options, scene);
        local_axisZ.color = new Color3(0, 0, 1);
        
        const local_origin = new TransformNode("local_origin");
        local_axisX.parent = local_origin;
        local_axisY.parent = local_origin;
        local_axisZ.parent = local_origin;
        return local_origin;
    }
    

}

export default new MeshParents();