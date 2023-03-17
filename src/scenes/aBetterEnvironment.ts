import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Texture, SceneLoader, Tools, Logger } from "@babylonjs/core";
import "@babylonjs/loaders";
import { CreateSceneClass } from "../createScene";

export class ABetterEnvironment implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 2, Math.PI / 2.5, 200, new Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(4, 1, 0), scene);

        //Create Village ground
        const groundMat = new StandardMaterial("groundMat");
        groundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/villagegreen.png");
        groundMat.diffuseTexture.hasAlpha = true;
        const ground = MeshBuilder.CreateGround("ground", {width:40, height: 40});
        ground.material = groundMat;
        ground.position.y = -0.02;

        //create large ground for valley environment
        const largeGroundMat = new StandardMaterial("largeGroundMat");
        largeGroundMat.roughness = 100;
        largeGroundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/valleygrass.png");
        const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", {width:400, height:400, subdivisions: 1500, minHeight:0, maxHeight: 10});
        largeGround.material = largeGroundMat;
        largeGround.position.y = -0.01; //ensures the two grounds do not fight and cause flickering
        
        //create

        //SceneLoader.ImportMeshAsync("","https://assets.babylonjs.com/meshes/", "valleyvillage.glb");
        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "village.glb", scene).then(function(result){
            var meshes = result.meshes;
            //调整模型位置
            //meshes[0].position.y = -meshes[0].getBoundingInfo().boundingBox.centerWorld.y;
            // 将模型与地面对齐
            //var modelHeight = meshes[0].getBoundingInfo().boundingBox.maximumWorld.y - meshes[0].getBoundingInfo().boundingBox.minimumWorld.y;
            //console.log("meshes[0].position.y: " + meshes[0].position.y + " meshes[0].getBoundingInfo().boundingBox.maximumWorld.y " + meshes[0].getBoundingInfo().boundingBox.maximumWorld.y + " meshes[0].getBoundingInfo().boundingBox.minimumWorld.y : " + meshes[0].getBoundingInfo().boundingBox.minimumWorld.y);
            meshes[0].position.y = 0;
            //var modelWeight = meshes[0].getBoundingInfo().boundingBox.maximumWorld.x - meshes[0].getBoundingInfo().boundingBox.minimumWorld.x;
            //console.log("meshes[0].position.x: " + meshes[0].position.x + " meshes[0].getBoundingInfo().boundingBox.maximumWorld.x " + meshes[0].getBoundingInfo().boundingBox.maximumWorld.x + " meshes[0].getBoundingInfo().boundingBox.minimumWorld.x : " + meshes[0].getBoundingInfo().boundingBox.minimumWorld.x);
            meshes[0].position.x = 1.9;
            //var modelDeep = meshes[0].getBoundingInfo().boundingBox.maximumWorld.z - meshes[0].getBoundingInfo().boundingBox.minimumWorld.z;
            //console.log("meshes[0].position.z: " + meshes[0].position.z + " meshes[0].getBoundingInfo().boundingBox.maximumWorld.z " + meshes[0].getBoundingInfo().boundingBox.maximumWorld.z + " meshes[0].getBoundingInfo().boundingBox.minimumWorld.z : " + meshes[0].getBoundingInfo().boundingBox.minimumWorld.z);
            meshes[0].position.z = 2.5;

            var groundHeight = ground.getBoundingInfo().boundingBox.maximumWorld.y - ground.getBoundingInfo().boundingBox.minimumWorld.y;
            ground.position.y = 0.01;
        });

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

export default new ABetterEnvironment();