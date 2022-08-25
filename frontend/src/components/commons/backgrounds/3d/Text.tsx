import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from '@react-three/fiber'

type GLTFResult = GLTF & {
  nodes: {
    ft_trans: THREE.Mesh;
  };
  materials: {};
};

export default function Model(props: JSX.IntrinsicElements["group"]) {
	const { nodes } = useGLTF("/geometries/ft_trans.gltf") as GLTFResult;
	const ref = useRef<THREE.Mesh>(null!)

	let rotationSpeed : number = 0.001

	// if (ref.current.rotation.z === Math.PI * 2)
	// 	ref.current.rotation.z = 0

	// if (ref.current.rotation.z < Math.PI / 2 || ref.current.rotation.z > 3 * Math.PI / 2)
	// {
	// 	rotationSpeed = 0.001
	// }
	// else
	// 	rotationSpeed = 0.01

	

	useFrame((state, delta) => (
		ref.current.rotation.z += rotationSpeed
	))

	return (
		<group {...props} dispose={null}>
		<mesh
			ref={ref}
			receiveShadow
			scale={4}
			rotation={[Math.PI / 2, 0, - Math.PI / 3]}
			geometry={nodes.ft_trans.geometry}
		>
			<meshStandardMaterial wireframe wireframeLinewidth={0.5} />
		</mesh>
		</group>
	);
}

useGLTF.preload("/geometries/ft_trans.gltf");
