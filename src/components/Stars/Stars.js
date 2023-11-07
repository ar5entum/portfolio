import { useRef } from 'react'
import { Canvas,  useFrame} from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute } from "three";
import css from './Stars.css'

const GradientMesh = () => {
  const cameraRef = useRef();
  useFrame(() => {
    cameraRef.current.rotation.z += 0.0005;
  });

  // Define the dimensions and subdivisions of the plane
  const width = 10;  // Width of the plane
  const height = 10; // Height of the plane
  const widthSegments = 100; // Number of subdivisions along the width
  const heightSegments = 100; // Number of subdivisions along the height

  // Calculate the step size for vertices
  const widthStep = width / widthSegments;
  const heightStep = height / heightSegments;

  // Initialize arrays to hold vertices and faces
  const vertices = [];
  const indices = [];

  // Generate vertices
  for (let y = 0; y <= heightSegments; y++) {
    for (let x = 0; x <= widthSegments; x++) {
      const xPos = x * widthStep - width / 2;
      const yPos = y * heightStep - height / 2;
      const zPos = -1 * Math.pow(Math.cos(Math.pow(xPos, 2)) - Math.sin(Math.pow(yPos, 2)),2) // You can set a custom z-position if needed

      vertices.push(xPos, yPos, zPos);
    }
  }

  // Generate faces (indices)
  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < widthSegments; x++) {
      const vertexIndex = y * (widthSegments + 1) + x;
      indices.push(
        vertexIndex,
        vertexIndex + 1,
        vertexIndex + widthSegments + 1,
        vertexIndex + 1,
        vertexIndex + widthSegments + 2,
        vertexIndex + widthSegments + 1
      );
    }
  }

  // Create a custom BufferGeometry
  const customGeometry = new BufferGeometry();
  customGeometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  customGeometry.setIndex(indices);

  return (<points ref={cameraRef} rotation={[-1, 0, 0]} geometry={customGeometry}>
    {/* <planeGeometry args={[5, 5, 64, 64]} /> */}
    <pointsMaterial size={0.01}/>
    </points>);
}

const Gradient = () => (
  <div className={css.scene}>
  <Canvas className={css.canvas}
  style={{height:"100vh"}}>
    <GradientMesh/>
    <pointLight position={[0, 5, 0]} intensity={10} color="#fff" />
  </Canvas>
  </div>)            
  
export default Gradient