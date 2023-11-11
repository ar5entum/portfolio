import { useRef } from 'react'
import { Canvas,  useFrame} from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute } from "three";
import { CameraControls } from '@react-three/drei';

import css from './Mesh.css'
const math = require('mathjs')

const exp = '0.15*(x^2 + sin(3x) + z^2 + sin(3z))'
const lr = 0.1

const calculateY = (x0, z0) => {
  let scope = {x: x0, z: z0}
  return math.evaluate(exp, scope)
}

const partialX = (x0,z0) => {
  let scope = {x: x0, z: z0}
  return math.derivative(exp, 'x').evaluate(scope);
}

const partialZ = (x0,z0) => {
  let scope = {x: x0, y: z0}
  return math.derivative(exp, 'y').evaluate(scope);
}

const GradientMesh = () => {

  // Define the dimensions and subdivisions of the plane
  const width = 10;  // Width of the plane
  const height = 10; // Height of the plane
  const widthSegments = 50; // Number of subdivisions along the width
  const heightSegments = 50; // Number of subdivisions along the height

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
      const zPos = y * heightStep - height / 2;
      const yPos = calculateY(xPos, zPos)

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

  const cameraControlRef = useRef(null);

	useFrame(() => {  
		cameraControlRef.current?.rotate(.001, 0, true)
	})

  return (<mesh geometry={customGeometry}>
    <meshBasicMaterial wireframe color={'#98C1D9'}/>
    <CameraControls makeDefault ref={cameraControlRef} polarAngle={0.9}/>
    </mesh>);
}

const SphereMesh = () => {
  const {x, z} = {x:(Math.random() * 10) - 5, z:(Math.random() * 10) - 5}

  const ref = useRef();
  useFrame(() => {
    const xPos = ref.current.position.x -= lr*partialX(ref.current.position.x,ref.current.position.z);
    const zPos = ref.current.position.z -= lr*partialZ(ref.current.position.x,ref.current.position.z);
    ref.current.position.y = calculateY(xPos, zPos)
  });
  return (<mesh ref={ref} position={[x,calculateY(x,z), z]}>
    <sphereGeometry args={[.1, 10, 10]}/>
    <meshBasicMaterial color={'#EE6C4D'}/>

  </mesh>)
}

const Mesh = () => {
  
  return(
  <div className={css.scene}>
  <Canvas 
  className={css.canvas} 
  style={{height:"100vh"}}
  >
      <GradientMesh/>
    <SphereMesh/>
    <pointLight position={[0, 5, 0]} intensity={10} color="#fff" />
  </Canvas>
  </div>)         }   
  
export default Mesh