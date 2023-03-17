import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SpotLight, Color3, StandardMaterial, MeshBuilder, Mesh, SceneLoader, CubeTexture, Texture, Material } from "@babylonjs/core";
import "@babylonjs/loaders"
import { CreateSceneClass } from "../createScene";

export class StreetLights implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", 3 * Math.PI / 2, Math.PI / 2.2, 50, Vector3.Zero(), scene);
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 50, 0), scene);
        hemisphericLight.intensity = 0.1;
        SceneLoader.ImportMeshAsync("","https://assets.babylonjs.com/meshes/", "lamp.babylon").then(() => {
            const lampLight = new SpotLight("lampLight", Vector3.Zero(), new Vector3(0, -1, 0), 0.8 * Math.PI, 0.01, scene);
            lampLight.diffuse = Color3.Yellow();
            lampLight.parent = scene.getMeshByName("bulb")

            const lamp = scene.getMeshByName("lamp");
            lamp!.position = new Vector3(2, 0, 2); 
            lamp!.rotation = Vector3.Zero();
            lamp!.rotation.y = -Math.PI / 4;

            const lamp3 = lamp!.clone("lamp3", null);
            lamp3!.position.z = -8;

            const lamp1 = lamp!.clone("lamp1", null);
            lamp1!.position.x = -8;
            lamp1!.position.z = 1.2;
            lamp1!.rotation.y = Math.PI / 2;

            const lamp2 = lamp1!.clone("lamp2", null);
            lamp2!.position.x = -2.7;
            lamp2!.position.z = 0.8;
            lamp2!.rotation.y = -Math.PI / 2;

        });

        //Skybox
        const skybox = MeshBuilder.CreateBox("skyBox", {size: 150}, scene);
        const skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial; 

        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb").then(() => {
            const ground = scene.getMeshByName("ground");
            if (ground?.material) {
                const material = ground.material as StandardMaterial;
                material.maxSimultaneousLights = 5;
            }
        });

        // hemisphericLight.intensity = 0.5;
        // //add a spotlight and later after a mesh lamp post and a bulb have been created
        // //then will make the post a parent to the bulb and the bulb to the parent
        // const lampLight = new SpotLight("lampLight", Vector3.Zero(), new Vector3(0, -1, 0), Math.PI, 1, scene);
        // lampLight.diffuse = Color3.Yellow();
        // //lampLight.specular = new Color3(1, 1, 1);
        // //lampLight.intensity = 1;

	    // //shape to extrude
	    // const lampShape = [];
        // for(let i = 0; i < 20; i++) {
        //     lampShape.push(new Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
        // }
	    // lampShape.push(lampShape[0]); //close shape

	    // //extrusion path
        // const lampPath = [];
	    // lampPath.push(new Vector3(0, 0, 0));
	    // lampPath.push(new Vector3(0, 10, 0));
        // for(let i = 0; i < 20; i++) {
        //     lampPath.push(new Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
        // }
        // lampPath.push(new Vector3(3, 11, 0));

        // const yellowMat = new StandardMaterial("yellowMat");
        // yellowMat.emissiveColor = Color3.Yellow();

	    // //extrude lamp
	    // const lamp = MeshBuilder.ExtrudeShape("lamp", {cap: Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5});
	
        // //add bulb
        // const bulb = MeshBuilder.CreateSphere("bulb", {diameterX: 1.5, diameterZ: 3});
        // bulb.material = yellowMat;
        // bulb.parent = lamp;
        // bulb.position.x = 2;
        // bulb.position.y = 10.5;
        // lampLight.parent = bulb;
        // const ground = MeshBuilder.CreateGround("ground", {width:50, height: 50});
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

export default new StreetLights();