# ecg_WiSe2021_22
Repository for course "Echtzeit-Computergrafik" in winter term 2021 at HS Furtwangen University. 

## Notes for first meeting on 14.10.2021
- Setup development environment
  - [Visual Studio Code](https://code.visualstudio.com/) with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
  - Browser with WebGL support
  - Github
- Check WebGL resources
  - [Getting started with WebGL (Mozilla)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL)
  - [AR and VR Using the WebXR API, Rakesh Baruah](https://link.springer.com/book/10.1007%2F978-1-4842-6318-1)
  - [WebGL Fundamentals](https://webglfundamentals.org/)
  - [WebGL2 Fundamentals](https://webgl2fundamentals.org/)
  - [Awesome WebGL](https://project-awesome.org/sjfricke/awesome-webgl)
- Implement a WebGL Hello World
  - [Empty code we started with](/ex01/index_empty.html)
    - See [history](https://github.com/uhahne/ecg_WiSe2021_22/commits/main/ex01/index_empty.html) for the evolution of the code.
  - [Final code](/ex01/index.html)

## Notes from second meeting on 21.10.2021
- A closer look at the rendering pipeline
  - [Empty code to start with](/ex02_pipeline/ex02_pipeline_empty.js)
  - [Final code](/ex02_pipeline/ex02_pipeline.js)
  - Adjust the [index.html](/ex02_pipeline/index.html) to use the right JavaScript file.

## Notes from third meeting on 28.10.2021
- Step by step through the rendering pipeline and adjusting the shader code to get some effects
  - See [ex02_pipeline_shader.js](/ex02_pipeline/ex02_pipeline_shader.js) for a shader that results in checkered triangles.

## Notes for the fourth meeting on 04.11.2021
- Creating a 3D object (cube) and an animation
  - See [ex03_staticCube.js](ex03_rotatingCube/ex03_staticCube.js) for a first static version.
  - See [ex03_rotatingCube.js](ex03_rotatingCube/ex03_rotatingCube.js) for an animated version.
- Next step is to use THREE.js in order to simplify the definition of geometry (and using a scene graph) as well as lighting and materials. We further visualize the axes of the coordinate systems in order to better understand the applied transformations.
  - First, download Node.JS and install Three.js through NPM, the Node package manager
    - Download Node.js from https://nodejs.org/en/ and install it locally
    - Check installation with `node -v`
    - Installation of THREE.js with `npm install three`
    - Import it in your code via `import * as THREE from "../node_modules/three/build/three.module.js";`
  - See [ex04_earth.js](ex04_transformations/ex04_earth.js) for the complete code which will be explained and adjusted in the course.



