import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SpriteManager, Sprite, MeshBuilder, StandardMaterial, Texture, Color3, SceneLoader, CubeTexture, Mesh, ParticleSystem, Color4, PointerInfo, PointerEventTypes } from "@babylonjs/core";
import "@babylonjs/loaders";
import { CreateSceneClass } from "../createScene";

export class SpriteTrees implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene);
        arcRotateCamera.upperBetaLimit = Math.PI / 2.2;
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);
        //Swith fountain on and off
        let switched = false;
        const pointerDown = (mesh : Mesh) => {
            if (mesh === fountain) {
                switched = ! switched;
                if(switched) {
                    // Start the particle system
                    particleSystem.start();
                } else {
                    // Stop the particle system
                    particleSystem.stop();
                }
            }
        }
        scene.onPointerObservable.add((pointerInfo : PointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERDOWN:
                    if (pointerInfo.pickInfo?.hit) {
                            pointerDown(pointerInfo.pickInfo.pickedMesh as Mesh);
                    }
                    break;
            }
        });
        //Create lathed fountain
        const fountainOutline = [
            new Vector3(0, 0, 0),
            new Vector3(0.5, 0, 0),
            new Vector3(0.5, 0.2, 0),
            new Vector3(0.4, 0.2, 0),
            new Vector3(0.4, 0.05, 0),
            new Vector3(0.05, 0.1, 0),
            new Vector3(0.05, 0.8, 0),
            new Vector3(0.15, 0.9, 0)
        ];
        const fountain = MeshBuilder.CreateLathe("fountain", {shape: fountainOutline, sideOrientation: Mesh.DOUBLESIDE});
        fountain.position.x = -4;
        fountain.position.z = -6;
        // Create a particle system
        var particleSystem = new ParticleSystem("particles", 5000, scene);
        // Texture of each particle
        particleSystem.particleTexture = new Texture("https://playground.babylonjs.com/textures/flare.png", scene);
        // Where the particles come from
        particleSystem.emitter = new Vector3(-4, 0.9, -6); // the starting object , the emitter
        particleSystem.minEmitBox = new Vector3(-0.02, 0, 0); // Starting all from 
        particleSystem.maxEmitBox = new Vector3(0.02, 0, 0);
        // Colors of all particles
        particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);
        // Size of each particle
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.15;
        // Life time of each particle
        particleSystem.minLifeTime = 2;
        particleSystem.maxLifeTime = 3.5;
        // Emisson rate
        particleSystem.emitRate = 1500;
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
        // Set the gravity of all particles
        particleSystem.gravity = new Vector3(0, -9.81, 0);
        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new Vector3(-2, 8, 2);
        particleSystem.direction2 = new Vector3(2, 8, -2);
        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;
        // Spedd
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.025;
        // Start the particle system
        particleSystem.start();


        const spriteManagerUFO = new SpriteManager("UFOManager", "https://assets.babylonjs.com/environments/ufo.png", 1, {width: 128, height: 76}, scene);
        const ufo = new Sprite("ufo", spriteManagerUFO);
        ufo.playAnimation(0, 16, true, 125);
        ufo.position.y = 5;
        ufo.position.z = 0;
        ufo.width = 2;
        ufo.height = 1;

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
        const skybox = MeshBuilder.CreateBox("skyBox", {size: 150}, scene);
        const skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        SceneLoader.ImportMeshAsync("",  "https://assets.babylonjs.com/meshes/", "valleyvillage.glb");
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
}

export default new SpriteTrees();