/**
 * Example Code #04 for ECG course
 * Render some objects including their coordinate systems with THREE.js
 * 
 * Needs THREE.js installed with npm (see https://threejs.org/docs/index.html#manual/en/introduction/Installation)
 * Code inspired and copied in parts from: "AR and VR Using the WebXR API", Rakesh Baruah (Book)
 * Earth textures from Computer Graphics course at TU Berlin (Prof. M. Alexa)
 * 
 * This code is meant to illustrate how transformations work.
 *
 * @summary Render some objects with THREE.js
 * @author Uwe Hahne, uwe.hahne (ät) hs-furtwangen.de
 *
 * Created at     : 2021-11-03 15:34:32 
 * Last modified  : 2022-03-09 17:13:21
 */


import * as THREE from '../node_modules/three/build/three.module.js';

/* ---- Copied from Three.js examples folder ---- */
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _normalMatrix = new THREE.Matrix3();

class VertexNormalsHelper extends THREE.LineSegments {

	constructor( object, size = 1, color = 0xff0000 ) {

		let nNormals = 0;

		const objGeometry = object.geometry;

		if ( objGeometry && objGeometry.isGeometry ) {

			console.error( 'THREE.VertexNormalsHelper no longer supports Geometry. Use BufferGeometry instead.' );
			return;

		} else if ( objGeometry && objGeometry.isBufferGeometry ) {

			nNormals = objGeometry.attributes.normal.count;

		}

		//

		const geometry = new THREE.BufferGeometry();

		const positions = new THREE.Float32BufferAttribute( nNormals * 2 * 3, 3 );

		geometry.setAttribute( 'position', positions );

		super( geometry, new THREE.LineBasicMaterial( { color, toneMapped: false } ) );

		this.object = object;
		this.size = size;
		this.type = 'VertexNormalsHelper';

		//

		this.matrixAutoUpdate = false;

		this.update();

	}

	update() {

		this.object.updateMatrixWorld( true );

		_normalMatrix.getNormalMatrix( this.object.matrixWorld );

		const matrixWorld = this.object.matrixWorld;

		const position = this.geometry.attributes.position;

		//

		const objGeometry = this.object.geometry;

		if ( objGeometry && objGeometry.isGeometry ) {

			console.error( 'THREE.VertexNormalsHelper no longer supports Geometry. Use BufferGeometry instead.' );
			return;

		} else if ( objGeometry && objGeometry.isBufferGeometry ) {

			const objPos = objGeometry.attributes.position;

			const objNorm = objGeometry.attributes.normal;

			let idx = 0;

			// for simplicity, ignore index and drawcalls, and render every normal

			for ( let j = 0, jl = objPos.count; j < jl; j ++ ) {

				_v1.set( objPos.getX( j ), objPos.getY( j ), objPos.getZ( j ) ).applyMatrix4( matrixWorld );

				_v2.set( objNorm.getX( j ), objNorm.getY( j ), objNorm.getZ( j ) );

				_v2.applyMatrix3( _normalMatrix ).normalize().multiplyScalar( this.size ).add( _v1 );

				position.setXYZ( idx, _v1.x, _v1.y, _v1.z );

				idx = idx + 1;

				position.setXYZ( idx, _v2.x, _v2.y, _v2.z );

				idx = idx + 1;

			}

		}

		position.needsUpdate = true;

	}

}
/* ---- End of copy from Three.js examples folder ---- */

main();
function main() {
    // create the context
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    })
    
    // create and set the perspective camera
    const angleOfView = 55;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 8, 30);
    // alternative orthographic
    // const left = -10;
    // const right = 10;
    // const top = 10;
    // const bottom = -20;
    // const nearPlane = 0.1;
    // const farPlane = 100;
    // const camera = new THREE.OrthographicCamera(
    //     left,
    //     right,
    //     top,
    //     bottom,
    //     nearPlane,
    //     farPlane
    // );
    // camera.position.set(0, 8, 40);

    // create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.3, 0.5, 0.8);

    // add fog
    const fog = new THREE.Fog("gray", 1, 100);
    scene.fog = fog;
    
    // GEOMETRY
    // Create the upright plane
    const planeWidth = 32;
    const planeHeight = 32;
    const planeGeometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight
    );
    planeGeometry.computeVertexNormals();

    // Create the cube
    const cubeSize = 4;
    const cubeGeometry = new THREE.BoxGeometry(
        cubeSize,
        cubeSize,
        cubeSize
    );
    // Create the Sphere
    const sphereRadius = 5;
    const sphereWidthSegments = 32;
    const sphereHeightSegments = 32;
    const sphereGeometry = new THREE.SphereGeometry(
        sphereRadius,
        sphereWidthSegments,
        sphereHeightSegments
    );


    // MATERIALS and TEXTURES
    const textureLoader = new THREE.TextureLoader();

    // plane
    const planeMaterial = new THREE.MeshStandardMaterial({
        color:'grey'        
    });

    // cube
    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 'pink'
    });

    // sphere
    const sphereTextureMap = textureLoader.load('textures/earth2.png');
    sphereTextureMap.wrapS = THREE.ClampToEdgeWrapping;
    sphereTextureMap.wrapT = THREE.ClampToEdgeWrapping;
    const sphereMaterial = new THREE.MeshStandardMaterial({
        map: sphereTextureMap,
        color: 'tan'
    });

    
    // LIGHTS
    // directional lighting
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 30, 30);
    scene.add(light);
    // ambient lighting
    const ambientColor = 0xaaaaff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    // MESH
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.translateY(-2);
    plane.translateX(1);
    plane.rotation.x = degToRad(-90);
    plane.rotation.z = degToRad(45); 
    //scene.add(plane);
    light.target = plane;
    scene.add(light.target);

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize + 1, 0);
    scene.add(cube);
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);

    // Add coordinate systems and plane normal
    const axesHelperScene = new THREE.AxesHelper( 10 );
    scene.add( axesHelperScene );
    const axesHelperCube = new THREE.AxesHelper( 5 );
    cube.add( axesHelperCube );
    const axesHelperSphere = new THREE.AxesHelper( 7 );
    sphere.add(axesHelperSphere);
    const axesHelperPlane = new THREE.AxesHelper( 4 );
    plane.add(axesHelperPlane);
    
    const normalHelperPlane = new VertexNormalsHelper( plane, 2, 0x00ff00, 1 );
    scene.add(normalHelperPlane);

    
    
    // DRAW
    function draw(time)
    {
        time *= 0.001;

        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.
            clientHeight;
            camera.updateProjectionMatrix();
        }

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;

        // sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        // sphere.rotation.z += 0.01;

        light.position.x = 20*Math.cos(time);
        light.position.y = 20*Math.sin(time);

        gl.render(scene, camera);
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    // SET ANIMATION LOOP
    
    // UPDATE RESIZE
}

function resizeGLToDisplaySize(gl) {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width != width || canvas.height != height;
    if (needResize) {
        gl.setSize(width, height, false);
    }
    return needResize;
}

function degToRad(grad)
{
  return (grad/180.0)*Math.PI;
}



