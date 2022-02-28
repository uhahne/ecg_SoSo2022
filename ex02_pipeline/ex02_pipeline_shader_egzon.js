
/**
 * Example Code #02 for ECG course
 * Render two triangles (modified shader)
 *
 * @summary WebGL implementation of two triangles with some exemplary shader modification
 * @author Uwe Hahne, uwe.hahne@hs-furtwangen.de
 *
 * Created at     : 2021-11-03 15:29:39 
 * Last modified  : 2021-11-04 14:34:02
 */
 class WebGL {

    constructor() {
        
        this.lastTime = 0;
        /*========== Create a WebGL Context ==========*/
        /** @type {HTMLCanvasElement} */
        const canvas = document.querySelector("#c");
        /** @type {WebGLRenderingContext} */
        this.gl = canvas.getContext('webgl');
        if (!this.gl) {
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
        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(twoTrianglesVertices), this.gl.STATIC_DRAW);
    
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
        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(twoTrianglesColors), this.gl.STATIC_DRAW);
    
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
        
        uniform float uTime;
        varying vec4 vFragColor;
        void main() {
            gl_FragColor = vFragColor;
            gl_FragColor.r = clamp(abs(sin(uTime*0.001)), 0.2, 1.0);     
        }    
        
        `;
    
        /*====== Create shaders ======*/
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(vertexShader, vsSource);
        this.gl.shaderSource(fragmentShader, fsSource);
        
        /*====== Compile shaders ======*/
        this.gl.compileShader(vertexShader);
        if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the vertex shader: ' + this.gl.getShaderInfoLog(vertexShader));
            this.gl.deleteShader(vertexShader);
            return null;
        }
        else {
            console.log('Vertex shader successfully compiled.');
        }
        this.gl.compileShader(fragmentShader);
        if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the fragment shader: ' + this.gl.getShaderInfoLog(fragmentShader));
            this.gl.deleteShader(fragmentShader);
            return null;
        }
        else {
            console.log('Fragment shader successfully compiled.');
        }
    
        /*====== Create shader program ======*/
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
    
        /*====== Link shader program ======*/
        this.gl.linkProgram(this.program);
        this.gl.useProgram(this.program);
    
    
        /*========== Connect the attributes with the vertex shader ===================*/        
        const posAttribLocation = this.gl.getAttribLocation(this.program, "aPosition");
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.vertexAttribPointer(posAttribLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(posAttribLocation);
    
        const colorAttribLocation = this.gl.getAttribLocation(this.program, "aColor");
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.vertexAttribPointer(colorAttribLocation, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(colorAttribLocation);
    
        /*========== Connect the uniforms with the vertex shader ===================*/
        const projMatrixLocation = this.gl.getUniformLocation(this.program, 'uProjectionMatrix');
        const projectionMatrix = mat4.create();
        const fieldOfView = 45 * Math.PI / 180; // in radians
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        // note: glmatrix.js always has the first argument as the destination to receive the result.
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        mat4.translate(projectionMatrix, // destination matrix
            projectionMatrix, // matrix to translate
            [1.0, 0.0, 0.0]);
        //mat4.ortho(projectionMatrix,-2.0,1.0,-1.0,1.0,0.0,4.0);
        console.log('ProjectionMatrix: %s', mat4.str(projectionMatrix));
        this.gl.uniformMatrix4fv(projMatrixLocation, false, projectionMatrix);
    
        const modelMatrixLocation = this.gl.getUniformLocation(this.program, 'uModelViewMatrix');
        const modelViewMatrix = mat4.create();
        mat4.rotate(modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to rotate
            0.52,// amount to rotate in radians
            [0, 1, 0]); // axis to rotate around (Y)
        console.log('ModelviewMatrix: %s', mat4.str(modelViewMatrix));
        this.gl.uniformMatrix4fv(modelMatrixLocation, false, modelViewMatrix);
            
        const timeLocation = this.gl.getUniformLocation(this.program, 'uTime');
        this.gl.uniform1f(timeLocation, this.lastTime)

        /*========== Drawing ======================== */
        this.gl.clearColor(1, 1, 1, 1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Draw the points on the screen
        this.mode = this.gl.TRIANGLES;
        this.first = 0;
        this.count = 6;
    }

    startAnimation() {
        window.requestAnimationFrame((currentTimestamp)=> {
            this.draw(currentTimestamp);
        });
    }

    draw(currentTimestamp) {
        let deltaTime = currentTimestamp - this.lastTime;
        this.lastTime = currentTimestamp;

        this.updateTimeUniform();

        //actually draw
        this.gl.drawArrays(this.mode, this.first, this.count);
        this.startAnimation();
    }

    updateTimeUniform() {
        const timeLocation = this.gl.getUniformLocation(this.program, 'uTime');
        this.gl.uniform1f(timeLocation, this.lastTime)
    }
}

let webGl = new WebGL();
webGl.startAnimation();
let lastTime = 0;