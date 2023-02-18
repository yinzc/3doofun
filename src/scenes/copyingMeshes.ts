import { ArcRotateCamera, Color3, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, Vector4 } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";

export class CopyingMeshes implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        const scene = new Scene(engine);
        this.showDebug(scene);

        /** Set camera and Light */
        const arcRotateCamera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);
        
        this.buildDwellings();
        //const house = this.buildHouse(2); //width of house 1 or 2;
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
    buildDwellings = () => {
        const ground = this.buildGround();

        const detached_house = this.buildHouse(1);
        detached_house!.rotation.y = - Math.PI / 16 ;
        detached_house!.position.x = -6.8;
        detached_house!.position.z = 2.5;

        const semi_house = this.buildHouse(2);
        semi_house!.rotation.y = -Math.PI / 16;
        semi_house!.position.x = -4.5;
        semi_house!.position.z = 3;

        const places = []; // each entry is an array [house type, rotation, x, z]
        places.push([1, -Math.PI/16, -6.8, 2.5]);
        places.push([2, -Math.PI / 16, -4.5, 3 ]);
        places.push([2, -Math.PI / 16, -1.5, 4 ]);
        places.push([2, -Math.PI / 3, 1.5, 6 ]);
        places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
        places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
        places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
        places.push([1, 5 * Math.PI / 4, 0, -1 ]);
        places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
        places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
        places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
        places.push([2, Math.PI / 1.9, 4.75, -1 ]);
        places.push([1, Math.PI / 1.95, 4.5, -3 ]);
        places.push([2, Math.PI / 1.9, 4.75, -5 ]);
        places.push([1, Math.PI / 1.9, 4.75, -7 ]);
        places.push([2, -Math.PI / 3, 5.25, 2 ]);
        places.push([1, -Math.PI / 3, 6, 4 ]);

        //Create instances from the first two that were built
        const houses = [];
        for (let i=0; i<places.length; i++) {
            if (places[i][0] === 1) {
                houses[i] = detached_house?.createInstance("house" + i);
            } else {
                houses[i] = semi_house?.createInstance("house" + i);
            }
            houses[i]!.rotation.y = places[i][1];
            houses[i]!.position.x = places[i][2];
            houses[i]!.position.z = places[i][3];
        }
        return houses;
    }

    buildGround = () => {
        //color
        const groundMaterial = new StandardMaterial("groundMaterial");
        groundMaterial.diffuseColor = new Color3(0, 1, 0);
        const ground = MeshBuilder.CreateGround("ground", {width:15, height:16});
        ground.material = groundMaterial;
    }

    buildHouse = (width = 1) => {
        const box = this.buildBox(width);
        const roof = this.buildRoof(width);
        return Mesh.MergeMeshes([box, roof], true, false, undefined, false, true);
    }

    buildBox = (width = 1) => {
        //texture
        const boxMaterial = new StandardMaterial("boxMaterial");
        if (width == 2) {
            boxMaterial.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png");
        }else {
            boxMaterial.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png");
        }
        // options parameter to set different images on each side
        const faceUV = [];
        if (width == 2) {
            faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
            faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
            faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
            faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
        }
        else {
            faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
            faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
            faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
            faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
        }
        // top 4 and bottom 5 not seen so not set

        /** World Objects */
        const box = MeshBuilder.CreateBox("box", {width: width, faceUV: faceUV, wrap: true});
        box.material = boxMaterial;
        box.position.y = 0.5;
        return box;
    }

    buildRoof = (width = 1) => {
        //texture
        const roofMaterial = new StandardMaterial("roofMaterial");
        roofMaterial.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg");
        const roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3,height: 1.2,tessellation: 3});
        roof.material = roofMaterial;
        roof.scaling.x = 0.75;
        roof.scaling.y = width;
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 1.22;
        return roof;
    }
}

export default new CopyingMeshes();