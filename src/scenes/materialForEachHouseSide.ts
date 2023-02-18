import { ArcRotateCamera, Color3, CreateBox, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, Vector4 } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class MaterialForEachHouseSide implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
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
        const arcRotateCamera = new ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0));
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("HemisphericLight", new Vector3(1, 1, 0), scene);
        const ground = this.buildGround();
        const box = this.buildBox();
        const roof = this.buildRoof();
        return scene;
    };
    /** Build Functions */
    buildGround = () => {
        const groundMateril = new StandardMaterial("groundMateril");
        groundMateril.diffuseColor = new Color3(0, 1, 0);
        const ground = MeshBuilder.CreateGround("ground", {width:10, height:10});
        ground.material = groundMateril;
    }

    buildBox = () => {
        const boxMateril = new StandardMaterial("boxMateril");
        boxMateril.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png")
        //options parameter to set different images on each side
        const faceUV = [];
        faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
        faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
        faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
        faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
        // top 4 and bottom 5 not seen so not set


        // boxMateril.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png");
        // //options parameter to set different images on each side
        // const faceUV = [];
        // faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
        // faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
        // faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
        // faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
        // // top 4 and bottom 5 not seen so not set
        
        //const box = MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true});
        const box = MeshBuilder.CreateBox("box", {width:2, faceUV: faceUV, wrap: true});
        box.material = boxMateril;
        box.position.y = 0.5;
        return box;
    }

    buildRoof = () => {
        const roofMateril = new StandardMaterial("roofMateril");
        roofMateril.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg");
        const roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
        roof.material = roofMateril;
        roof.scaling.x = 0.75;
        roof.scaling.y = 2;
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 1.22;
        return roof;
    }
}

export default new MaterialForEachHouseSide();