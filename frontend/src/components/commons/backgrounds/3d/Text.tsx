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
	useFrame((state, delta) => (ref.current.rotation.z += 0.001))
	return (
		<group {...props} dispose={null}>
		<mesh
			ref={ref}
			receiveShadow
			scale={3}
			rotation={[Math.PI / 2, 0, 0]}
			geometry={nodes.ft_trans.geometry}
			material={nodes.ft_trans.material}
		/>
		</group>
	);
}

useGLTF.preload("/geometries/ft_trans.gltf");
