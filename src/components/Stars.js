import { useRef } from 'react'
import { Canvas,  useFrame } from '@react-three/fiber'
import css from './Stars.css'
import { UnrealBloomPass } from "three-stdlib";



const Star = ({position, color}) => {
  
  return (
    <mesh
      position={position} 
      scale={1}
      >
      <sphereGeometry args={[.02, 100, 50]} />
      <pointsMaterial color={color} opacity={0.7}/>
    </mesh>
  )
}

function starGenerator() {
  let stars = []
  for (var i = 0; i < 200; i++) {
    var x = Math.floor(Math.random() * 20 - 10);
    var y = Math.floor(Math.random() * 20 - 10);
    var z = Math.floor(Math.random() * 20 - 10);
    stars[i] = [x, y, z]
  }
  return stars
}

const stars = starGenerator().map((cords, i) =>
  (<Star key={i} position={cords} color="white" />)
)

// function Scene() {
//   return (
//     <div className={css.scene}>
//     <Canvas 
//     className={css.canvas}
//     style={{height:"100vh"}}
//     >
//      <PerspectiveCamera
//         // ref={cameraRef}
//         fov={75}
//         near={0.1}
//         far={1000}
//       /> 
//       {stars}
//     </Canvas>
//       </div>
//   )                                                                                                                                                                                                     
// }

const StarField = () => {
  const cameraRef = useRef();

  useFrame(() => {
    cameraRef.current.rotation.x += 0.0005;
    cameraRef.current.rotation.y += 0.0005;
  });
  return (<mesh ref={cameraRef}>
    {stars}</mesh>);
}

export default () => (
  <div className={css.scene}>
  <Canvas className={css.canvas}
  style={{height:"100vh"}}>
    <StarField/>
  </Canvas>
  </div>)                                                                                                                                                  