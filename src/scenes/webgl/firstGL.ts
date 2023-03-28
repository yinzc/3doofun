import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight } from "@babylonjs/core";
import { CreateSceneClass } from "../../createScene";

export class FirstGL implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        var gl = canvas.getContext("webgl2");
        //确认WebGL支持
        if (!gl) {
            alert("WebGL not supported");
        }
        //使用完全不透明的黑色清除所有像素
        gl?.clearColor(0.0, 0.0, 0.0, 1.0);
        //用上面指定的颜色清除所有缓冲区
        gl?.clear(gl.COLOR_BUFFER_BIT);

        const scene = new Scene(engine);
        this.showDebug(scene);
        const arcRotateCamera = new ArcRotateCamera("arcRotateCamera", -Math.PI / 1.5, Math.PI / 5, 15, new Vector3(0, 0, 0), scene);
        arcRotateCamera.attachControl(canvas, true);
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(1, 1, 0), scene);
        
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

export default new FirstGL();