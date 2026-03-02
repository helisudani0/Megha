/**
 * THREE-SCENES.JS - Optimized Three.js Scene Management
 * Fast-loading, beautiful, realistic scenes
 */

class ThreeScenesManager {
    constructor() {
        this.renderer = null;
        this.camera = null;
        this.scenes = {};
        this.currentScene = null;
        this.init();
    }

    init() {
        const canvas = document.getElementById('canvas');
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
        this.renderer.setPixelRatio(Math.min(CONFIG.CANVAS.DPR, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        this.camera = new THREE.PerspectiveCamera(
            CONFIG.CAMERA.FOV,
            CONFIG.CANVAS.WIDTH / CONFIG.CANVAS.HEIGHT,
            CONFIG.CAMERA.NEAR,
            CONFIG.CAMERA.FAR
        );
        this.camera.position.set(0, 0, 50);

        window.addEventListener('resize', () => this.onWindowResize());

        // Create all scenes
        this.createGalaxyScene();
        this.createEarthScene();
        this.createCountrysideScene();

        this.switchScene('galaxy');
    }

    /**
     * GALAXY SCENE - Particles and stars
     */
    createGalaxyScene() {
        const scene = new THREE.Scene();
        scene.name = 'galaxy';
        
        // Background - nebula
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 2048;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#0a0e27';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const gradient = ctx.createRadialGradient(1024, 1024, 0, 1024, 1024, 1400);
        gradient.addColorStop(0, '#5d3f8c');
        gradient.addColorStop(0.15, '#8b4ba8');
        gradient.addColorStop(0.25, '#d946b8');
        gradient.addColorStop(0.35, '#ff6b9d');
        gradient.addColorStop(0.45, '#ff8c42');
        gradient.addColorStop(0.55, '#1a0f3e');
        gradient.addColorStop(0.7, '#050811');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const texture = new THREE.CanvasTexture(canvas);
        scene.background = texture;

        // Add stars
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 8000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starVertices), 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            sizeAttenuation: true
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        this.scenes.galaxy = { scene, camera: this.camera };
    }

    /**
     * EARTH SCENE - Planets and realistic Earth
     */
    createEarthScene() {
        const scene = new THREE.Scene();
        scene.name = 'earth';
        
        // Black space background
        scene.background = new THREE.Color(0x000000);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directLight.position.set(500, 300, 500);
        scene.add(directLight);

        // Create planets
        this.createPlanets(scene);

        // Create Earth
        this.createRealisticEarth(scene);

        this.scenes.earth = { scene, camera: this.camera };
    }

    /**
     * Create planets in space
     */
    createPlanets(scene) {
        // Venus
        const venusGeo = new THREE.SphereGeometry(120, 64, 64);
        const venusMat = new THREE.MeshPhongMaterial({
            color: 0xffeb99,
            emissive: 0xffa500,
            emissiveIntensity: 0.4
        });
        const venus = new THREE.Mesh(venusGeo, venusMat);
        venus.position.set(800, 600, -1200);
        venus.name = 'planet-venus';
        scene.add(venus);

        // Mars
        const marsGeo = new THREE.SphereGeometry(100, 64, 64);
        const marsMat = new THREE.MeshPhongMaterial({
            color: 0xc1440e,
            emissive: 0x8b2e0c,
            emissiveIntensity: 0.3
        });
        const mars = new THREE.Mesh(marsGeo, marsMat);
        mars.position.set(-900, 400, -1500);
        mars.name = 'planet-mars';
        scene.add(mars);

        // Jupiter
        const jupGeo = new THREE.SphereGeometry(180, 64, 64);
        const jupMat = new THREE.MeshPhongMaterial({
            color: 0x8b7355,
            emissive: 0x5a4a3a,
            emissiveIntensity: 0.2
        });
        const jupiter = new THREE.Mesh(jupGeo, jupMat);
        jupiter.position.set(500, -600, -1800);
        jupiter.name = 'planet-jupiter';
        scene.add(jupiter);

        // Saturn with rings
        const satGeo = new THREE.SphereGeometry(140, 64, 64);
        const satMat = new THREE.MeshPhongMaterial({
            color: 0xf4d47d,
            emissive: 0xc9a050,
            emissiveIntensity: 0.25
        });
        const saturn = new THREE.Mesh(satGeo, satMat);
        saturn.position.set(-1000, -500, -2000);
        saturn.name = 'planet-saturn';
        scene.add(saturn);

        // Saturn rings
        const ringGeo = new THREE.TorusGeometry(200, 60, 32, 256);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xd4a574,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const rings = new THREE.Mesh(ringGeo, ringMat);
        rings.position.copy(saturn.position);
        rings.rotation.x = Math.PI * 0.3;
        rings.name = 'planet-rings';
        scene.add(rings);
    }

    /**
     * Hide all planets (called during zoom animation)
     */
    hidePlanets() {
        if (this.scenes.earth && this.scenes.earth.scene) {
            this.scenes.earth.scene.traverse(child => {
                if (child.name && child.name.startsWith('planet-')) {
                    child.visible = false;
                }
            });
        }
    }

    /**
     * Create realistic Earth with NASA-quality details
     */
    createRealisticEarth(scene) {
        const geometry = new THREE.SphereGeometry(480, 512, 512);
        
        // ULTRA-DETAILED Earth texture
        const canvas = document.createElement('canvas');
        canvas.width = 32768;  // Massive resolution for details
        canvas.height = 16384;
        const ctx = canvas.getContext('2d');

        // Ocean base - realistic gradient
        const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        oceanGrad.addColorStop(0, '#000a1f');
        oceanGrad.addColorStop(0.1, '#001a4d');
        oceanGrad.addColorStop(0.35, '#0033aa');
        oceanGrad.addColorStop(0.5, '#0055dd');
        oceanGrad.addColorStop(0.65, '#0033aa');
        oceanGrad.addColorStop(0.9, '#001a4d');
        oceanGrad.addColorStop(1, '#000a1f');
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add ocean texture detail - waves and current patterns
        ctx.fillStyle = 'rgba(0, 100, 150, 0.3)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const w = Math.random() * 2000 + 500;
            const h = Math.random() * 1000 + 300;
            ctx.fillRect(x, y, w, h);
        }

        // ============ CONTINENTS WITH PROPER DETAIL ============

        // Helper: Draw coastline with detail
        const drawCoastline = (centerX, centerY, radiusX, radiusY, rotation, landColor, detailLevel = 0.3) => {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);

            // Main landmass
            ctx.fillStyle = landColor;
            ctx.beginPath();
            for (let i = 0; i < 100; i++) {
                const angle = (i / 100) * Math.PI * 2;
                // Add fractal-like detail to coastlines
                const detail = Math.sin(angle * 5) * radiusY * detailLevel;
                const x = Math.cos(angle) * (radiusX + detail * 0.5);
                const y = Math.sin(angle) * (radiusY + detail);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        };

        const drawTerrainFeature = (centerX, centerY, radiusX, radiusY, rotation, color1, color2) => {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);

            // Multiple layers for terrain depth
            ctx.fillStyle = color2;
            ctx.fillRect(-radiusX * 1.2, -radiusY * 1.2, radiusX * 2.4, radiusY * 2.4);
            
            ctx.fillStyle = color1;
            ctx.beginPath();
            for (let i = 0; i < 80; i++) {
                const angle = (i / 80) * Math.PI * 2;
                const noiseX = Math.sin(angle * 3) * radiusX * 0.2;
                const noiseY = Math.cos(angle * 5) * radiusY * 0.2;
                const x = (Math.cos(angle) * radiusX) + noiseX;
                const y = (Math.sin(angle) * radiusY) + noiseY;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        // ============ NORTH AMERICA ============
        drawTerrainFeature(1500, 2500, 1000, 1400, -0.4, '#1a5c1a', '#0d3d0d');
        // Rocky mountains
        ctx.fillStyle = '#6b5d4f';
        ctx.fillRect(900, 1800, 800, 1200);
        // Forests
        ctx.fillStyle = '#0d5c1f';
        ctx.fillRect(1200, 2200, 1200, 800);
        // Appalachians
        ctx.fillStyle = '#5d7d5d';
        ctx.fillRect(1900, 2300, 600, 1000);

        // ============ SOUTH AMERICA ============
        drawTerrainFeature(2100, 4200, 700, 1100, -0.2, '#1a5c1a', '#0d3d0d');
        // Amazon rainforest
        ctx.fillStyle = '#0d5c1f';
        ctx.fillRect(2000, 3600, 800, 1000);
        // Andes
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(1900, 3300, 300, 1500);

        // ============ EUROPE ============
        drawTerrainFeature(4200, 1900, 600, 500, 0.1, '#2d7a1f', '#1a4d0d');
        // Alps
        ctx.fillStyle = '#a0a0a0';
        ctx.fillRect(4000, 1600, 400, 400);
        // Mediterranean
        ctx.fillStyle = '#004080';
        ctx.fillRect(4100, 2200, 600, 300);
        // North Sea
        ctx.fillStyle = '#0066cc';
        ctx.fillRect(4000, 1200, 400, 400);

        // ============ AFRICA ============
        drawTerrainFeature(5000, 3700, 1200, 1400, 0.05, '#2d7a1f', '#1a4d0d');
        // Sahara desert
        ctx.fillStyle = '#d4a76a';
        ctx.fillRect(4800, 2300, 800, 1200);
        // Congo rainforest
        ctx.fillStyle = '#0d5c1f';
        ctx.fillRect(5000, 3500, 600, 800);
        // East African highlands
        ctx.fillStyle = '#5d7d5d';
        ctx.fillRect(5400, 3600, 400, 600);

        // ============ MIDDLE EAST ============
        ctx.fillStyle = '#b8956a';
        ctx.fillRect(5500, 2200, 600, 800);

        // ============ INDIA - ULTRA DETAILED ============
        // Main landmass - bright green for prominence
        ctx.fillStyle = '#2dff4f';
        ctx.beginPath();
        // North coast (simulating Himalayan foothills)
        ctx.moveTo(6100, 2500);
        ctx.lineTo(6400, 2400);
        ctx.lineTo(6500, 2300);
        // Northeast coast
        ctx.lineTo(6650, 2500);
        ctx.lineTo(6700, 2700);
        // East coast (Bay of Bengal)
        ctx.lineTo(6600, 3200);
        // Southeast
        ctx.lineTo(6400, 3300);
        // South coast (Southern tip)
        ctx.lineTo(6200, 3250);
        // West coast (Arabian Sea)
        ctx.lineTo(6050, 2900);
        ctx.closePath();
        ctx.fill();

        // India terrain detail layers
        ctx.fillStyle = '#1a8c2e';
        ctx.fillRect(6100, 2600, 200, 400); // Western Ghats
        ctx.fillRect(6200, 2500, 300, 300); // Central India
        ctx.fillRect(6350, 2400, 250, 600); // Deccan plateau

        // Major cities as highlights (tiny bright spots)
        ctx.fillStyle = '#ffff99';
        ctx.fillRect(6120, 2580, 30, 30); // Mumbai area
        ctx.fillRect(6180, 2650, 25, 25); // Bangalore area
        ctx.fillRect(6280, 2520, 28, 28); // Delhi area
        ctx.fillRect(6400, 2750, 24, 24); // Kolkata area
        ctx.fillRect(6350, 3100, 26, 26); // Chennai area

        // ============ CENTRAL ASIA ============
        ctx.fillStyle = '#9d7c4d';
        ctx.fillRect(5700, 2000, 800, 600);
        // Himalayas
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(6000, 2200, 600, 300);

        // ============ EAST ASIA ============
        drawTerrainFeature(6800, 2300, 1000, 1100, 0.15, '#1a5c1a', '#0d3d0d');
        // Gobi desert
        ctx.fillStyle = '#d4a76a';
        ctx.fillRect(6200, 1700, 900, 500);

        // ============ SOUTHEAST ASIA ============
        ctx.fillStyle = '#0d5c1f';
        ctx.fillRect(6700, 2900, 600, 800);

        // ============ AUSTRALIA ============
        drawTerrainFeature(7100, 4000, 700, 800, 0.1, '#2d7a1f', '#1a4d0d');
        // Outback
        ctx.fillStyle = '#d4a76a';
        ctx.fillRect(6800, 3600, 600, 800);

        // ============ POLAR ICE CAPS ============
        // North Pole
        const northGrad = ctx.createLinearGradient(0, 0, 0, 800);
        northGrad.addColorStop(0, '#ffffff');
        northGrad.addColorStop(1, '#e6f2ff');
        ctx.fillStyle = northGrad;
        ctx.fillRect(0, 0, canvas.width, 800);

        // South Pole
        const southGrad = ctx.createLinearGradient(0, canvas.height - 800, 0, canvas.height);
        southGrad.addColorStop(0, '#e6f2ff');
        southGrad.addColorStop(1, '#ffffff');
        ctx.fillStyle = southGrad;
        ctx.fillRect(0, canvas.height - 800, canvas.width, 800);

        // ============ ATMOSPHERIC CLOUDS AND STORMS ============
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        // Atlantic hurricane zones
        ctx.beginPath();
        ctx.ellipse(1200, 3200, 1200, 800, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // Indian Ocean monsoon system
        ctx.fillStyle = 'rgba(240, 248, 255, 0.7)';
        ctx.beginPath();
        ctx.ellipse(6200, 3500, 900, 600, 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Pacific cloud systems
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.ellipse(900, 2200, 1000, 700, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Add cloud swirls for realism
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 400 + 200;
            ctx.beginPath();
            ctx.ellipse(x, y, size, size * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }

        // ============ OCEAN CURRENTS & DEPTH VARIATION ============
        ctx.strokeStyle = 'rgba(0, 150, 200, 0.2)';
        ctx.lineWidth = 100;
        // Gulf Stream
        ctx.beginPath();
        ctx.arc(2000, 2000, 1500, 0, Math.PI * 2);
        ctx.stroke();
        // Kuroshio Current
        ctx.beginPath();
        ctx.arc(7000, 2000, 1000, 0, Math.PI * 2);
        ctx.stroke();

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 16;
        
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            emissive: 0x1a2a3a,
            emissiveIntensity: 0.2,
            shininess: 60,
            specular: 0x333366,
            flatShading: false
        });

        const earth = new THREE.Mesh(geometry, material);
        earth.castShadow = true;
        earth.rotation.y = Math.PI * 0.35;
        earth.rotation.z = 0.08;
        earth.name = 'earth';
        scene.add(earth);

        // Atmosphere with glow
        const atmGeo = new THREE.SphereGeometry(510, 256, 256);
        const atmMat = new THREE.MeshBasicMaterial({
            color: 0x6baeff,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });
        const atmosphere = new THREE.Mesh(atmGeo, atmMat);
        atmosphere.name = 'atmosphere';
        scene.add(atmosphere);

        // Second atmosphere layer for depth
        const atmGeo2 = new THREE.SphereGeometry(540, 128, 128);
        const atmMat2 = new THREE.MeshBasicMaterial({
            color: 0x4da6ff,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending
        });
        const atmosphere2 = new THREE.Mesh(atmGeo2, atmMat2);
        atmosphere2.name = 'atmosphere2';
        scene.add(atmosphere2);
    }

    /**
     * COUNTRYSIDE SCENE - Beautiful fields and cottage
     */
    createCountrysideScene() {
        const scene = new THREE.Scene();
        scene.name = 'countryside';
        
        // Golden hour sky
        const skyCanvas = document.createElement('canvas');
        skyCanvas.width = 1024;
        skyCanvas.height = 1024;
        const skyCtx = skyCanvas.getContext('2d');
        
        const skyGrad = skyCtx.createRadialGradient(512, 300, 100, 512, 512, 1000);
        skyGrad.addColorStop(0, '#ffd699');
        skyGrad.addColorStop(0.2, '#ffb366');
        skyGrad.addColorStop(0.4, '#ff9a56');
        skyGrad.addColorStop(0.6, '#ff8a3d');
        skyGrad.addColorStop(0.8, '#8b7355');
        skyGrad.addColorStop(1, '#4a5f7f');
        skyCtx.fillStyle = skyGrad;
        skyCtx.fillRect(0, 0, 1024, 1024);
        
        scene.background = new THREE.CanvasTexture(skyCanvas);

        // Lighting
        const sunLight = new THREE.DirectionalLight(0xffa500, 1.4);
        sunLight.position.set(400, 300, 200);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        scene.add(sunLight);

        const ambientLight = new THREE.AmbientLight(0xffe4b5, 0.9);
        scene.add(ambientLight);

        // Ground
        const groundGeo = new THREE.PlaneGeometry(1000, 1000, 32, 32);
        const groundMat = new THREE.MeshPhongMaterial({
            color: 0x2d7a1f,
            emissive: 0x1a4d0a,
            emissiveIntensity: 0.2
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Trees
        const treePositions = [
            {x: -200, z: 150, s: 1.5},
            {x: 150, z: 100, s: 1.4},
            {x: -150, z: -100, s: 1.6},
            {x: 200, z: 50, s: 1.5},
            {x: -100, z: 200, s: 1.7}
        ];
        
        treePositions.forEach(p => this.makeTree(scene, p.x, p.z, p.s));

        // Cottage
        this.makeCottage(scene, 0, 80);

        // Flowers
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            const d = 120 + Math.random() * 60;
            this.makeFlower(scene, Math.cos(a) * d, 80 + Math.sin(a) * d * 0.5);
        }

        this.scenes.countryside = { scene, camera: this.camera };
    }

    makeTree(scene, x, z, scale) {
        const trunkGeo = new THREE.CylinderGeometry(8 * scale, 12 * scale, 60 * scale, 8);
        const trunkMat = new THREE.MeshPhongMaterial({color: 0x5c4033});
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(x, 30 * scale, z);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        scene.add(trunk);

        const foliageGeo = new THREE.SphereGeometry(25 * scale, 16, 16);
        const foliageMat = new THREE.MeshPhongMaterial({color: 0x2d7a1f});
        
        for (let i = 0; i < 2; i++) {
            const foliage = new THREE.Mesh(foliageGeo, foliageMat);
            foliage.position.set(
                x + (i === 0 ? -10 : 10) * scale,
                30 + i * 35 * scale,
                z
            );
            foliage.castShadow = true;
            foliage.receiveShadow = true;
            scene.add(foliage);
        }
    }

    makeCottage(scene, x, z) {
        // Walls
        const wallGeo = new THREE.BoxGeometry(100, 60, 80);
        const wallMat = new THREE.MeshPhongMaterial({color: 0xd4a574});
        const walls = new THREE.Mesh(wallGeo, wallMat);
        walls.position.set(x, 30, z);
        walls.castShadow = true;
        walls.receiveShadow = true;
        scene.add(walls);

        // Roof
        const roofGeo = new THREE.ConeGeometry(75, 50, 4);
        const roofMat = new THREE.MeshPhongMaterial({color: 0x3d2611});
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.set(x, 60, z);
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        scene.add(roof);

        // Chimney
        const chimGeo = new THREE.BoxGeometry(12, 40, 12);
        const chimMat = new THREE.MeshPhongMaterial({color: 0x8b4513});
        const chim = new THREE.Mesh(chimGeo, chimMat);
        chim.position.set(x + 25, 65, z - 30);
        chim.castShadow = true;
        scene.add(chim);

        // Door
        const doorGeo = new THREE.BoxGeometry(20, 50, 4);
        const doorMat = new THREE.MeshPhongMaterial({color: 0x3d2611});
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(x - 20, 10, z + 40.5);
        door.castShadow = true;
        scene.add(door);

        // Windows
        const winMat = new THREE.MeshPhongMaterial({color: 0xfef8dc});
        for (let i = 0; i < 3; i++) {
            const winGeo = new THREE.BoxGeometry(18, 18, 3);
            const win = new THREE.Mesh(winGeo, winMat);
            win.position.set(x - 30 + i * 30, 20, z + 40.5);
            win.castShadow = true;
            scene.add(win);
        }

        // Porch
        const porchGeo = new THREE.BoxGeometry(70, 15, 25);
        const porchMat = new THREE.MeshPhongMaterial({color: 0xa0915c});
        const porch = new THREE.Mesh(porchGeo, porchMat);
        porch.position.set(x, 8, z + 42);
        porch.castShadow = true;
        porch.receiveShadow = true;
        scene.add(porch);
    }

    makeFlower(scene, x, z) {
        const bushGeo = new THREE.SphereGeometry(12, 16, 16);
        const bushMat = new THREE.MeshPhongMaterial({color: 0x2d5c1f});
        const bush = new THREE.Mesh(bushGeo, bushMat);
        bush.position.set(x, 8, z);
        bush.castShadow = true;
        bush.receiveShadow = true;
        scene.add(bush);

        const flowerGeo = new THREE.SphereGeometry(0.8, 6, 6);
        const flowerMat = new THREE.MeshPhongMaterial({color: 0xff69b4});
        
        for (let i = 0; i < 10; i++) {
            const flower = new THREE.Mesh(flowerGeo, flowerMat);
            const angle = (i / 10) * Math.PI * 2;
            flower.position.set(
                x + Math.cos(angle) * 14,
                8 + Math.sin(angle * 0.6) * 4,
                z + Math.sin(angle) * 14
            );
            scene.add(flower);
        }
    }

    switchScene(name) {
        if (this.scenes[name]) {
            this.currentScene = this.scenes[name].scene;
            this.camera = this.scenes[name].camera;
        }
    }

    onWindowResize() {
        const width = CONFIG.CANVAS.WIDTH;
        const height = CONFIG.CANVAS.HEIGHT;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    render() {
        if (this.currentScene) {
            this.renderer.render(this.currentScene, this.camera);
        }
    }
}
