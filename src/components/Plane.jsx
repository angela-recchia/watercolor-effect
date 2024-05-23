import { useFBO } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { fboVertexShader } from "../Shaders/fbo/vertexShader";
import { fboFragmentShader } from "../Shaders/fbo/fragmentShader";

const Plane = () => {
  const { size, gl, camera } = useThree();
  const sphereRef = useRef();

  let targetA = useFBO();
  let targetB = useFBO();

  // white bg
  const whiteTarget = useFBO();
  const whiteScene = new THREE.Scene();
  const whiteBg = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshBasicMaterial({ color: "white" })
  );
  whiteScene.add(whiteBg);
  whiteBg.position.z = -1;
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
  whiteScene.add(box);

  const sourceTarget = useFBO();
  const fboScene = new THREE.Scene();
  const fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const fboMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      tPrev: { value: whiteTarget.texture },
      resolution: { value: new THREE.Vector4(size.width, size.height, 1, 1) },
    },
    vertexShader: fboVertexShader,
    fragmentShader: fboFragmentShader,
  });
  const fboQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fboMaterial);
  fboScene.add(fboQuad);

  const finalScene = new THREE.Scene();
  const finalQuad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({
      map: targetA.texture,
    })
  );

  finalScene.add(finalQuad);

  // render white bg at init
  gl.setRenderTarget(whiteTarget);
  gl.render(whiteScene, camera);

  useFrame(({ pointer, viewport, gl, scene, camera }) => {
    sphereRef.current.position.x = pointer.x * viewport.width * 0.5;
    sphereRef.current.position.y = pointer.y * viewport.height * 0.5;

    // rendering the source
    gl.setRenderTarget(sourceTarget);
    gl.render(scene, camera);

    // running the framebuffer ouput on the same texture and then swapping it
    gl.setRenderTarget(targetA);
    gl.render(fboScene, fboCamera);
    fboMaterial.uniforms.tDiffuse.value = sourceTarget.texture;
    fboMaterial.uniforms.tPrev.value = targetA.texture;

    // final output
    finalQuad.material.map = targetA.texture;
    gl.setRenderTarget(null);
    gl.render(finalScene, fboCamera);

    let temp = targetA;
    targetA = targetB;
    targetB = temp;
  }, 1);
  return (
    <>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="green" />
      </mesh>
    </>
  );
};

export default Plane;
