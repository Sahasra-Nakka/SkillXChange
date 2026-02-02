"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import getStarfield from "@/public/three/getStarfield";
import { getFresnelMat } from "@/public/three/getFresnelMat";

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    /* ======================
       Scene setup
    ====================== */
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2.5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    /* ======================
       Earth
    ====================== */
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const textureLoader = new THREE.TextureLoader();
    const geometry = new THREE.IcosahedronGeometry(1, 12);

    const earth = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({
        map: textureLoader.load("/textures/00_earthmap1k.jpg"),
        bumpMap: textureLoader.load("/textures/01_earthbump1k.jpg"),
        bumpScale: 0.04
      })
    );

    earthGroup.add(earth);
    earthGroup.add(new THREE.Mesh(geometry, getFresnelMat()));

    /* ======================
       Starfield
    ====================== */
    scene.add(getStarfield({ numStars: 2000 }));

    /* ======================
       Text
    ====================== */
    const fontLoader = new FontLoader();
    fontLoader.load("/fonts/helvetiker_bold.typeface.json", (font: any) => {
      const textGeometry = new TextGeometry("SKILLXCHANGE", {
        font,
        size: 1.6,
        height: 0.05
      });

      textGeometry.center();

      const textMesh = new THREE.Mesh(
        textGeometry,
        new THREE.MeshBasicMaterial({ color: 0x3f7cff })
      );

      textMesh.position.set(0, 2.2, -2);
      scene.add(textMesh);
    });

    /* ======================
       Light
    ====================== */
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(-2, 0.5, 1.5);
    scene.add(light);

    /* ======================
       Animation loop
    ====================== */
    const animate = () => {
      earth.rotation.y += 0.001;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    /* ======================
       Cleanup
    ====================== */
    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
}
