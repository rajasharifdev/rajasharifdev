import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import * as shapes from './shapes.js';
import {
  particleVertex, particleFragment,
  backgroundVertex, backgroundFragment,
  dustVertex, dustFragment,
} from './shaders.js';

/*
 * One state per page section, in DOM order. The particle cloud morphs to the
 * matching shape and eases toward these placement values as you scroll.
 *   x, y      offset of the object in world units (desktop)
 *   tilt      rotation around X, so flat shapes face the camera
 *   face      1 = stop spinning and face the camera (for text / planes)
 */
const STATES = [
  { shape: 'sphere',    x: 2.9, y: 0.0,  scale: 0.92, tilt: 0.0,  intensity: 1.0,  face: 0 }, // hero
  { shape: 'torusKnot', x: 2.9, y: 0.0,  scale: 0.95, tilt: 0.3,  intensity: 0.75, face: 0 }, // about
  { shape: 'waveField', x: 0.0, y: -0.4, scale: 1.0,  tilt: 0.35, intensity: 0.38, face: 1 }, // skills
  { shape: 'helix',     x: 3.0, y: 0.0,  scale: 1.0,  tilt: 0.25, intensity: 0.75, face: 0 }, // experience
  { shape: 'galaxy',    x: 0.0, y: -0.3, scale: 1.0,  tilt: 1.05, intensity: 0.55, face: 0 }, // projects
  { shape: 'text',      x: 0.0, y: 0.0,  scale: 0.9,  tilt: 0.0,  intensity: 1.0,  face: 1 }, // contact (y from [data-gl-anchor])
];

const lerp = (a, b, t) => a + (b - a) * t;

