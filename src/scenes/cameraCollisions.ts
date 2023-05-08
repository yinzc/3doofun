import { Engine, Scene, PointLight, Vector3, DirectionalLight, FreeCamera, MeshBuilder, StandardMaterial, Color3, Texture, ArcRotateCamera, HemisphericLight, Matrix, Mesh, KeyboardEventTypes } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class CameraCollisions implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        var scene = new Scene(engine);
        this.showDebug(scene);
        scene = this.basicCameraCollisionExample(scene, canvas);
        //scene = this.basicMeshCollisionExample(scene, canvas);
        return scene;
    };
    
    basicCameraCollisionExample(scene: Scene, canvas: HTMLCanvasElement) {
        // Lights
        var light0 = new DirectionalLight("Omni", new Vector3(-2, -5, 2), scene);
        var light1 = new PointLight("Omni", new Vector3(2, -5, -2), scene);
        // Need a free camera for collisions
        var camera = new FreeCamera("FreeCamera", new Vector3(8, -8, -16), scene);
        camera.setTarget(new Vector3(0, -8, 0));
        camera.attachControl(canvas, true); 
        camera.minZ = 0.45;
        //Ground
        var ground = MeshBuilder.CreatePlane("ground", {size: 20.0}, scene);
        ground.material = new StandardMaterial("groundMat", scene);
        (ground.material as StandardMaterial).diffuseColor = new Color3(1, 1, 1);
        //backFaceCulling 是一个布尔值属性，如果设置为 true（默认值），则只渲染物体的正面，而背面将不会被渲染。
        //但是，由于地面在场景中看起来没有“背面”，所以将其设置为 false 可以让地面的另一侧也被渲染出来，从而使地面看起来更加真实。
        ground.material.backFaceCulling = false;
        ground.position = new Vector3(5, -10, -15);
        ground.rotation = new Vector3(Math.PI / 2, 0, 0);
        //Simple crate
        var box = MeshBuilder.CreateBox("crate", {size: 2}, scene);
        box.material = new StandardMaterial("Mat", scene);
        (box.material as StandardMaterial).diffuseTexture = new Texture("https://playground.babylonjs.com/textures/crate.png", scene);
        //在Three.js中，要实现透明度渲染需要满足两个条件：一个是材质本身具有透明度（alpha），另一个是材质上的纹理图片具有对应的透明通道（alpha map）。
        //.hasAlpha 属性设置为 true 来开启这个纹理图的透明通道。
        (box.material as StandardMaterial).diffuseTexture!.hasAlpha = true;
        box.position = new Vector3(5, -9, -10);
        //Set gravity for the scene (G force like, on Y-axis)
        scene.gravity = new Vector3(0, -0.9, 0);
        // Enable Collisions
        scene.collisionsEnabled = true;
        //Then apply collisions and gravity to the active camera
        camera.checkCollisions = true;
        camera.applyGravity = true;
        //Set the ellipsoid around the camera (e.g. your player's size)
        camera.ellipsoid = new Vector3(1, 1, 1);
        //finally, say which mesh will be collisionable
        ground.checkCollisions = true;
        box.checkCollisions = true;
        return scene;
    }

    basicMeshCollisionExample(scene: Scene, canvas: HTMLCanvasElement) {
        const camera = new ArcRotateCamera("camera1", -Math.PI / 2, Math.PI / 3.5, 25, new Vector3(0, 0, 0));
        camera.attachControl(canvas, true);
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        /* Set Up Scenery _____________________*/
        //Ground
        const ground = MeshBuilder.CreateGround("ground", {width: 20, height: 20}, scene);
        ground.material = new StandardMaterial("groundMat", scene);
        (ground.material as StandardMaterial).diffuseColor = new Color3(1, 1, 1);
        ground.material.backFaceCulling = false;
        const randomNumber = function (min : number, max: number) {
            if (min == max) {
                return (min);
            }
            const random = Math.random();
            return ((random * (max - min)) + min);
        };
        const box = MeshBuilder.CreateBox("box", {size: 2}, scene);
        box.material = new StandardMaterial("boxMaterial", scene);
        (box.material as StandardMaterial).diffuseTexture = new Texture("https://playground.babylonjs.com/textures/crate.png", scene);
        box.checkCollisions = true;

        const boxNb = 6;
        let theta = 0;
        const radius = 6;
        box.position = new Vector3((radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)), 1, (radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta)));

        const boxes = [box];
        for (let i = 1; i < boxNb; i++) {
            theta += 2 * Math.PI / boxNb;
            const newBox = box.clone("box" + i);
            boxes.push(newBox);
            newBox.position = new Vector3((radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)), 1, (radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta)));
        }
        /* End Create Scenery */

        const base = new Mesh("pivot");
        const headDiam = 1.5;
        const bodyDiam = 2; 
        const head = MeshBuilder.CreateSphere("h", {diameter: headDiam});
        head.parent = base;
        const body = MeshBuilder.CreateSphere("b", {diameter: bodyDiam});
        body.parent = base;
        head.position.y = 0.5 * (headDiam + bodyDiam);
        base.position.y = 0.5 * bodyDiam;

        const extra = 0.25;
        base.ellipsoid = new Vector3(0.5 * bodyDiam, 0.5 * (headDiam + bodyDiam), 0.5 * bodyDiam); //x and z must be same value
        base.ellipsoid.addInPlace(new Vector3(extra, extra, extra));
        const offsetY = 0.5 * (headDiam + bodyDiam) - base.position.y
        base.ellipsoidOffset = new Vector3(0, offsetY, 0);
        //Create Visible Ellipsoid around camera
        const a = base.ellipsoid.x;
        const b = base.ellipsoid.y;
        const points = [];
        for(let theta = -Math.PI/2; theta < Math.PI/2; theta += Math.PI/36) {
            points.push(new Vector3(0, b * Math.sin(theta) + offsetY, a * Math.cos(theta)));
        }

        const ellipse = [];
        ellipse[0] = MeshBuilder.CreateLines("e", {points:points}, scene);
        ellipse[0].color = Color3.Red();
        ellipse[0].parent = base;
        const steps = 12;
        const dTheta = 2 * Math.PI / steps; 
        for(let i = 1; i < steps; i++) {
                ellipse[i] = ellipse[0].clone("el" + i);
                ellipse[i].parent = base;
                ellipse[i].rotation.y = i * dTheta;
        }

        //keyboard moves
        const forward = new Vector3(0, 0, 1);
        let angle = 0;
        let matrix = Matrix.Identity();

        //line to indicate direction
        let line = MeshBuilder.CreateLines("f", {points: [base.position.add(new Vector3(0, 3, 0)), base.position.add(new Vector3(0, 3, 0)).add(forward.scale(3))], updatable: true});
        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "a":
                        case "A":
                            angle -= 0.1;
                            Matrix.RotationYToRef(angle, matrix);
                            Vector3.TransformNormalToRef(forward, matrix, forward);
                            base.rotation.y = angle;
                        break
                        case "d":
                        case "D":
                            angle += 0.1;
                            Matrix.RotationYToRef(angle, matrix);
                            Vector3.TransformNormalToRef(forward, matrix, forward);
                            base.rotation.y = angle;
                        break
                        case "w":
                        case "W":
                            base.moveWithCollisions(forward.scale(0.1));
                        break
                        case "s":
                        case "S":
                            base.moveWithCollisions(forward.scale(-0.1));
                        break
                    }
                break;
            }
            line = MeshBuilder.CreateLines("f", {points: [base.position.add(new Vector3(0, 3, 0)), base.position.add(new Vector3(0, 3, 0)).add(forward.scale(3))], instance:line});
        });
        return scene;
    }

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
}

export default new CameraCollisions();