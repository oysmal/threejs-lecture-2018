/**
 * Extended version of jeromeetienne's GeometricGlowMesh, creating a halo-like glow 
 * around the passed geometry, along with an animated shine based on manipulating vertices
 * based on time.
 * 
 * Original Credit: https://github.com/jeromeetienne/threex.geometricglow (MIT-License)
 */

class GeometricGlowMesh {

    constructor(mesh) {
        this.object3d = new THREE.Object3D;

        let geometry = mesh.geometry.clone();
        dilateGeometry(geometry, 7);
        let material = createAtmosphereMaterial();
        material.uniforms.glowColor.value = new THREE.Color('yellow');
        material.uniforms.coeficient.value = 0.01;
        material.uniforms.power.value = 3.0;
        this.insideMesh = new THREE.Mesh(geometry, material );
        this.object3d.add(this.insideMesh);

        geometry = mesh.geometry.clone();
        dilateGeometry(geometry, 0.1);
        geometry = new THREE.BufferGeometry().fromGeometry( geometry );
        material = createPulsingAtmosphereMaterial();
        material.uniforms.glowColor.value = new THREE.Color('yellow');
        material.uniforms.intensity.value = 0.05;
        material.uniforms.pulseMagnitude.value = 5.0;
        material.side = THREE.BackSide;
        this.outsideMesh = new THREE.Mesh( geometry, material );
        this.object3d.add(this.outsideMesh);

        this.pulsePhaseArray = [];
        this.direction = [];
        for(let i = 0; i<this.outsideMesh.geometry.attributes.position.count; i++) {
            this.direction.push(Math.round(Math.random()));
            this.pulsePhaseArray.push(Math.random())
        }
    
        this.pulsePhaseBufferAttribute = new THREE.BufferAttribute(new Float32Array(this.pulsePhaseArray), 1);
        this.outsideMesh.geometry.addAttribute('pulsePhase', this.pulsePhaseBufferAttribute);

        this.millisecondsLast = new Date().getTime();
        this.period = 800;
    }

    animate() {
        const timeDiff = new Date().getTime()-this.millisecondsLast;
        for(let i = 0; i < this.pulsePhaseArray.length; i++) {

            if(this.direction[i] === 1) {
                this.outsideMesh.geometry.attributes.pulsePhase.array[i] += Math.random()*timeDiff/this.period;
                if (this.outsideMesh.geometry.attributes.pulsePhase.array[i] > 1) {
                    this.outsideMesh.geometry.attributes.pulsePhase.array[i] = 1;
                    this.direction[i] = -1;
                }
            } else {
                this.outsideMesh.geometry.attributes.pulsePhase.array[i] -= Math.random()*timeDiff/this.period;
                if (this.outsideMesh.geometry.attributes.pulsePhase.array[i] < 0) {
                    this.outsideMesh.geometry.attributes.pulsePhase.array[i] = 0;
                    this.direction[i] = 1;
                }
            }
        }
       // console.log(this.outsideMesh.geometry.attributes.pulseMagnitude.array)
        this.outsideMesh.geometry.attributes.pulsePhase.needsUpdate = true;
        this.outsideMesh.material.uniforms.pulseMagnitude.value = 5.0;
        this.outsideMesh.material.uniforms.pulseMagnitude.needsUpdate = true;
        this.millisecondsLast = new Date();
    }
}