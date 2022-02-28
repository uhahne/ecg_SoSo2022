import * as THREE from "../node_modules/three/build/three.module.js";

// global scene values
var gl, glCanvas, camera, scene, renderer, cube;
var controller, reticle;
var counter = 0;

// global xr value
var xrSession = null;
var xrViewerPose;
var hitTestSource = null;
var hitTestSourceRequested = false;

var materials;

// to display debug information
const info = document.getElementById('info');
const ar_button = document.getElementById('ar_button');


loadScene();
checkForARSupport();

function loadScene() {
    // setup the WebGL context
    glCanvas = document.createElement('canvas');
    gl = glCanvas.getContext('webgl', { antialias: true });

    // setup the components of a Three.js scene
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    );

    scene = new THREE.Scene();

    // scene content
    var cubeGeometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
    var cubeMaterial = new THREE.MeshPhongMaterial({color: 0x89CFF0});
    cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    scene.add( cube );

    // light
    var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    materials = [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
        new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
    ];

    // renderer
    renderer = new THREE.WebGLRenderer({
        canvas: glCanvas,
        context: gl
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.CylinderBufferGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);
    // controller click event listener
    function onSelect() {
        console.log("on select fired...");
        info.innerHTML = 'on select fired...';
        // generate a random color for the geometry
        var material = new THREE.MeshPhongMaterial({
            //color: 0xffffff * Math.random()
            color: 0xffffff
        });
        // create the mesh for the geometry and its material
        var mesh = new THREE.Mesh(geometry, material);
        // TODO: position the geometry at the position of the reticle
        mesh.applyMatrix4(reticle.matrix); // THIS IS A KEY FUNCTION
        // randomly set the geometry’s scale
        //mesh.scale.y = Math.random() * 2 + 1;
        scene.add(mesh);
    }

    // scene content
    controller = renderer.xr.getController(0);  // TODO: find documentation for the 0 besides the book
    // https://threejs.org/docs/#api/en/renderers/webxr/WebXRManager.getController does not explain it
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    // "reticle" is a conventional term used to describe a visual marker for hit testing. 
    // The shape of the reticle we will use will be a green ring rotated 90 degrees to 
    // be parallel with the ground.
    reticle = new THREE.Mesh(
        new THREE.RingBufferGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: "#00FF00" })
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
}

function checkForARSupport()
{
    // check if AR is supported
    const msg = 'check if AR is supported: ';
    console.log(msg)
    printMessage(msg, true);
    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        if (supported) {
            printMessage('immersive-ar is supported, click button to enter', false)
            // define and add a button to enter XR
            ar_button.addEventListener('click',
                onRequestSession);
            ar_button.innerHTML = "Enter XR";
        }
        else {
            printMessage('immersive-ar not supported, but', false)
            navigator.xr.isSessionSupported('inline')
                .then((supported) => {
                    if (supported) {
                        const msg = 'inline session supported';
                        console.log(msg)
                        printMessage(msg, false);
                    }
                    else {
                        const msg = 'inline not supported';
                        console.log(msg)
                        printMessage(msg, false);
                    };
                })
        }
    })
    .catch((reason) => {
        const msg = `Catch: WebXR not supported: ${reason}`;
        console.log(msg)
        printMessage(msg, false);
    });
}



function printMessage(msg, printDebug) {
    const currentDiv = document.getElementById("info");
    // and give it some content
    let debugPrefix;
    if (printDebug)
    {
        debugPrefix = 'WebXR debug: ';
    }
    else{
        debugPrefix = ' ';
    }
    const newContent = document.createTextNode(debugPrefix + msg);
    // add the text node to the newly created div
    currentDiv.appendChild(newContent);
}

function onRequestSession() {
    console.log("requesting session");
    navigator.xr.requestSession('immersive-ar',
        {
            requiredFeatures: ["local", "hit-test"],
            optionalFeatures: ["dom-overlay", "local-floor"],
            domOverlay: { root: document.getElementById('overlay') }
            //domOverlay: { root: document.getElementById('button') }
        })
        .then(onSessionStarted)
        .catch((reason) => {
            console.log('request disabled: ' + reason);
        });
}

function onSessionStarted(session) {
    // handle the XR session once it has been created
    console.log('starting session');
    ar_button.removeEventListener('click', onRequestSession);
    ar_button.addEventListener('click', endXRSession);
    ar_button.innerHTML = "STOP AR";
    xrSession = session;

    // Show which type of DOM Overlay got enabled (if any)
    if (session.domOverlayState) {
        info.innerHTML = 'DOM Overlay type: ' + session.domOverlayState.type;
    }

    xrSession.addEventListener("end", endXRSession);
    setupWebGLLayer().then(() => {
        renderer.xr.setReferenceSpaceType('local');
        renderer.xr.setSession(xrSession);
        animate();
    })
}

function setupWebGLLayer() {
    // connect the WebGL context to the XR session
    return gl.makeXRCompatible().then(() => {
        xrSession.updateRenderState({
            baseLayer: new XRWebGLLayer(xrSession, gl)
        });
    });
}

function animate() {
    // begin the animation loop
    renderer.setAnimationLoop(render);
}

function render(time, frame) {
    counter = counter + 1;
    if (frame) {
        var referenceSpace = renderer.xr.getReferenceSpace('local');
        var session = frame.session;
        // viewerPose provided by Spatial Tracking Module
        xrViewerPose = frame.getViewerPose(referenceSpace);
        if (hitTestSourceRequested === false) {
            session.requestReferenceSpace("viewer").then((referenceSpace) => {
                //info.innerHTML = 'requestReferenceSpace returns: ' + referenceSpace;
                session.requestHitTestSource({space: referenceSpace})
                .then((source) => {
                    hitTestSource = source;
                    hitTestSourceRequested = true;
                    //info.innerHTML = 'hitTestSource: ' + hitTestSource + ' Frame counter: ' + counter;
                })
            });

            session.addEventListener("end", () => {
                hitTestSourceRequested = false;
                hitTestSource = null;
            });
        }

        if (hitTestSource) {
            //info.innerHTML = 'hitTestSource (true): ' + hitTestSource;
            var hitTestResults = frame.getHitTestResults(hitTestSource);
            //info.innerHTML = 'hitTestResults.length: ' + hitTestResults.length;
            if (hitTestResults.length > 0) {
                var hit = hitTestResults[0];
                //info.innerHTML = ' Frame counter: ' + counter;
                info.innerHTML = 'hit...matrix: ' + hit.getPose(referenceSpace).transform.matrix;
                //hitTestSourceRequested = false;
                reticle.visible = true;
                reticle.material.color = "#0000FF";
                reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
                
                  
            } else {
                reticle.visible = false;
                reticle.material.color = "#00FF00";
            }
        }
        else {
            //info.innerHTML = 'hitTestSource (false): ' + hitTestSource;
        }
    }


    // issue the draw command to the GPU
    renderer.render(scene, camera);
}

function endXRSession() {
    if (xrSession) {
        xrSession.end()
            .then(() => {
                xrSession.ended = true;
                onSessionEnd();
            })
            .catch((reason) => {
                console.log('session not ended because ' + reason);
                onSessionEnd();
            })
    }
    else { onSessionEnd(); }
}

function onSessionEnd() {
    xrSession = null;
    console.log('session ended');
    ar_button.innerHTML = "START AR";
    ar_button.removeEventListener('click', endXRSession);
    ar_button.addEventListener('click', onRequestSession);
    window.requestAnimationFrame(render);
}
