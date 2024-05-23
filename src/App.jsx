import "./App.css";
import { Canvas } from "@react-three/fiber";
import Plane from "./components/Plane";
function App() {
  return (
    <>
      <Canvas>
        <Plane></Plane>
      </Canvas>
    </>
  );
}

export default App;
