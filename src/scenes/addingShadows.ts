import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, MeshBuilder, ShadowGenerator, SceneLoader, RenderTargetTexture, Axis, Tools, Space, StandardMaterial, CubeTexture, Texture, Color3 } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class AddingShadows implements CreateSceneClass {
    turn:number = 0;
    dist:number = 0;
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        //this.showDebug(scene);
        // const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 4, Math.PI / 3, 50, new Vector3(0, 0, 0), scene);
        // arcRotateCamera.attachControl(canvas, true);
        // //const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);
        // const directionalLight = new DirectionalLight("directionalLight", new Vector3(0, -1, 1), scene);
        // directionalLight.position = new Vector3(0, 15, -30);
        
        // const ground = MeshBuilder.CreateGround("ground", {width: 100, height: 100, subdivisions: 1, updatable: false}, scene);
        // ground.receiveShadows = true;

        // //Shadow generator
        // const shadowGenerator = new ShadowGenerator(1024, directionalLight);

        // SceneLoader.ImportMesh("him","https://playground.babylonjs.com/scenes/Dude/", "Dude.babylon", scene, function(newMeshes2, particleSystem2, skeletons2){
        //     var dude = newMeshes2[0];
        //     dude.scaling = new Vector3(0.2, 0.2, 0.2);
        //     //add dude, true means add children as well
        //     shadowGenerator.usePoissonSampling = true;
        //     shadowGenerator.useExponentialShadowMap = true;
        //     shadowGenerator.blurKernel = 32;
        //     //shadowGenerator.getShadowMap()!.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        //     shadowGenerator.addShadowCaster(dude, true);
        //     scene.beginAnimation(skeletons2[0], 0, 100, true);
        // });

        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", 0, Math.PI / 4, 15, Vector3.Zero(), scene);
        arcRotateCamera.upperBetaLimit = Math.PI / 2.2;
        arcRotateCamera.attachControl(canvas, true);

        const  directionalLight = new DirectionalLight("directionalLight", new Vector3(0, -1, 1), scene);
        directionalLight.position = new Vector3(0, 50, -100);

        // Shadow generator
        const shadowGenerator = new ShadowGenerator(1024, directionalLight);

        const track: {turn: number, dist: number}[] = [];
        track.push(this.walk(86, 7));
        track.push(this.walk(-85, 14.8));
        track.push(this.walk(-93, 16.5));
        track.push(this.walk(48, 25.5));
        track.push(this.walk(-112, 30.5));
        track.push(this.walk(-72, 33.2));
        track.push(this.walk(42, 37.5));
        track.push(this.walk(-98, 45.2));
        track.push(this.walk(0, 47));


        // Dude
        SceneLoader.ImportMeshAsync("him","https://playground.babylonjs.com/scenes/Dude/", "Dude.babylon", scene).then((result) => {
        const dude = result.meshes[0];
        dude.scaling = new Vector3(0.008, 0.008, 0.008);

        shadowGenerator.addShadowCaster(dude, true);

        dude.position = new Vector3(-6, 0, 0);
        dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
        const startRotation = dude.rotationQuaternion!.clone();    
            
        scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

        let distance = 0;
        let step = 0.01;
        let p = 0;

        scene.onBeforeRenderObservable.add(() => {
		    dude.movePOV(0, 0, step);
            distance += step;
              
            if (distance > track[p].dist) {
                    
                dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
                p +=1;
                p %= track.length; 
                if (p === 0) {
                    distance = 0;
                    dude.position = new Vector3(-6, 0, 0);
                    dude.rotationQuaternion = startRotation.clone();
                }
            }
			
        })
    });
    
        //Skybox
        const skybox = MeshBuilder.CreateBox("skyBox", {size:150}, scene);
        const skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb").then(() => {
            const ground = scene.getMeshByName("ground");
            ground!.receiveShadows = true;
        });


        return scene;
    };

    walk = (turn: number, dist: number) => {
        this.turn = turn;
        this.dist = dist;
        return {turn, dist};
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

export default new AddingShadows();