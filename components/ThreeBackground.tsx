"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import getStarfield from "public/three/getStarfield";
import { getFresnelMat } from "public/three/getFresnelMat";

export default function ThreeBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    ref.current.appendChild(renderer.domElement);

    // 🌍 Earth
    const earthGroup = new THREE.Group();
    earthGroup.scale.setScalar(4.6);
    earthGroup.position.set(0, -4.2, 0);
    scene.add(earthGroup);

    const loader = new THREE.TextureLoader();
    const geo = new THREE.IcosahedronGeometry(1, 12);

    const earth = new THREE.Mesh(
      geo,
      new THREE.MeshPhongMaterial({
        map: loader.load("/textures/00_earthmap1k.jpg"),
        bumpMap: loader.load("/textures/01_earthbump1k.jpg"),
        bumpScale: 0.04,
        specularMap: loader.load("/textures/02_earthspec1k.jpg")
      })
    );
    earthGroup.add(earth);

    const glow = new THREE.Mesh(geo, getFresnelMat());
    glow.scale.setScalar(1.02);
    earthGroup.add(glow);

    // ✨ Stars
    const stars = getStarfield({ numStars: 2500 });
    scene.add(stars);

    // ☀ Light
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(-5, 2, 5);
    scene.add(sun);

    // 🏷 Title
    new FontLoader().load("/fonts/helvetiker_bold.typeface.json", (font) => {
      const geo = new TextGeometry("SKILLXCHANGE", {
        font,
        size: 1.6,
        height: 0.05
      });

      geo.center();

      const mat = new THREE.MeshStandardMaterial({ color: 0x3f7cff });
      const text = new THREE.Mesh(geo, mat);

      text.position.set(0, 2.4, 0);
      scene.add(text);
    });

    function animate() {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.001;
      glow.rotation.y += 0.001;
      stars.rotation.y += 0.0005;
      renderer.render(scene, camera);
    }

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={ref} className="fixed inset-0 -z-10" />;
}
