# Watercolor Effect

## Setup FBOs:

### Ping-pong texture

### create a FBO setup to take care of the calculations

1. sourceTarget: new render target (FBO)
2. fboScene: scene to run Framebuffer output shader
3. fboCamera: orthographic camera
4. fboMaterial: shader material that has as texture the sourceTarge texture, also previousTexture
5. fboQuad: planeMesh + fboMaterial to add to the fboScene. size 2x2 as the camera

### create FBO for final scene

1. finalScene
2. finalQuad: plane 2x2, basic material with a texture

### render loop

1. create 2 new render targets

2. render the source

- set render target to sourceTarget
- render main scene

3. running the ping pong

- set render target to targetA
- render fboscene
- set fboMaterial texture uniform to source target texture
- set fboMaterial previousTexture uniform to targetA texture

4. final outbut

- set final material map to targetA texture
- set render target null (screen)
- render final scene

5. swap targets
6. in fboFragment color + prev \* .9 to draw and dissolve

### set white bg

1. create whiteFBO
2. create scene with white plane z:-1
3. set initial frame to white target texture: tPrev
4. out of render loop: init render target to white target and render white scene
