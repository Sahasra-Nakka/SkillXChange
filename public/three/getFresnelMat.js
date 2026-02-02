import * as THREE from "three";

export function getFresnelMat() {
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0x4da6ff) },
      power: { value: 2.4 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float power;
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), power);
        fresnel = smoothstep(0.0, 1.0, fresnel);
        gl_FragColor = vec4(color * fresnel, fresnel * 0.6);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true
  });
}
