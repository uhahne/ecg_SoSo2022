/**
 * Example Code #02 for ECG course
 * Render two triangles (empty code)
 *
 * @summary WebGL implementation of two triangles
 * @author Uwe Hahne, uwe.hahne (ät) hs-furtwangen.de
 *
 * Created at     : 2021-11-03 15:28:31 
 * Last modified  : 2022-02-28 16:57:49
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

    /* TODO ====== Create shaders ======*/

    /* TODO ====== Compile shaders ======*/

    /* TODO ====== Create and link shader programs ======*/

    /*========== Connect the attributes with the vertex shader ===================*/        
    
    /*========== Connect the uniforms with the vertex shader ===================*/

        // define projection matrix

        // define modelview matrix

    /*========== Drawing ======================== */

} // be sure to close the main function with a curly brace.