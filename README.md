# ecg_SoSe2022
Repository for course "Echtzeit-Computergrafik" in summer term 2022 at HS Furtwangen University. 

## First meeting on 15.03.2022
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
  - [Final code](/ex01/index.html)


## Things we need later
### HTTPS
- See [this article](https://medium.com/webisora/how-to-enable-https-on-live-server-visual-studio-code-5659fbc5542c) on how to enable _https_ for the Visual Studio Code LiveServer extension. Some details from this article are the following:
- Alternatively follow these instructions
  -   Install mkcert: <https://github.com/FiloSottile/mkcert>
  -   Obtain a local certificate: `mkcert -install && mkcert -key-file snowpack.key -cert-file snowpack.crt localhost`
  -   Run `npm run start-secure`
  -   Go to <https://localhost:8080/ar.html>
- Or [these](https://medium.com/@jonsamp/how-to-set-up-https-on-localhost-for-macos-b597bcf935ee)


