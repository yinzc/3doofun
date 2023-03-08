import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3, Vector4, Texture, StandardMaterial, Animation} from "@babylonjs/core";
import earcut from "earcut";
import { CreateSceneClass } from "../createScene";

export class VillageAnimation implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0));
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("HemisphericLight", new Vector3(0, 1, 0), scene);

        const car = this.buildCar(scene);
        car.rotation.x = -Math.PI / 2;
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

    buildCar = (scene: Scene) => {
        // base
        const outline: Vector3[] = [
            new Vector3(-0.3, 0, -0.1),
            new Vector3(0.2, 0, -0.1),
        ]
        //curved front
        for (let i = 0; i < 20; i++) {
            outline.push(new Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
        }
        //top
        outline.push(new Vector3(0, 0, 0.1));
        outline.push(new Vector3(-0.3, 0, 0.1));
        //back rormed automatically
        //car face UVs
        const faceUV = [];
        faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
        faceUV[1] = new Vector4(0, 0, 1, 0.5);
        faceUV[2] = new Vector4(0.38, 1, 0, 0.5);
        //car material
        const carMat = new StandardMaterial("carMat");
        carMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/car.png");
        const car = MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2, faceUV: faceUV, wrap: true}, scene, earcut);
        car.material = carMat;
        //wheel face UVs
        const wheelUV = [];
        wheelUV[0] = new Vector4(0, 0, 1, 1);  // bottom
        wheelUV[1] = new Vector4(0, 0.5, 0, 0.5); //
        wheelUV[2] = new Vector4(0, 0, 1, 1);
        //car material
        const wheelMateril = new StandardMaterial("wheelMateril");
        wheelMateril.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/wheel.png");

        const wheelRB = MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05, faceUV: wheelUV});
        wheelRB.material = wheelMateril;
        wheelRB.setParent(car);
        wheelRB.position.z = -0.1;
        wheelRB.position.x = -0.2;
        wheelRB.position.y = 0.035;
        // const wheelRBMateril = new StandardMaterial("wheelRBMateril");
        // wheelRBMateril.diffuseColor = new Color3(1, 0, 0);
        const wheelRF = wheelRB.clone("wheelRF");
        wheelRF.position.x = 0.1;
        const wheelLB = wheelRB.clone("wheelLB");
        wheelLB.position.y = -0.2 - 0.035;
        const wheelLF = wheelRF.clone("wheelLF");
        wheelLF.position.y = -0.2 - 0.035;

        const animWheel = this.wheelAnimation();
        wheelRB.animations.push(animWheel);
        wheelRF.animations.push(animWheel);
        wheelLB.animations.push(animWheel);
        wheelLF.animations.push(animWheel);
        scene.beginAnimation(wheelRB, 0, 30, true);
        scene.beginAnimation(wheelRF, 0, 30, true);
        scene.beginAnimation(wheelLB, 0, 30, true);
        scene.beginAnimation(wheelLF, 0, 30, true);
        return car;
    }

    wheelAnimation = () => {
        const animWheel = new Animation("wheelAnimation", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        const wheelKeys = [];
        //At the animation key 0, the value of rotation.y is 0
        wheelKeys.push({frame: 0, value: 0});
        //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
        wheelKeys.push({frame: 30, value: 2 * Math.PI});
        //set the keys
        animWheel.setKeys(wheelKeys);
        return animWheel;
    }

}

export default new VillageAnimation();