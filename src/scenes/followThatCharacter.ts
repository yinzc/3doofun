import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, FollowCamera, SceneLoader, Axis, Space, Tools, SpriteManager, Sprite, MeshBuilder, StandardMaterial, CubeTexture, Texture, Color3} from "@babylonjs/core";
import  "@babylonjs/loaders";
import { CreateSceneClass } from "../createScene";

export class FollowThatCharacter implements CreateSceneClass {
    turn: number = 0;
    dist: number = 0;
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        //this.showDebug(scene);
        const followCamera = new FollowCamera("followCamera", new Vector3(-6, 0, 0), scene);
        followCamera.radius = 1;
        followCamera.heightOffset = 8;
        followCamera.rotationOffset = 0;
        followCamera.cameraAcceleration = 0.005;
        followCamera.maxCameraSpeed = 10;
        followCamera.attachControl(true);
        
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);
        const track: ReturnType<typeof this.walk>[] = [];
        track.push(this.walk(86, 7));
        track.push(this.walk(-85, 14.8));
        track.push(this.walk(-93, 16.5));
        track.push(this.walk(48, 25.5));
        track.push(this.walk(-112, 30.5));
        track.push(this.walk(-72, 33.2));
        track.push(this.walk(42, 37.5));
        track.push(this.walk(-98, 45.2));
        track.push(this.walk(0, 47))

        //Dude
        SceneLoader.ImportMeshAsync("him","https://playground.babylonjs.com/scenes/Dude/", "Dude.babylon", scene).then((result) => {
            var dude = result.meshes[0];
            dude.scaling = new Vector3(0.008, 0.008, 0.008);
            dude.position = new Vector3(-6, 0, 0);
            dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
            const startRotation = dude.rotationQuaternion?.clone();

            followCamera.lockedTarget = dude;
            scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

            let distance = 0;
            let step = 0.015;
            let p = 0;

            scene.onBeforeRenderObservable.add(() => {
                dude.movePOV(0, 0, step);
                distance += step;
                if (distance > track[p].dist) {
                    dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
                    p++;
                    p %= track.length;
                    if (p === 0) {
                        distance = 0;
                        dude.position = new Vector3(-6, 0, 0);
                        dude.rotationQuaternion = startRotation!.clone();
                    }
                }
            });
        });

        const spriteManagerTrees = new SpriteManager("treesManager", "https://playground.babylonjs.com/textures/palm.png", 2000, {width: 512, height: 1024}, scene);
        //We create trees at random positions   
        for (let i = 0; i < 500; i++) {
            const tree = new Sprite("tree", spriteManagerTrees);
            tree.position.x = Math.random() * (-30);
            tree.position.z = Math.random() * 20 + 8;
            tree.position.y = 0.5;
        }
        for (let i = 0; i < 500; i++) {
            const tree = new Sprite("tree", spriteManagerTrees);
            tree.position.x = Math.random() * (25) + 7;
            tree.position.z = Math.random() * -35 + 8;
            tree.position.y = 0.5;
        }

        //Skybox
        const skybox = MeshBuilder.CreateBox("skyBox", {size:100}, scene);
        const skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb");

    return scene;
    };
    
    // This is a function that will be called by the GUI
    walk = (turn: number, dist: number) => {
        this.turn = turn!;
        this.dist = dist;
        return this;
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
}

export default new FollowThatCharacter();