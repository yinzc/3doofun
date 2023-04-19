import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, FreeCamera, MeshBuilder, PointerDragBehavior, SceneLoader, BoundingBoxGizmo, Mesh, UtilityLayerRenderer, Color3, SixDofDragBehavior, MultiPointerScaleBehavior, TransformNode, AttachToBoxBehavior } from "@babylonjs/core";
import { GUI3DManager, PlanePanel, HolographicButton } from "@babylonjs/gui";
import { CreateSceneClass } from "../createScene";
import "@babylonjs/loaders";

export class MeshBehaviors implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        var scene = new Scene(engine);
        this.showDebug(scene);
        //scene = this.dragAlongAnAxis(scene, canvas);
        //scene = await this.sixDirectionsExample(scene, canvas);
        scene = await this.attachToxBoxBehaviorExample(scene, canvas);
        return scene;
    };

    attachToxBoxBehaviorExample = async (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 5, -5), scene);
        freeCamera.setTarget(Vector3.Zero());
        freeCamera.attachControl(canvas, true);
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        var ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6, subdivisions: 2 }, scene);
        ground.position.y = -1;
        scene.createDefaultXRExperienceAsync();
        // 以容器形式从文件或数据源异步加载资产到场景中
        SceneLoader.LoadAssetContainer("https://models.babylonjs.com/", "seagulf.glb", scene, function (container) {
            // Create the 3D UI manager
            var manager = new GUI3DManager(scene);
            // Add loaded file to the scene
            container.addAllToScene();
            // Scale and position the loaded model(First mesh loaded from gltf is the root node)
            container.meshes[0].scaling.scaleInPlace(0.002);
            // wrap in bounding box mesh to avoid picking perf hit
            var gltfMesh = container.meshes[0] as Mesh;
            var boundingBox =  BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(gltfMesh);
            // Create bounding box gizmo
            var utilLayer = new UtilityLayerRenderer(scene);
            utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;
            var gizmo = new BoundingBoxGizmo(Color3.FromHexString("#0984e3"), utilLayer);
            gizmo.attachedMesh = boundingBox;
            // Create behaviors to drag and scale with pointers in VR
            var sixDofDragBehavior = new SixDofDragBehavior();
            boundingBox.addBehavior(sixDofDragBehavior);
            var multiPointerScaleBehavior = new MultiPointerScaleBehavior();
            boundingBox.addBehavior(multiPointerScaleBehavior);
            // Create app bar
            var appBar = new TransformNode("");
            appBar.scaling.scaleInPlace(0.2);
            var panel = new PlanePanel();
            panel.margin = 0;
            panel.rows = 1;
            manager.addControl(panel);
            panel.linkToTransformNode(appBar);
            for (let index = 0; index < 2; index++) {
                var button = new HolographicButton("orientation");
                panel.addControl(button);
                button.text = "B#" + panel.children.length;
                if(index == 0){
                    button.onPointerClickObservable.add(function() {
                        if (gizmo.attachedMesh) {
                            gizmo.attachedMesh = null;
                            boundingBox.removeBehavior(sixDofDragBehavior);
                            boundingBox.removeBehavior(multiPointerScaleBehavior);
                        } else {
                            gizmo.attachedMesh = boundingBox;
                            boundingBox.addBehavior(sixDofDragBehavior);
                            boundingBox.addBehavior(multiPointerScaleBehavior);
                        }
                    });
                }
            }
            // attach app bar to bounding box
            var behavior = new AttachToBoxBehavior(appBar);
            boundingBox.addBehavior(behavior);
        });
        return scene;
    }

    multiPointerScaleBehaviorExample = async (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 5, -5), scene);
        freeCamera.setTarget(Vector3.Zero());
        freeCamera.attachControl(canvas, true);
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        var ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6, subdivisions: 2 }, scene);
        ground.position.y = -1;
        scene.createDefaultXRExperienceAsync();
        // 以容器形式从文件或数据源异步加载资产到场景中
        SceneLoader.LoadAssetContainer("https://models.babylonjs.com/", "seagulf.glb", scene, function (container) {
            // Add loaded file to the scene
            container.addAllToScene();
            // Scale and position the loaded model
            container.meshes[0].scaling.scaleInPlace(0.002);
            // wrap in bounding box mesh to avoid picking perf hit
            var gltfMesh = container.meshes[0] as Mesh;
            var boundingBox =  BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(gltfMesh);
            // Create bounding box gizmo
            var utilLayer = new UtilityLayerRenderer(scene);
            utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;
            var gizmo = new BoundingBoxGizmo(Color3.FromHexString("#0984e3"), utilLayer);
            gizmo.attachedMesh = boundingBox;
            // Create behaviors to drag and scale with pointers in VR
            var sixDofDragBehavior = new SixDofDragBehavior();
            boundingBox.addBehavior(sixDofDragBehavior);
            var multiPointerScaleBehavior = new MultiPointerScaleBehavior();
            boundingBox.addBehavior(multiPointerScaleBehavior);
        });
        return scene;

    }
    sixDirectionsExample = async (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 5, -5), scene);
        freeCamera.setTarget(Vector3.Zero());
        freeCamera.attachControl(canvas, true);
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        var ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6, subdivisions: 2 }, scene);
        ground.position.y = -1;
        //scene.createDefaultXRExperienceAsync({}).then((xr) => {});
        scene.createDefaultXRExperienceAsync();
        // 以容器形式从文件或数据源异步加载资产到场景中
        SceneLoader.LoadAssetContainer("https://models.babylonjs.com/", "seagulf.glb", scene, function (container) {
            // Add loaded file to the scene
            container.addAllToScene();
            container.meshes[0].scaling.scaleInPlace(0.002);
            var gltfMesh = container.meshes[0] as Mesh;
            var boundingBox =  BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(gltfMesh);
            var utilLayer = new UtilityLayerRenderer(scene);
            utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;
            var gizmo = new BoundingBoxGizmo(Color3.FromHexString("#0984e3"), utilLayer);
            gizmo.attachedMesh = boundingBox;
            var sixDofDragBehavior = new SixDofDragBehavior();
            boundingBox.addBehavior(sixDofDragBehavior);
            var multiPointerScaleBehavior = new MultiPointerScaleBehavior();
            boundingBox.addBehavior(multiPointerScaleBehavior);
        });
        return scene;
    }
    dragAlongAnAxis = (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(1, 5, -10), scene);
        freeCamera.setTarget(Vector3.Zero());
        var hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.7;
        var sphere = MeshBuilder.CreateSphere("sphere", { segments: 16, diameter: 2 }, scene);
        sphere.rotation.x = Math.PI / 2;
        sphere.position.y = 1;
        var ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6, subdivisions: 2 }, scene);
        // Create pointerDragBehavior in the desired mode
        //var pointerDragBehavior = new PointerDragBehavior({});
        //该行为使用了 dragPlaneNormal 选项来指定拖动平面法线的方向。
        //其中，Vector3(0, 1, 0) 表示一个以 Y 轴为法线的平面，即一个水平面。
        //这意味着被绑定该行为的物体只能在水平方向上进行拖拽移动，不能竖直方向上被拖拽。可以通过修改传递给 Vector3() 的参数来指定不同方向的平面。
        //var pointerDragBehavior = new PointerDragBehavior({ dragPlaneNormal: new Vector3(0, 1, 0) });
        //该行为使用 dragAxis 选项来指定拖动轴的方向。
        //Vector3(0, 1, 0) 表示一个以 Y 轴为拖动轴的向量，即物体只能在垂直于 Y 轴的方向上进行拖拽。
        var pointerDragBehavior = new PointerDragBehavior({ dragAxis: new Vector3(0, 1, 0) });
        //用于指定物体是否应沿着其自身的方向进行拖动。
        //当 useObjectOrientationForDragging 设置为 true 时，物体会始终根据其本地坐标系沿着拖动轴移动，这意味着无论物体在世界空间中的朝向如何，它都将保持相同的方向并沿着指定的拖动轴移动。
        //当 useObjectOrientationForDragging 设置为 false 时，物体将以与世界坐标系相同的方式沿着拖动轴移动，这意味着即使在旋转或缩放后，物体也将始终沿着相同的方向移动。
        pointerDragBehavior.useObjectOrientationForDragging = false;
        pointerDragBehavior.onDragStartObservable.add((event) => {
            console.log("drag started");
            console.log(event);
        });
        pointerDragBehavior.onDragObservable.add((event) => {
            console.log("dragging");
            console.log(event);
        });
        pointerDragBehavior.onDragEndObservable.add((event) => {
            console.log("drag ended");
            console.log(event);
        });
        //禁止使用指针拖拽行为（PointerDragBehavior）来移动当前附加物体。
        //设置为false表示不允许，而默认值是true。
        //当该属性被设置为false时，用户将无法通过鼠标或触摸等方式移动或拖拽该物体。
        //pointerDragBehavior.moveAttached = false;
        sphere.addBehavior(pointerDragBehavior);
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

export default new MeshBehaviors();