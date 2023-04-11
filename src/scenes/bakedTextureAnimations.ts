import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, SceneLoader, BakedVertexAnimationManager, VertexAnimationBaker, Mesh, AnimationRange, Vector4, Matrix } from "@babylonjs/core";
import "@babylonjs/loaders";
import { CreateSceneClass } from "../createScene";

export class BakedTextureAnimations implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        var scene = new Scene(engine);
        this.showDebug(scene);
        //scene = await this.vertexTextureAnimations(scene, canvas);
        //scene = await this.vertexTextureAnimationsOnInstances(scene, canvas);
        scene = await this.vertexTextureAnimationsOnThinInstances(scene, canvas);
        return scene;
    };

    vertexTextureAnimationsOnThinInstances = async (scene : Scene, canvas: HTMLCanvasElement) => {
        var engine: Engine = scene.getEngine();
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 15, 80), scene);
        freeCamera.setTarget(Vector3.Zero());
        freeCamera.attachControl(canvas, true);
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 2;

        const animationRanges = [
            {from: 7, to: 31},
            {from: 33, to: 61},
            {from: 63, to: 91},
            {from: 93, to: 130},
        ];

        const improtResult = await SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RaggarDK/Baby/baby/", "arr.babylon", scene);
        const setAnimationParameters = (vec: any) => {
            const anim = animationRanges[Math.floor(Math.random() * animationRanges.length)];
            const ofst = Math.floor(Math.random() * (anim.to - anim.from + 1));
            vec.set(anim.from, anim.to, ofst, Math.random() * 50 + 30);
        };

        const mesh = improtResult.meshes[0] as Mesh;
        const baker = new VertexAnimationBaker(scene, mesh);
        baker.bakeVertexData([new AnimationRange("My animation", 0, animationRanges[animationRanges.length - 1].to)]).then((vertexData) => {
            const vertexTexture = baker.textureFromBakedVertexData(vertexData);
            const manager = new BakedVertexAnimationManager(scene);
            manager.texture = vertexTexture;
            mesh.bakedVertexAnimationManager = manager;
            const numInstances = 500;
            const matrices = new Float32Array(numInstances * 16);
            const animParameters = new Float32Array(numInstances * 4);
            const params = new Vector4();
            for (let i = 0; i < numInstances; i++) {
                const matrix = Matrix.Translation(Math.random() * 100 - 50, 0, Math.random() * 100 - 50);
                console.log("matrix ... ...: " + matrix);
                matrices.set(matrix.toArray(), i * 16);
                setAnimationParameters(params);
                animParameters.set(params.asArray(), i * 4);
            }
            mesh.thinInstanceSetBuffer("matrix", matrices);
            mesh.thinInstanceSetBuffer("bakedVertexAnimationSettingsInstanced", animParameters, 4);
            scene.registerBeforeRender(() => {
                manager.time += engine.getDeltaTime() / 1000;
            });
        });
        return scene;
    }

    vertexTextureAnimationsOnInstances = async (scene : Scene, canvas: HTMLCanvasElement) => {
        let engine: Engine = scene.getEngine();
        let freeCamera = new FreeCamera("freeCamera", new Vector3(0, 15, 80), scene);
        freeCamera.setTarget(Vector3.Zero());
        freeCamera.attachControl(canvas, true);

        let hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 2;
        let animationRanges = [
            {from: 7, to: 31},
            {from: 33, to: 61},
            {from: 63, to: 91},
            {from: 93, to: 130},
        ];
        let improtResult = await SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RaggarDK/Baby/baby/", "arr.babylon", scene);
        const setAnimationParameters = (vec: any) => {
            const anim = animationRanges[Math.floor(Math.random() * animationRanges.length)];
            const ofst = Math.floor(Math.random() * (anim.to - anim.from + 1));
            vec.set(anim.from, anim.to, ofst, Math.random() * 50 + 30);
        };

        let mesh = improtResult.meshes[0] as Mesh;
        let baker = new VertexAnimationBaker(scene, mesh);

        mesh.registerInstancedBuffer("bakedVertexAnimationSettingsInstanceed", 4);
        mesh.instancedBuffers.bakedVertexAnimationSettingsInstanceed = new Vector4(0, 0, 0, 0);
        setAnimationParameters(mesh.instancedBuffers.bakedVertexAnimationSettingsInstanceed);
        // let range = new AnimationRange("My animation", 0, animationRanges[animationRanges.length - 1].to);
        // let ranges: AnimationRange[] = [range];
        baker.bakeVertexData([new AnimationRange("My animation", 0, animationRanges[animationRanges.length - 1].to)]).then((vertexData) => {
            const vertexTexture = baker.textureFromBakedVertexData(vertexData);
            const manager = new BakedVertexAnimationManager(scene);
            manager.texture = vertexTexture;
            mesh.bakedVertexAnimationManager = manager;
            const numInstances = 2;
            for (let i = 0; i < numInstances; i++) {
                const instance = mesh.createInstance("instance" + i);
                instance.instancedBuffers.bakedVertexAnimationSettingsInstanceed = new Vector4(0, 0, 0, 0);
                setAnimationParameters(instance.instancedBuffers.bakedVertexAnimationSettingsInstanceed);
                instance.position.x += Math.random() * 100 - 50;
                instance.position.z += Math.random() * 100 - 50;
            }
            scene.registerBeforeRender(() => {
                manager.time += engine.getDeltaTime() / 1000;
            });
        });
        return scene;
    }

    vertexTextureAnimations = async (scene : Scene, canvas: HTMLCanvasElement) => {
        let engine: Engine = scene.getEngine();
        let freeCamera = new FreeCamera("freeCamera", new Vector3(0, 5, 10), scene);
        freeCamera.setTarget(Vector3.Zero());
        freeCamera.attachControl(canvas, true);

        let hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 2;
        let animationRanges = [
            {from: 7, to: 31},
            {from: 33, to: 61},
            {from: 63, to: 91},
            {from: 93, to: 130},
        ];
        let improtResult = await SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RaggarDK/Baby/baby/", "arr.babylon", scene, undefined);
        let mesh = improtResult.meshes[0] as Mesh;
        let baker = new VertexAnimationBaker(scene, mesh);
        let range = new AnimationRange("My animation", 0, animationRanges[animationRanges.length - 1].to);
        let ranges: AnimationRange[] = [range];
        baker.bakeVertexData(ranges).then((vertexData) => {
            let vertexTexture = baker.textureFromBakedVertexData(vertexData);
            let manager = new BakedVertexAnimationManager(scene);
            manager.texture = vertexTexture;
            manager.animationParameters = new Vector4(
                animationRanges[0].from,
                animationRanges[0].to,
                0,
                30 
            );
            mesh.bakedVertexAnimationManager = manager;
            scene.registerBeforeRender(() => {
                manager.time += engine.getDeltaTime() / 1000;
            });
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

export default new BakedTextureAnimations();