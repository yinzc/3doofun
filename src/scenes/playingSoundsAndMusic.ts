import { HaveALookAround } from './haveALookAround';
import { AdvancedDynamicTexture, Button, Control, StackPanel } from '@babylonjs/gui';
import { Engine, Scene, Vector3, HemisphericLight, Sound, AudioEngine, FreeCamera, MeshBuilder, AssetsManager, DirectionalLight, StandardMaterial, Color3, PointLight, Texture, Analyser, EngineFactory, Mesh } from "@babylonjs/core";
import { CreateSceneClass } from "../createScene";
import cameraActionAndEvent from './cameraActionAndEvent';

export class PlayingSoundsAndMusic implements CreateSceneClass {
    createScene = async (
        engine: Engine, 
        canvas: HTMLCanvasElement
    ) : Promise<Scene> => {
        let scene = new Scene(engine);
        //this.showDebug(scene);
        //scene = this.simpleMusicPlaybackExample(scene, canvas);
        //scene = this.playingSoundsWithInteraction(scene, canvas);
        //scene = this.playingSoundesBasicProperties(scene, canvas);
        //scene = this.playingSoundSprites(scene, canvas);
        //scene = this.playingSoundsTogether(scene, canvas);
        //scene = this.loadingASoundFromAnArrayBuffer(scene, canvas);
        //scene = this.loadingASoundFromTheMicrophone(scene, canvas);
        //scene = this.loadingASoundWithTheAssetManager(scene, canvas);
        //scene = this.spatialSound3D(scene, canvas);
        //scene = this.soundAttachedToAMesh(scene, canvas);
        //scene = this.spatialDirectionalSound(scene, canvas);
        scene = this.fullAudioExample(engine, scene, canvas);
        return scene;
    };

