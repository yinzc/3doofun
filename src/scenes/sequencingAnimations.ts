import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, UniversalCamera, MeshBuilder, StandardMaterial, Color3, SpotLight, Animation } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class SequencingAnimations implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);
        const directionalLigh = new DirectionalLight("directionalLight", new Vector3(0, -1, 0), scene);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, -1), scene);
        directionalLigh.intensity = 0.25;
        hemisphericLight.intensity = 0.5;
        var frameRate = 20;
        /** performers */
        //arcRotateCamera
        var universalCamera = new UniversalCamera("universalCamera", new Vector3(0, 3, -30), scene);

        //door
        var hinge = MeshBuilder.CreateBox("hinge", {}, scene);
        hinge.isVisible = false;
        var hingeMaterial = new StandardMaterial("hingeMaterial", scene);
        hingeMaterial.diffuseColor = Color3.Green();
        hinge.material = hingeMaterial;
        hinge.position.y = 2;

        var door = MeshBuilder.CreateBox("door", { width:2, height:4, depth:0.1 }, scene);
        var doorMaterial = new StandardMaterial("doorMaterial", scene);
        doorMaterial.diffuseColor = new Color3(1, 0, 0);
        door.material = doorMaterial;
        door.parent = hinge;
        door.position.x = -1;
        

        //Material
        var sphereMaterial = new StandardMaterial("sphereMaterial", scene);
        sphereMaterial.emissiveColor = new Color3(1, 1, 1);

        //lights
        var sphereLight = MeshBuilder.CreateSphere("sphereLight", { diameter: 0.2 }, scene);
        sphereLight.material = sphereMaterial;
        sphereLight.position = new Vector3(2, 3, 0.1);

        var sphereLights = [sphereLight];
        var lightPositions = [-2, 3, 6.9];

        for (var i = 0; i < 1; i++) {
            sphereLights.push(sphereLight.clone(""));
            sphereLights[i + 1].position = new Vector3(lightPositions[3 * i], lightPositions[3*i + 1], lightPositions[3 * i + 2]);

            var spotLights = [];
            var lightDirections = [-0.5, -0.25, 1, 0, 0, -1];
            for(var i = 0; i < sphereLights.length; i++) {
                spotLights[i] = new SpotLight("spotLight" + i, sphereLights[i].position, new Vector3(lightDirections[3 * i], lightDirections[3 * i + 1], lightDirections[3 * i + 2]), Math.PI / 8, 5, scene);
                spotLights[i].diffuse = new Color3(1, 1, 1);
                spotLights[i].specular = new Color3(0.5, 0.5, 0.5);
                spotLights[i].intensity = 0;
            }

            /*** animations */
            //for camera move forward
            var movein = new Animation("movein", "position", frameRate, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
            var movein_keys = [];
            movein_keys.push({ frame: 0, value: new Vector3(0, 5, -30) });
            movein_keys.push({ frame: frameRate * 3, value: new Vector3(0, 2, -10) });
            movein_keys.push({ frame: frameRate * 5, value: new Vector3(0, 2, -10) });
            movein_keys.push({ frame: frameRate * 8, value: new Vector3(-2, 2, 3) });
            movein.setKeys(movein_keys);

            //for camera to sweep round
            var rotate = new Animation("rotate", "rotation.y", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
            var rotate_keys = [];
            rotate_keys.push({ frame: 0, value: 0 });
            rotate_keys.push({ frame: frameRate * 9, value: 0 });
            rotate_keys.push({ frame: frameRate * 14, value: Math.PI });
            rotate.setKeys(rotate_keys);

            //for door to open and close
            var sweep = new Animation("sweep", "rotation.y", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
            var sweep_keys = [];
            sweep_keys.push({ frame: 0, value: 0 });
            sweep_keys.push({ frame: frameRate * 3, value: 0 });
            sweep_keys.push({ frame: frameRate * 5, value: Math.PI / 2 });
            sweep_keys.push({ frame: frameRate * 13, value: Math.PI / 2 });
            sweep_keys.push({ frame: frameRate * 15, value: 0 });
            sweep.setKeys(sweep_keys);

            //for light to brighten and dim
            var lightDimmer = new Animation("lightDimmer", "intensity", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
            var lightDimmer_keys = [];
            lightDimmer_keys.push({ frame: 0, value: 0 });
            lightDimmer_keys.push({ frame: frameRate * 7, value: 0 });
            lightDimmer_keys.push({ frame: frameRate * 10, value: 1 });
            lightDimmer_keys.push({ frame: frameRate * 14, value: 1 });
            lightDimmer_keys.push({ frame: frameRate * 15, value: 0 });
            lightDimmer.setKeys(lightDimmer_keys);

            //Run Clips
            scene.beginDirectAnimation(universalCamera, [movein, rotate], 0, frameRate * 25, false);
            scene.beginDirectAnimation(hinge, [sweep], 0, frameRate * 25, false);
            scene.beginDirectAnimation(spotLights[0], [lightDimmer], 0, frameRate * 25, false);
            scene.beginDirectAnimation(spotLights[1], [lightDimmer.clone()], 0, frameRate * 25, false);

            //Peripherals of Scene
            var ground = MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
            var wall1 = MeshBuilder.CreateBox("door", { width: 8, height: 6, depth: 0.1 }, scene);
            var wall1Material = new StandardMaterial("wall1Material", scene);
            wall1Material.diffuseColor = Color3.Green();
            wall1.position.x = -6;
            wall1.position.y = 3;

            var wall2 = MeshBuilder.CreateBox("door", { width: 4, height: 6, depth: 0.1 }, scene);
            wall2.position.x = 2;
            wall2.position.y = 3;

            var wall3 = MeshBuilder.CreateBox("door", { width: 2, height: 2, depth: 0.1 }, scene);
            wall3.position.x = -1;
            wall3.position.y = 5;

            var wall4 = MeshBuilder.CreateBox("door", { width: 14, height: 6, depth: 0.1 }, scene);
            wall4.position.x = -3;
            wall4.position.y = 3;
            wall4.position.z = 7;

            var wall5 = MeshBuilder.CreateBox("door", { width: 7, height: 6, depth: 0.1 }, scene);
            wall5.rotation.y = Math.PI / 2;
            wall5.position.x = -10;
            wall5.position.y = 3;
            wall5.position.z = 3.5;

            var wall6 = MeshBuilder.CreateBox("door", { width: 7, height: 6, depth: 0.1 }, scene);
            wall6.rotation.y = Math.PI / 2;
            wall6.position.x = 4;
            wall6.position.y = 3;
            wall6.position.z = 3.5;

            var roof = MeshBuilder.CreateBox("door", { width: 14, height: 7, depth: 0.1 }, scene);
            roof.rotation.x = Math.PI / 2;
            roof.position.x = -3;
            roof.position.y = 6;
            roof.position.z = 3.5;
        }
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

export default new SequencingAnimations();