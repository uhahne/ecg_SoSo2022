/**
 * Example Code #02 for ECG course
 * Render two triangles (empty code)
 *
 * @summary WebGL implementation of two triangles
 * @author Uwe Hahne, uwe.hahne (ät) hs-furtwangen.de
 *
 * Created at     : 2021-11-03 15:28:31 
 * Last modified  : 2021-11-04 12:05:44
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
    

    /*====== Define front-face buffer ======*/
    
    /*====== Define colors ======*/
    

    /*====== Define color buffer ======*/
    
    /*========== Shaders ==========*/

    /*====== Define shader sources ======*/
    const vsSource = `
            
    `;

    const fsSource = `
        precision mediump float;
        
            
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
    

    /*====== Link shader program ======*/
    


    /*========== Connect the attributes with the vertex shader ===================*/        
    
    /*========== Connect the uniforms with the vertex shader ===================*/
    
    /*========== Drawing ======================== */
    
} // be sure to close the main function with a curly brace.