    fullAudioExample = (engine: Engine, scene: Scene, canvas: HTMLCanvasElement) => {
        //var engine = scene.getEngine();
        var directionalLight = new DirectionalLight("directionalLight", new Vector3(-2, -5, 2), scene);
        var pointLight = new PointLight("pointLight", new Vector3(2, -5, -2), scene);

        var freeCamera = new FreeCamera("freeCamera", new Vector3(15, -8, -40), scene);
        freeCamera.attachControl(canvas, true);

        var ground = MeshBuilder.CreatePlane("ground", {size: 400}, scene);
        var groundMat = new StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new Color3(1, 1, 1);
        groundMat.backFaceCulling = false;
        ground.material = groundMat;
        ground.position = new Vector3(5, -10, -15);
        ground.rotation = new Vector3(Math.PI / 2, 0, 0);

        var music = new Sound("Violons", "https://playground.babylonjs.com/sounds/violons18.wav", scene, null, { loop: true, autoplay: true});
        
        var audioEngine: AudioEngine = new AudioEngine();
        //audioEngine.audioContext!.resume();

        var myAnalyser = new Analyser(scene);
        audioEngine.connectToAnalyser(myAnalyser);
        myAnalyser.FFT_SIZE = 32;
        myAnalyser.SMOOTHING = 0.9;

        var spatialBoxArray: Mesh[] = [];
        var spatialBox;
        var color: {r:number, g:number, b:number};
        var boxMaterial;
        for (let index = 0; index < myAnalyser.FFT_SIZE / 2; index++) {
            spatialBox = MeshBuilder.CreateBox("spatialBox" + index, {size: 2}, scene);
            spatialBox.position = new Vector3(index * 2, 0, 0);
            boxMaterial = new StandardMaterial("spatialBoxMat" + index, scene);
            color = hsvToRgb(index / (myAnalyser.FFT_SIZE) / 2 * 360, 100, 50);
            boxMaterial.diffuseColor = new Color3(color.r, color.g, color.b);
            spatialBox.material = boxMaterial;
            spatialBoxArray.push(spatialBox); 
        }
        scene.registerBeforeRender(() => {
            var workingArray = myAnalyser.getByteFrequencyData();
            for (let i = 0; i < myAnalyser.getFrequencyBinCount(); i++) {
                spatialBoxArray[i].scaling.y = workingArray[i] / 32;
            }
        });

        scene.gravity = new Vector3(0, -0.9, 0);
        scene.collisionsEnabled = true;
        freeCamera.checkCollisions = true;
        freeCamera.applyGravity = true;
        freeCamera.ellipsoid = new Vector3(1, 1, 1);
        
        ground.checkCollisions = true;

        function hsvToRgb(h: number, s: number, v: number): {r:number, g:number, b:number} {
            var r: number, g: number, b: number, i: number, f: number, p: number, q: number, t: number;
            h = Math.max(0, Math.min(360, h));
            s = Math.max(0, Math.min(100, s));
            v = Math.max(0, Math.min(100, v));
            s /= 100;
            v /= 100;
            if (s == 0) {
                r = g = b = v;
                return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
            }
            h /= 60;
            i = Math.floor(h);
            f = h - i;
            p = v * (1 - s);
            q = v * (1 - s * f);
            t = v * (1 - s * (1 - f));
            switch (i) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                default: r = v; g = p; b = q;
            }
            return {r: r, g: g, b: b};
        }
        return scene;
    }
    
    spatialDirectionalSound = (scene: Scene, canvas: HTMLCanvasElement) => {
        var directionalLight = new DirectionalLight("directionalLight", new Vector3(-2, -5, 2), scene);
        var pointLight = new PointLight("pointLight", new Vector3(2, -5, -2), scene);
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, -8, -20), scene);
        freeCamera.attachControl(canvas, true);

        var ground = MeshBuilder.CreatePlane("ground", {size: 400}, scene);
        var groundMat = new StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new Color3(1, 1, 1);
        groundMat.specularColor = new Color3(0, 0, 0);
        groundMat.backFaceCulling = false;
        ground.material = groundMat;
        ground.position = new Vector3(5, -10, -15);
        ground.rotation = new Vector3(Math.PI / 2, 0, 0);

        var box = MeshBuilder.CreateBox("box", {size: 2}, scene);
        var boxMat = new StandardMaterial("boxMat", scene);
        boxMat.diffuseTexture = new Texture("https://playground.babylonjs.com/textures/crate.png", scene);
        box.material = boxMat;
        box.position = new Vector3(10, -9, 0);

        var cylinder = MeshBuilder.CreateCylinder("cylinder", {diameter: 1}, scene);
        cylinder.parent = box;
        cylinder.position = new Vector3(box.scaling.x, 0, 0);
        cylinder.scaling.y = box.scaling.y
        cylinder.scaling.x = box.scaling.x
        cylinder.scaling.z = 0;
        cylinder.rotation.y = Math.PI;
        cylinder.rotation.z = -Math.PI / 2;

        var violons11 = new Sound("Violons11", "https://playground.babylonjs.com/sounds/violons11.wav", scene, null, { loop: true, autoplay: true});
        violons11.setDirectionalCone(90, 180, 0);
        violons11.setLocalDirectionToMesh(new Vector3(1, 0, 0));
        violons11.attachToMesh(box);

        scene.gravity = new Vector3(0, -0.9, 0);
        scene.collisionsEnabled = true;
        freeCamera.checkCollisions = true;
        freeCamera.applyGravity = true;
        freeCamera.ellipsoid = new Vector3(1, 1, 1);
        ground.checkCollisions = true;
        return scene;
    }

    soundAttachedToAMesh = (scene: Scene, canvas: HTMLCanvasElement) => {
        var directionalLight = new DirectionalLight("directionalLight", new Vector3(-2, -5, 2), scene);
        var pointLight = new PointLight("pointLight", new Vector3(2, -5, -2), scene);
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, -8, -20), scene);
        freeCamera.attachControl(canvas, true);
        // Then apply collisions and gravity to the active camera
        freeCamera.checkCollisions = true;
        freeCamera.applyGravity = true;
        // Set the ellipsoid around the camera (e.g. your player's size)
        freeCamera.ellipsoid = new Vector3(1, 1, 1);

        var ground = MeshBuilder.CreatePlane("ground", {size: 400}, scene);
        var groundMat = new StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new Color3(1, 1, 1);
        groundMat.backFaceCulling = false;
        ground.material = groundMat;
        ground.position = new Vector3(5, -10, -15);
        ground.rotation = new Vector3(Math.PI / 2, 0, 0);
        //finally , say which mesh will be collisionable
        ground.checkCollisions = true;

        var box = MeshBuilder.CreateBox("box", {size: 2}, scene);
        var boxMat = new StandardMaterial("boxMat", scene);
        boxMat.diffuseTexture = new Texture("https://playground.babylonjs.com/textures/crate.png", scene);
        box.position = new Vector3(10, -9, 0);
        box.material = boxMat;

        var music = new Sound("Violons", "https://playground.babylonjs.com/sounds/violons11.wav", scene, function(){
            console.log("music is ready to be played");
        }, { loop: true, autoplay: true});
        // Sound will now follow the mesh position
        music.attachToMesh(box);
        // Set gravity for the scene (g force on Y-axis)
        scene.gravity = new Vector3(0, -0.9, 0);
        // Enable Collisions
        scene.collisionsEnabled = true;
        var alpha = 0;
        scene.registerBeforeRender(function(){
            // Moving the box will automatically move the associated sound attached to it
            box.position = new Vector3(Math.cos(alpha) * 30, -9, Math.sin(alpha) * 30);
            alpha += 0.01;
        });
        return scene;
    }

    spatialSound3D = (scene: Scene, canvas: HTMLCanvasElement) => {
        let freeCamera = new FreeCamera("freeCamera", new Vector3(0, 5, 0), scene);
        freeCamera.attachControl(canvas, true);

        let directionalLight = new DirectionalLight("directionalLight", new Vector3(0, -5, 2), scene);
        //Ground
        let ground = MeshBuilder.CreateGround("ground", {width: 600, height: 600}, scene);
        ground.material = new StandardMaterial("groundMat", scene);
        (ground.material as StandardMaterial).diffuseColor = new Color3(1, 1, 1);
        (ground.material as StandardMaterial).backFaceCulling = false;
        ground.position = new Vector3(0, 0, 0);
        ground.rotation = new Vector3(Math.PI / 2, 0, 0);

        var sphereMat = new StandardMaterial("sphereMat", scene);
        sphereMat.diffuseColor = Color3.Purple();
        sphereMat.backFaceCulling = false;
        sphereMat.alpha = 0.3;

        var sphereMusicOne = MeshBuilder.CreateSphere("sphereMusicOne", {segments:20, diameter: 50}, scene);
        sphereMusicOne.material = sphereMat;
        sphereMusicOne.position = new Vector3(60, 0, 0);

        var sphereMusicTwo = MeshBuilder.CreateSphere("sphereMusicTwo", {segments:20, diameter: 200}, scene);
        sphereMusicTwo.material = sphereMat;
        sphereMusicTwo.position = new Vector3(-100, 0, 0);

        var sphereMusicThree = MeshBuilder.CreateSphere("sphereMusicThree", {segments:20, diameter: 60}, scene);
        sphereMusicThree.material = sphereMat;
        sphereMusicThree.position = new Vector3(0, 0, 100);
        
        // var assetsManager = new AssetsManager(scene);
        // console.log("assetsManager ... ...", assetsManager);
        // let musicOne: Sound, musicTwo: Sound, musicThree: Sound;
        // let musicOneTask = assetsManager.addBinaryFileTask("musicOneTask", "https://playground.babylonjs.com/sounds/violons11.wav");
        // musicOneTask.onSuccess = function(task) {
        //     musicOne = new Sound("musicOne", task.data, scene, soundReady, { loop: true, spatialSound: true, maxDistance: 25});
        //     musicOne.setPosition(new Vector3(60, 0, 0));
        // };

        // let musicTwoTask = assetsManager.addBinaryFileTask("musicTwoTask", "https://playground.babylonjs.com/sounds/violons18.wav");
        // musicTwoTask.onSuccess = function(task) {
        //     musicTwo = new Sound("musicTwo", task.data, scene, soundReady, { loop: true, spatialSound: true});
        //     musicTwo.setPosition(new Vector3(-100, 0, 0));
        // };

        // let musicThreeTask = assetsManager.addBinaryFileTask("musicThreeTask", "https://playground.babylonjs.com/sounds/cellolong.wav");
        // musicThreeTask.onSuccess = function(task) {
        //     musicThree = new Sound("musicThree", task.data, scene, soundReady, { loop: true, spatialSound: true, maxDistance: 30});
        //     musicThree.setPosition(new Vector3(0, 0, 100));
        // };
        // var soundsReady = 0;
        // console.log("soundsReady ... ...", soundsReady);
        // function soundReady() {
        //     soundsReady++;
        //     if (soundsReady === 3) {
        //         musicOne.play();
        //         musicTwo.play();
        //         musicThree.play();
        //     }
        // }
        // let audioContext = new AudioEngine().audioContext!;
        // audioContext.resume().then(() => {
        //     assetsManager.load();
        // });

        var musicOne = new Sound("musicOne", "https://playground.babylonjs.com/sounds/violons11.wav", scene, 
            null, { loop: true, autoplay: true, spatialSound: true, maxDistance: 25, useCustomAttenuation: true});
        musicOne.setPosition(new Vector3(60, 0, 0));
        musicOne.attachToMesh(sphereMusicOne);
    
        var musicTwo = new Sound("musicTwo", "https://playground.babylonjs.com/sounds/violons18.wav", scene, 
            null, { loop: true, autoplay: true, spatialSound: true, useCustomAttenuation: true});
        musicTwo.setPosition(new Vector3(-100, 0, 0));
        musicTwo.attachToMesh(sphereMusicTwo);
        
        var musicThree = new Sound("musicThree", "https://playground.babylonjs.com/sounds/cellolong.wav", scene, 
            null, { loop: true, autoplay: true, spatialSound: true, maxDistance: 30, useCustomAttenuation: true});
        musicThree.setPosition(new Vector3(0, 0, 100));
        musicThree.attachToMesh(sphereMusicThree);

        scene.gravity = new Vector3(0, -0.9, 0);
        scene.collisionsEnabled = true;

        freeCamera.checkCollisions = true;
        freeCamera.applyGravity = true;
        freeCamera.ellipsoid = new Vector3(1, 1, 1);
        ground.checkCollisions = true;
        return scene;
    }

    loadingASoundWithTheAssetManager = (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 0, 0), scene);
        var muiscone: Sound, muisctwo: Sound, muiscthree: Sound;
        var assetsManager = new AssetsManager(scene);
        console.log("assetsManager ... ...", assetsManager);
        var binaryTask = assetsManager.addBinaryFileTask("Violons18 tesk", "https://playground.babylonjs.com/sounds/violons18.wav");
        binaryTask.onSuccess = function(task) {
            muiscone = new Sound("Violons18", task.data, scene, soundReady, {loop: true});
        };
        var binaryTask2 = assetsManager.addBinaryFileTask("Violons11 tesk", "https://playground.babylonjs.com/sounds/violons11.wav");
        binaryTask2.onSuccess = function(task) {
            muisctwo = new Sound("Violons11", task.data, scene, soundReady, {loop: true});
        };
        var binaryTask3 = assetsManager.addBinaryFileTask("Cellolong tesk", "https://playground.babylonjs.com/sounds/cellolong.wav");
        binaryTask3.onSuccess = function(task) {
            muiscthree = new Sound("Cellolong", task.data, scene, soundReady, {loop: true});
        };
        var soundsReady = 0;
        console.log("soundsReady ... ...", soundsReady);
        function soundReady() {
            soundsReady++;
            if (soundsReady === 3) {
                muiscone.play();
                muisctwo.play();
                muiscthree.play();
            }
        }
        let audioContext = new AudioEngine().audioContext!;
        audioContext.resume().then(() => {
            assetsManager.load();
        });
        return scene;
    }

    loadingASoundFromTheMicrophone = (scene: Scene, canvas: HTMLCanvasElement) => {
        let engine = scene.getEngine();
        let freeCamera = new FreeCamera("freeCamera", new Vector3(0, 5, -10), scene);
        freeCamera.setTarget(Vector3.Zero());
        freeCamera.attachControl(canvas, true);

        let hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.7;

        let sphere = MeshBuilder.CreateSphere("sphere", {segments: 16, diameter: 2}, scene);
        const constraints = {  audio: true, video: false };

        function handleSuccess(stream: MediaStream) {
            const audioTracks = stream.getAudioTracks();
            console.log('Got stream with constraints:', constraints);
            console.log(`Using audio device: ${audioTracks[0].label}`);
            stream.addEventListener('inactive', () => {
                console.log('Stream ended ... ...');
            });
            (window as any).stream = stream; // make variable available to browser console
            var bjsSound = new Sound("mic", stream, scene);
            bjsSound.attachToMesh(sphere);
            bjsSound.play();
        }

        function handleError(error: any) {
            console.log('navigator.getUserMedia error: ', error);
        }
        navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
        return scene;
    }

    loadingASoundFromAnArrayBuffer = (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 0, 0), scene);
        this.loadArrayBufferFromURL("https://playground.babylonjs.com/sounds/gunshot.wav", scene);
        return scene;
    }

    loadArrayBufferFromURL(urlToSound: string, scene: Scene) {
        console.log("loadArrayBufferFromURL... ...");
        var request = new XMLHttpRequest();
        request.open('GET', urlToSound, true);
        request.responseType = 'arraybuffer';
        request.timeout = 10000;
        var audioData : Sound;
        request.onreadystatechange = function() {
            console.log("request.readyState ... ...:", request.readyState);
            if (request.readyState === 4) {
                if (request.status === 200) {
                    let audioContext = new AudioEngine().audioContext!;
                    if (audioContext.state === "suspended") {
                        audioContext.resume();
                    }
                    audioData = new Sound("FromArrayBuffer", request.response, scene, soundReadyToBePlayed);
                    function soundReadyToBePlayed(){
                        audioData.play();
                    }
                    console.log("audioData", audioData);
                }
            }
        };
        request.send();
    }

    


    playingSoundsTogether = (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 0, 0), scene);
        var musicone = new Sound("MusicOne", "https://playground.babylonjs.com/sounds/violons11.wav", scene, soundReady, {loop: true});
        var musictwo = new Sound("MusicTwo", "https://playground.babylonjs.com/sounds/violons18.wav", scene, soundReady, {loop: true});
        var musicthree = new Sound("MusicThree", "https://playground.babylonjs.com/sounds/cellolong.wav", scene, soundReady, {loop: true});
        var soundsReady = 0;
        function soundReady() {
            soundsReady++;
            if (soundsReady === 3) {
                musicone.play();
                musictwo.play();
                musicthree.play();
            }
        }
        return scene;
    }

    playingSoundSprites = (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 0, 0), scene);
        var theSound = new Sound("allSounds", "https://playground.babylonjs.com/sounds/6sounds.mp3", scene, null, {autoplay: false});
        var isPlaying = 0;
        var soundArray = [
            [0.0, 5.000],
            [5.100, 6.600],
            [12.000, 1.600],
	        [14.000, 9.200],
	        [23.000, 7.900],
	        [31.000, 2.800],
        ];
        theSound.onended = function() {
            isPlaying = 0;
            console.log("not playing");
        };

        var advanceTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var uiPanel = new StackPanel();
        uiPanel.width = "220px";
        uiPanel.fontSize = "14px";
        uiPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        uiPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        advanceTexture.addControl(uiPanel);

        var button = Button.CreateSimpleButton("but", "Play All Sounds");
        button.paddingTop = "10px";
        button.width = "150px";
        button.height = "50px";
        button.color = "white";
        button.background = "green";
        button.onPointerDownObservable.add(function() {
            let audioContext = new AudioEngine().audioContext;
            audioContext!.resume().then(() => {
                if (isPlaying === 0) {
                    isPlaying = 1;
                    theSound.play();
                    console.log("playing");
                }
            });
            
        });
        uiPanel.addControl(button);

        var button1 = Button.CreateSimpleButton("but1", "Play Random Sound");
        button1.paddingTop = "10px";
        button1.width = "150px";
        button1.height = "50px";
        button1.color = "white";
        button1.background = "green";
        button1.onPointerDownObservable.add(function() {
            let audioContext = new AudioEngine().audioContext;
            audioContext!.resume().then(() => {
                if (isPlaying === 0) {
                    isPlaying = 1;
                    var randomSound = Math.floor(Math.random() * 6);
                    theSound.play(0, soundArray[randomSound][0], soundArray[randomSound][1]);
                    console.log("playing");
                }
            });
        });
        uiPanel.addControl(button1);

        return scene;
    }

    playingSoundesBasicProperties = (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 0, 0), scene);
        var playbackRate = 0.5;
        var volume = 0.1;
        var gunshot = new Sound("gunshot", "https://playground.babylonjs.com/sounds/gunshot.wav", scene, null, {autoplay: true, playbackRate: playbackRate, volume: volume});
        gunshot.onended = function() {
            console.log("Gunshot audio has ended");
            if (volume < 1) {
                volume += 0.1;
                gunshot.setVolume(volume);
            }
            playbackRate += 0.1;
            gunshot.setPlaybackRate(playbackRate);
        };
        window.addEventListener("keydown", function (evt) {
            // Press space key to fire
            if (evt.key === " ") {
                gunshot.play();
            }
        });
        window.addEventListener("mousedown", function (evt) {
            // Press space key to fire
            if (evt.button === 0) {
                gunshot.play();
            }
        });
        return scene;
    }
    playingSoundsWithInteraction = (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 0, 0), scene);
        var gunshot = new Sound("gunshot", "https://playground.babylonjs.com/sounds/gunshot.wav", scene);
        window.addEventListener("mousedown", function(evt) {
            // left click to fire
            if (evt.button === 0) {
                gunshot.play();
            }
        });
        
        window.addEventListener("keydown", function (evt) {
            // Press space key to fire
            if (evt.key === " ") {
                gunshot.play();
            }
        });
        return scene;
    }
    
    loadAndPlaySoundsWithACallback = (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 0, 0), scene);
        var music = new Sound("Violons", "https://playground.babylonjs.com/sounds/violons11.wav", scene, function() {
            music.play();
        }, {loop: true, autoplay: true});
        return scene;
    }
    simpleMusicPlaybackExample = (scene: Scene, canvas: HTMLCanvasElement) => {
        var freeCamera = new FreeCamera("freeCamera", new Vector3(0, 0, 0), scene);
        var music = new Sound("Violons", "https://playground.babylonjs.com/sounds/violons11.wav", scene, null, {loop: true, autoplay: true});
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

export default new PlayingSoundsAndMusic();