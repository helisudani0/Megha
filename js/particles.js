/**
 * PARTICLES.JS - Particle Systems
 * Handles rain drops, stardust, and other particle effects
 */

class ParticleSystem {
    constructor(threeScenesManager = null) {
        this.threeScenesManager = threeScenesManager;
        this.particles = {
            rain: [],
            dust: [],
            stars: [],
        };
        this.systemActive = false;
    }

    /**
     * Set the Three.js scenes manager after initialization
     */
    setThreeScenesManager(manager) {
        this.threeScenesManager = manager;
    }

    /**
     * Create falling rain particles in space
     */
    createRainInSpace(scene, count = 150) {
        const rainGroup = new THREE.Group();
        rainGroup.name = 'rain-particles';

        for (let i = 0; i < count; i++) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array([
                0, 0, 0,
                0, 15, 0
            ]);
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const material = new THREE.LineBasicMaterial({
                color: 0x87ceeb,
                linewidth: 1,
                transparent: true,
                opacity: 0.6,
            });

            const line = new THREE.Line(geometry, material);
            
            // Random position
            line.position.set(
                (Math.random() - 0.5) * 300,
                Math.random() * 200,
                (Math.random() - 0.5) * 300
            );

            rainGroup.add(line);

            // Store particle data
            this.particles.rain.push({
                mesh: line,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    -3 - Math.random() * 2,
                    (Math.random() - 0.5) * 1
                ),
                startPos: line.position.clone()
            });
        }

        scene.add(rainGroup);
        return rainGroup;
    }

    /**
     * Create floating dust particles
     */
    createDustParticles(scene, count = 200) {
        const dustGroup = new THREE.Group();
        dustGroup.name = 'dust-particles';

        const geometry = new THREE.OctahedronGeometry(0.3, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0xf4a460,
            transparent: true,
            opacity: 0.3,
        });

        for (let i = 0; i < count; i++) {
            const dust = new THREE.Mesh(geometry, material.clone());
            
            dust.position.set(
                (Math.random() - 0.5) * 300,
                (Math.random() - 0.5) * 300,
                (Math.random() - 0.5) * 300
            );

            dust.scale.set(
                Math.random() * 0.5 + 0.1,
                Math.random() * 0.5 + 0.1,
                Math.random() * 0.5 + 0.1
            );

            dustGroup.add(dust);

            this.particles.dust.push({
                mesh: dust,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                ),
                startPos: dust.position.clone(),
                floatAmount: Math.random(),
            });
        }

        scene.add(dustGroup);
        return dustGroup;
    }

    /**
     * Create glowing star particles for constellations
     */
    createConstellationStars(scene, count = 100, color = 0xb19cd9) {
        const starsGroup = new THREE.Group();
        starsGroup.name = 'constellation-stars';

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 400;
            positions[i + 1] = (Math.random() - 0.5) * 400;
            positions[i + 2] = (Math.random() - 0.5) * 400;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 2,
            color: color,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8,
        });

        const stars = new THREE.Points(geometry, material);
        starsGroup.add(stars);

        scene.add(starsGroup);
        return starsGroup;
    }

    /**
     * Create a single dramatic raindrop
     */
    createDramaticRaindrop(scene) {
        const geometry = new THREE.IcosahedronGeometry(3, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x87ceeb,
            emissive: 0x4a90e2,
            emissiveIntensity: 0.8,
            shininess: 100,
        });

        const raindrop = new THREE.Mesh(geometry, material);
        raindrop.position.set(0, 150, -200);
        raindrop.name = 'drama-raindrop';

        // Add glow
        const glowGeometry = new THREE.IcosahedronGeometry(4.5, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.3,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(0, 150, -200);
        glow.name = 'raindrop-glow';

        scene.add(raindrop);
        scene.add(glow);

        return { raindrop, glow };
    }

    /**
     * Update particle systems
     */
    updateParticles() {
        // Update rain
        this.particles.rain.forEach(rain => {
            rain.mesh.position.add(rain.velocity);

            // Reset if falls too far
            if (rain.mesh.position.y < -200) {
                rain.mesh.position.copy(rain.startPos);
            }
        });

        // Update dust floating
        this.particles.dust.forEach((dust, index) => {
            const time = Date.now() * 0.0005;
            dust.mesh.position.x += Math.sin(time + dust.floatAmount) * 0.01;
            dust.mesh.position.y += Math.cos(time + dust.floatAmount) * 0.01;
            dust.mesh.position.z += Math.sin(time * 0.7 + dust.floatAmount) * 0.01;

            // Subtle rotation
            dust.mesh.rotation.x += 0.002;
            dust.mesh.rotation.y += 0.003;
        });
    }

    /**
     * Create rain particles overlay for book pages
     */
    createPageRainOverlay(pageElement) {
        const overlay = document.createElement('div');
        overlay.className = 'page-rain-particles';

        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'page-rain-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = (Math.random() - 1) * 100 + '%';
            particle.style.animationDelay = (Math.random() * 2) + 's';
            particle.style.animationDuration = (2 + Math.random() * 1) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            overlay.appendChild(particle);
        }

        pageElement.appendChild(overlay);
    }

    /**
     * Remove all particles from a scene
     */
    clearParticles(scene) {
        // Manually search for particle groups since getObjectsByProperty was removed in Three.js r128
        const groups = [];
        scene.traverse(child => {
            if (child.name === 'rain-particles' || child.name === 'dust-particles' || child.name === 'constellation-stars') {
                groups.push(child);
            }
        });

        groups.forEach(group => {
            scene.remove(group);
            group.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });

        this.particles = {
            rain: [],
            dust: [],
            stars: [],
        };
    }
}

// Create global instance (will be configured with manager later)
const particleSystem = new ParticleSystem();
