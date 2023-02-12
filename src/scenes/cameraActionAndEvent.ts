import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { CreateSceneClass } from "../createScene";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { ArcRotateCamera, CreateGround, CreateSphere, FollowCamera, HemisphericLight } from "@babylonjs/core";

export class CameraActionAndEvent implements CreateSceneClass {
    createScene =async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        const scene = new Scene(engine);

        // Add lights to scene 
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);
        const sphere = CreateSphere("sphere",
            { diameter: 2, segments: 32 },
            scene
        );

        //  // 通用相机
        // // 实例化性价，并传入相关值：名称，位置，场景对象
        // const universalCamera = new UniversalCamera("UniversalCamera", new Vector3(0, 0, -10), scene);
        // // 使用setTarget方法
        // universalCamera.setTarget(new Vector3(0, 0, 0));
        // universalCamera.attachControl(canvas, true);
        
        // // 球形相机
        // // Add a camera to the scene and attach it to the canvas
        // // 参数：纵向旋转角度alpha、横向旋转角度beta、半径、目标位置、所属场景
        // const arcRotateCamera = new ArcRotateCamera("ArcRotateCamera", Math.PI/2, Math.PI/4, 10, new Vector3(0, 0, 0), scene);
        // arcRotateCamera.setTarget(Vector3.Zero());
        // // 相机位置，覆盖相机的alpha、beta、 半径值
        // arcRotateCamera.setPosition(new Vector3(10, 10, -100));
        // // 将相机和画布关联
        // arcRotateCamera.attachControl(canvas, true);

        // 跟随相机
        const followCamera = new FollowCamera("FollowCamera", new Vector3(0, -5, 0), scene);
        // 相机与目标的距离
        followCamera.radius = 10;
        // 相机超过目标局部坐标中心点的高度
        followCamera.heightOffset = 10;
        // 相机在目标局部坐标XY平面内环绕目标的旋转角度
        followCamera.rotationOffset = 0;
        // 加速度
        followCamera.cameraAcceleration = 0.005;
        // 最大加速度
        followCamera.maxCameraSpeed = 10;
        // 将相机与画布关联
        followCamera.attachControl(true);
        // 创建目标网格
        followCamera.lockedTarget = sphere;

        
        
        const ground = CreateGround("ground", { width: 7, height: 6, subdivisions: 2 }, scene);
        sphere.position.x = sphere.position.x + 0.005;
        
        return scene;
    };   
}

export default new CameraActionAndEvent();