import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { BufferGeometry, Float32BufferAttribute } from "three";
import { CameraControls } from "@react-three/drei";

import css from "./Mesh.css";
import { useControls } from "leva";
const math = require("mathjs");

const Mesh = () => {
  const params = useControls({
    function: "0.15*(x^2 - z^2)",
    position: { x: Math.random() * 10 - 5, z: Math.random() * 10 - 5 },
    optimizer: {
      value: "sgd",
      options: ["momentum", "nestrov", "adagrad", "rmsprop", "adam"],
    },
    learning_rate: 0.1,
    momentum: 0.9,
    freeze: false,
  });

  const calculateY = (x0, z0) => {
    let scope = { x: x0, z: z0 };
    return math.evaluate(params.function, scope);
  };

  const partialX = (x0, z0) => {
    let scope = { x: x0, z: z0 };
    return math.derivative(params.function, "x").evaluate(scope);
  };

  const partialZ = (x0, z0) => {
    let scope = { x: x0, z: z0 };
    return math.derivative(params.function, "z").evaluate(scope);
  };

  const GradientMesh = () => {
    // Define the dimensions and subdivisions of the plane
    const width = 10; // Width of the plane
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
        const yPos = calculateY(xPos, zPos);

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
    customGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(vertices, 3)
    );
    customGeometry.setIndex(indices);

    const cameraControlRef = useRef(null);

    useFrame(() => {
      cameraControlRef.current?.rotate(!params.freeze * 0.001, 0, true);
    });

    return (
      <mesh geometry={customGeometry}>
        <meshBasicMaterial wireframe color={"#98C1D9"} />
        <CameraControls makeDefault ref={cameraControlRef} polarAngle={0.9} />
      </mesh>
    );
  };

  const SGD = (x, z, lr) => {
    const xPos = x - lr * partialX(x, z);
    const zPos = z - lr * partialZ(x, z);
    const yPos = calculateY(xPos, zPos);
    return [xPos, yPos, zPos];
  };

  const Momentum = (x, z, lr, beta, v) => {
    const dx = partialX(x, z);
    const dz = partialZ(x, z);

    // Update the velocity
    const vx = beta * v[0] + (1 - beta) * dx;
    const vz = beta * v[1] + (1 - beta) * dz;

    // Update the parameters
    const xPos = x - lr * vx;
    const zPos = z - lr * vz;
    const yPos = calculateY(xPos, zPos);
    return [xPos, yPos, zPos, [vx, vz]];
  };

  const Nestrov = (x, z, lr, beta, v) => {
    // Update the parameters with lookahead
    const xLookahead = x - beta * v[0];
    const zLookahead = z - beta * v[1];

    // Calculate gradients at lookahead position
    const dx = partialX(xLookahead, zLookahead);
    const dz = partialZ(xLookahead, zLookahead);

    // Update the velocity
    const vx = beta * v[0] + (1 - beta) * dx;
    const vz = beta * v[1] + (1 - beta) * dz;

    // Update the parameters
    const xPos = x - lr * vx;
    const zPos = z - lr * vz;
    const yPos = calculateY(xPos, zPos);
    return [xPos, yPos, zPos, [vx, vz]];
  };

  const Adagrad = (x, z, lr, G) => {
    const epsilon = 1e-8;
    // Calculate gradients at lookahead position
    const dx = partialX(x, z);
    const dz = partialZ(x, z);

    // Update the velocity
    const Gx = G[0] + dx ** 2;
    const Gz = G[1] + dz ** 2;

    // Update the parameters
    const xPos = x - (lr / (math.sqrt(Gx) + epsilon)) * dx;
    const zPos = z - (lr / (math.sqrt(Gz) + epsilon)) * dz;
    const yPos = calculateY(xPos, zPos);
    return [xPos, yPos, zPos, [Gx, Gz]];
  };

  const RMSProp = (x, z, lr, G, beta) => {
    const epsilon = 1e-8;
    // Calculate gradients at lookahead position
    const dx = partialX(x, z);
    const dz = partialZ(x, z);

    // Update the velocity
    const Gx = beta * G[0] + (1 - beta) * dx ** 2;
    const Gz = beta * G[1] + (1 - beta) * dz ** 2;

    // Update the parameters
    const xPos = x - (lr / (math.sqrt(Gx) + epsilon)) * dx;
    const zPos = z - (lr / (math.sqrt(Gz) + epsilon)) * dz;
    const yPos = calculateY(xPos, zPos);
    return [xPos, yPos, zPos, [Gx, Gz]];
  };

  const SphereMesh = () => {
    const [x, z] = [params.position.x, params.position.z];
    var velocity = [0.1, 0.1];
    var G = [0, 0];
    const ref = useRef();
    useFrame(() => {
      switch (params.optimizer) {
        case "sgd":
          [
            ref.current.position.x,
            ref.current.position.y,
            ref.current.position.z,
          ] = SGD(
            ref.current.position.x,
            ref.current.position.z,
            params.learning_rate
          );
          break;
        case "momentum":
          [
            ref.current.position.x,
            ref.current.position.y,
            ref.current.position.z,
            velocity,
          ] = Momentum(
            ref.current.position.x,
            ref.current.position.z,
            params.learning_rate,
            params.momentum,
            velocity
          );
          break;
        case "nestrov":
          [
            ref.current.position.x,
            ref.current.position.y,
            ref.current.position.z,
            velocity,
          ] = Nestrov(
            ref.current.position.x,
            ref.current.position.z,
            params.learning_rate,
            params.momentum,
            velocity
          );
          break;
        case "adagrad":
          [
            ref.current.position.x,
            ref.current.position.y,
            ref.current.position.z,
            G,
          ] = Adagrad(
            ref.current.position.x,
            ref.current.position.z,
            params.learning_rate,
            G
          );
          break;
        case "rmsprop":
          [
            ref.current.position.x,
            ref.current.position.y,
            ref.current.position.z,
            G,
          ] = RMSProp(
            ref.current.position.x,
            ref.current.position.z,
            params.learning_rate,
            G,
            params.momentum
          );
          break;
        default:
          [
            ref.current.position.x,
            ref.current.position.y,
            ref.current.position.z,
          ] = SGD(
            ref.current.position.x,
            ref.current.position.z,
            params.learning_rate
          );
      }
    });
    return (
      <mesh ref={ref} position={[x, calculateY(x, z), z]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshBasicMaterial color={"#EE6C4D"} />
      </mesh>
    );
  };

  return (
    <div className={css.scene}>
      <Canvas className={css.canvas} style={{ height: "100vh" }}>
        <GradientMesh />
        <SphereMesh />
        <pointLight position={[0, 5, 0]} intensity={10} color="#fff" />
      </Canvas>
    </div>
  );
};

export default Mesh;