export function createScene(canvas, { sections, monogram, theme, reducedMotion }) {
  const isMobile = matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  const count = isMobile ? 7000 : 16000;
  const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  const colorA = new THREE.Color(theme.a);
  const colorB = new THREE.Color(theme.b);
  const colorC = new THREE.Color(theme.c);
  const targetA = colorA.clone(), targetB = colorB.clone(), targetC = colorC.clone();

  /* Background aurora */
  const bgUniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uColorA: { value: colorA }, uColorB: { value: colorB }, uColorC: { value: colorC },
  };
  const background = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ vertexShader: backgroundVertex, fragmentShader: backgroundFragment, uniforms: bgUniforms, depthTest: false, depthWrite: false }),
  );
  background.frustumCulled = false;
  background.renderOrder = -1;
  scene.add(background);

  /* Floating dust for depth */
  const dustCount = isMobile ? 500 : 1400;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  const dustRand = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i++) {
    dustPos.set([(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 24, -Math.random() * 18 + 2], i * 3);
    dustRand[i] = Math.random();
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('aRand', new THREE.BufferAttribute(dustRand, 1));
  const dustUniforms = { uTime: { value: 0 }, uScroll: { value: 0 }, uPixelRatio: { value: pixelRatio }, uColor: { value: colorB } };
  const dust = new THREE.Points(dustGeo, new THREE.ShaderMaterial({
    vertexShader: dustVertex, fragmentShader: dustFragment, uniforms: dustUniforms,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  dust.frustumCulled = false;
  scene.add(dust);

  /* Morphing particles */
  const generators = {
    sphere: () => shapes.sphere(count),
    torusKnot: () => shapes.torusKnot(count),
    waveField: () => shapes.waveField(count),
    helix: () => shapes.helix(count),
    galaxy: () => shapes.galaxy(count),
    text: () => shapes.text(count, monogram),
  };
  const geometry = new THREE.BufferGeometry();
  const attrNames = ['position', 'aShape1', 'aShape2', 'aShape3', 'aShape4', 'aShape5'];
  STATES.forEach((s, i) => geometry.setAttribute(attrNames[i], new THREE.BufferAttribute(generators[s.shape](), 3)));
  const rand = new Float32Array(count);
  for (let i = 0; i < count; i++) rand[i] = Math.random();
  geometry.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));

  // The monogram uses the display font; resample once it has loaded.
  document.fonts?.load('700 100px "Space Grotesk"').then(() => {
    const idx = STATES.findIndex((s) => s.shape === 'text');
    const attr = geometry.getAttribute(attrNames[idx]);
    attr.array.set(shapes.text(count, monogram));
    attr.needsUpdate = true;
  }).catch(() => {});

  const uniforms = {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uSize: { value: isMobile ? 70 : 85 },
    uPixelRatio: { value: pixelRatio },
    uIntensity: { value: 1 },
    uTurbulence: { value: reducedMotion ? 0.02 : 0.09 },
    uMouse: { value: new THREE.Vector3(99, 99, 0) },
    uMouseStrength: { value: 0 },
    uColorA: { value: colorA }, uColorB: { value: colorB }, uColorC: { value: colorC },
  };
  const particles = new THREE.Points(geometry, new THREE.ShaderMaterial({
    vertexShader: particleVertex, fragmentShader: particleFragment, uniforms,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  particles.frustumCulled = false;
  const group = new THREE.Group();
  group.add(particles);
  scene.add(group);

  /* Post-processing (desktop only) */
  let composer = null;
  if (!isMobile) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.75, 0.55, 0.05));
    composer.addPass(new OutputPass());
  }

  /* Input */
  const pointer = new THREE.Vector2(0, 0);
  const smoothPointer = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  let mouseTarget = 0;

  const onPointerMove = (e) => {
    if (e.pointerType === 'touch') return;
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    mouseTarget = 1;
  };
  const onPointerLeave = () => { mouseTarget = 0; };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);

  const onResize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer?.setSize(w, h);
    bgUniforms.uResolution.value.set(w, h);
  };
  window.addEventListener('resize', onResize);

  /* Scroll → section progress (0 … sections.length - 1). Each morph plays
     while the next section's top travels from 80% to 20% of the viewport, so
     tall sections hold their shape for their whole length. */
  const sectionProgress = () => {
    const h = window.innerHeight;
    let p = 0;
    for (let i = 1; i < sections.length; i++) {
      const top = sections[i].getBoundingClientRect().top;
      p += Math.min(1, Math.max(0, (h * 0.8 - top) / (h * 0.6)));
    }
    return p;
  };

  /* A section may contain a [data-gl-anchor] element; its shape is then
     pinned to that element's on-screen centre instead of a fixed y. */
  const anchoredY = () => sections.map((el) => {
    const anchor = el.querySelector('[data-gl-anchor]');
    if (!anchor) return null;
    const r = anchor.getBoundingClientRect();
    const worldPerPx = (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / window.innerHeight;
    return (window.innerHeight / 2 - (r.top + r.height / 2)) * worldPerPx;
  });

  /* Loop */
  const clock = new THREE.Clock();
  let time = 0;
  let morph = sectionProgress();
  let spin = 0;

  const sample = (p, anchors) => {
    const i = Math.min(Math.floor(p), STATES.length - 2);
    const f = Math.min(Math.max(p - i, 0), 1);
    const a = { ...STATES[i], y: anchors[i] ?? STATES[i].y };
    const b = { ...STATES[i + 1], y: anchors[i + 1] ?? STATES[i + 1].y };
    const out = {};
    for (const k of ['x', 'y', 'scale', 'tilt', 'intensity', 'face']) out[k] = lerp(a[k], b[k], f);
    return out;
  };

  let raf = 0;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    time += dt * (reducedMotion ? 0.25 : 1);

    const target = sectionProgress();
    morph = lerp(morph, target, Math.min(1, dt * (reducedMotion ? 8 : 2.6)));

    // Responsive placement: centre and shrink the object on narrow screens.
    const aspect = window.innerWidth / window.innerHeight;
    const fit = Math.min(1, Math.max(0.5, aspect / 1.5));
    const sideways = aspect < 0.9 ? 0 : Math.min(1, aspect / 1.7);

    // `morph` is already eased, so placement follows it directly; anchored
    // shapes then track scrolling exactly.
    const current = sample(morph, anchoredY());

    spin += dt * 0.12 * (1 - current.face) * (reducedMotion ? 0.3 : 1);
    const facing = Math.round(spin / (Math.PI * 2)) * Math.PI * 2;

    smoothPointer.lerp(pointer, Math.min(1, dt * 3));
    group.position.set(current.x * sideways, current.y, 0);
    group.scale.setScalar(current.scale * fit);
    group.rotation.set(
      current.tilt - smoothPointer.y * 0.15,
      lerp(spin, facing, current.face) + smoothPointer.x * 0.25,
      0,
    );

    camera.position.x = lerp(camera.position.x, smoothPointer.x * 0.35, Math.min(1, dt * 2));
    camera.position.y = lerp(camera.position.y, smoothPointer.y * 0.25, Math.min(1, dt * 2));
    camera.lookAt(0, 0, 0);

    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) uniforms.uMouse.value.copy(hit);
    uniforms.uMouseStrength.value = lerp(uniforms.uMouseStrength.value, mouseTarget, Math.min(1, dt * 3));

    // On phones the object sits behind text, so keep it quieter there.
    const dim = sideways === 0 && current.face < 0.5 ? 0.4 : 1;
    uniforms.uIntensity.value = current.intensity * dim;
    uniforms.uMorph.value = morph;
    uniforms.uTime.value = time;

    const pages = window.scrollY / window.innerHeight;
    bgUniforms.uTime.value = time;
    bgUniforms.uScroll.value = pages * 0.25;
    dustUniforms.uTime.value = time;
    dustUniforms.uScroll.value = pages * 0.8;

    const ck = Math.min(1, dt * 2);
    colorA.lerp(targetA, ck);
    colorB.lerp(targetB, ck);
    colorC.lerp(targetC, ck);

    if (composer) composer.render(dt);
    else renderer.render(scene, camera);
  };
  tick();

  return {
    setTheme(next) {
      targetA.set(next.a);
      targetB.set(next.b);
      targetC.set(next.c);
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.dispose();
    },
  };
}
