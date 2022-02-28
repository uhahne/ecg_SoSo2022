/**
 * Example Code #02 for ECG course
 * Render two triangles (modified shader)
 *
 * @summary WebGL implementation of two triangles with some exemplary shader modification
 * @author Uwe Hahne, uwe.hahne (ät) hs-furtwangen.de
 *
 * Created at     : 2021-11-03 15:29:39 
 * Last modified  : 2021-11-04 12:05:46
 */


main();
function main() {
    /*========== Create a WebGL Context ==========*/
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector("#c");
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('WebGL unavailable');
    } else {
        console.log('WebGL is good to go');
    }

    /*========== Define and Store the Geometry ==========*/

    /*====== Define front-face vertices ======*/
    const twoTrianglesVertices = [
        // front triangle
        -1.0, -0.5, -2.0,
        0.0, -0.5, -2.0,
        -0.5, 0.5, -2.0,
    
        // back triangle
        0.0, -0.5, -3.0,
        1.0, -0.5, -3.0,
        0.5, 0.5, -3.0,
    ];

    /*====== Define front-face buffer ======*/
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(twoTrianglesVertices), gl.STATIC_DRAW);

    /*====== Define colors ======*/
    const twoTrianglesColors = [
        // front face
        1.0,  0.0,  0.0,  1.0,
        0.0,  1.0,  0.0,  1.0,
        0.0,  0.0,  1.0,  1.0,

        1.0,  0.0,  0.0,  1.0,
        1.0,  0.0,  0.0,  1.0,
        1.0,  0.0,  0.0,  1.0
    ];

    /*====== Define color buffer ======*/
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(twoTrianglesColors), gl.STATIC_DRAW);

    /*========== Shaders ==========*/

    /*====== Define shader sources ======*/
    const vsSource = `
        attribute vec4 aPosition;
        attribute vec4 aColor;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        varying vec4 vFragColor;

    
        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
            vFragColor = aColor;
        }    
    `;

    const fsSource = `
        precision mediump float;
        
        varying vec4 vFragColor;
        vec4 mixColorVertical;
        vec4 mixColorHorizontal;

        void main() {
            // create a checkered shading
            if( mod(gl_FragCoord.x,10.0) < 5.0 ) {  
                mixColorHorizontal = vFragColor;
            } else {
                mixColorHorizontal = vec4(1.0,1.0,1.0,2.0) 
                               - vFragColor;
            }
            if( mod(gl_FragCoord.y,10.0) < 5.0 ) {  
                mixColorVertical = vFragColor;
            } else {
                mixColorVertical = vec4(1.0,1.0,1.0,2.0) 
                               - vFragColor;
            }
            gl_FragColor = 0.6 * mixColorVertical + 0.4 * mixColorHorizontal;              
        }    
    `;

    /*====== Create shaders ======*/
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.shaderSource(fragmentShader, fsSource);
    
    /*====== Compile shaders ======*/
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the vertex shader: ' + gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
        return null;
    }
    else {
        console.log('Vertex shader successfully compiled.');
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the fragment shader: ' + gl.getShaderInfoLog(fragmentShader));
        gl.deleteShader(fragmentShader);
        return null;
    }
    else {
        console.log('Fragment shader successfully compiled.');
    }

    /*====== Create shader program ======*/
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    /*====== Link shader program ======*/
    gl.linkProgram(program);
    gl.useProgram(program);


    /*========== Connect the attributes with the vertex shader ===================*/        
    const posAttribLocation = gl.getAttribLocation(program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribLocation);

    const colorAttribLocation = gl.getAttribLocation(program, "aColor");
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttribLocation);

    /*========== Connect the uniforms with the vertex shader ===================*/
    const projMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix');
    const projectionMatrix = mat4.create();
    const fieldOfView = 45 * Math.PI / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    // note: glmatrix.js always has the first argument as the destination to receive the result.
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    mat4.translate(projectionMatrix, // destination matrix
        projectionMatrix, // matrix to translate
        [1.0, 0.0, 0.0]);
    //mat4.ortho(projectionMatrix,-2.0,1.0,-1.0,1.0,0.0,4.0);
    console.log('ProjectionMatrix: %s', mat4.str(projectionMatrix));
    gl.uniformMatrix4fv(projMatrixLocation, false, projectionMatrix);

    const modelMatrixLocation = gl.getUniformLocation(program, 'uModelViewMatrix');
    const modelViewMatrix = mat4.create();
    mat4.rotate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        0.52,// amount to rotate in radians
        [0, 1, 0]); // axis to rotate around (Y)
    console.log('ModelviewMatrix: %s', mat4.str(modelViewMatrix));
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelViewMatrix);
        
    /*========== Drawing ======================== */
    gl.clearColor(1, 1, 1, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Draw the points on the screen
    const mode = gl.TRIANGLES;
    const first = 0;
    const count = 6;
    gl.drawArrays(mode, first, count);
} // be sure to close the main function with a curly brace.