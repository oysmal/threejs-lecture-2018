/**
 * Extended version of jeromeetienne's GeometricGlowMesh, creating a halo-like glow 
 * around the passed geometry, along with an animated shine based on manipulating vertices
 * based on time.
 * 
 * Original Credit: https://github.com/jeromeetienne/threex.geometricglow (MIT-License)
 */

class GeometricGlowMesh {

    // Take in a mesh to add the glow + sunbeams to
    constructor(mesh) {
        this.object3d = new THREE.Object3D;                                       // Create the base Object3D for the mesh

        let geometry = mesh.geometry.clone();                                     // Clone the geometry of the mesh so we can work on it without changing the existing one
        dilateGeometry(geometry, 7);                                              // Expand the geometry
        let material = createAtmosphereMaterial();                                // Create the glow material
        material.uniforms.glowColor.value = new THREE.Color('yellow');            // Set the uniform values
        material.uniforms.coeficient.value = 0.0;                                 // Setting this value will produce a ring at the outermost part of the glow
        material.uniforms.power.value = 5.0;                                      // This value controls the degradation of the glow as we get closer to the center of the original mesh
        this.insideMesh = new THREE.Mesh(geometry, material );                    // Create a Mesh for the glow.
        this.object3d.add(this.insideMesh);                                       // Add the mesh to the mesh object

        // Repeat for the sunbeams
        geometry = mesh.geometry.clone();
        dilateGeometry(geometry, 0.1);
        geometry = new THREE.BufferGeometry().fromGeometry( geometry );           // Change to a buffer geometry since we will update the attribute array each rendering pass.
        material = createPulsingAtmosphereMaterial();                             // Create the pulsing material
        material.uniforms.glowColor.value = new THREE.Color('yellow');
        material.uniforms.intensity.value = 0.05;                                 // Set the intensity to a low value for smooth beams
        material.uniforms.pulseMagnitude.value = 5.0;                             // Set the magnitude (how long) the beams are
        material.side = THREE.BackSide;                                           // We want to see the back side as well as front side of the beams
        this.outsideMesh = new THREE.Mesh( geometry, material );
        this.object3d.add(this.outsideMesh);

        this.pulsePhaseArray = [];                                                                                  // Create the pulse phase array
        this.direction = [];                                                                                        // Create the direction array

        // Populate arrays with initial random values
        for(let i = 0; i<this.outsideMesh.geometry.attributes.position.count; i++) {
            this.direction.push(Math.round(Math.random()));
            this.pulsePhaseArray.push(Math.random());
        }

        this.pulsePhaseBufferAttribute = new THREE.BufferAttribute(new Float32Array(this.pulsePhaseArray), 1);      // Create a buffer attribute array for the phase
        this.outsideMesh.geometry.addAttribute('pulsePhase', this.pulsePhaseBufferAttribute);                       // Add the attribute array to the geometry, setting pulsePhase as the name

        this.millisecondsLast = new Date().getTime();   // Initialize the time since the last render
        this.period = 800;                              // Set the length of a phase period (in milliseconds)
    }

    /**
     * Animation function, taking care of moving the animation of the beams based on the time since the method was called last.
     */
    animate() {
        const timeDiff = new Date().getTime()-this.millisecondsLast;                                                // Calculate the time in ms since last render

        // Iterate over the pulsePhaseArray
        for(let i = 0; i < this.pulsePhaseArray.length; i++) {

            // If the direction is 1, add to the value of the pulsePhase, else subtract from it.
            if(this.direction[i] === 1) {
                this.outsideMesh.geometry.attributes.pulsePhase.array[i] += Math.random() * timeDiff / this.period; // use Math.random multiplied by the timeDiff to have non-synchronous beams

                // Flip the direction of the current beam if the value exceeded 1
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
        // Set the needsUpdate flag to indicate to Three.js that the attribute / uniform needs to be updated.
        this.outsideMesh.geometry.attributes.pulsePhase.needsUpdate = true;
        // this.outsideMesh.material.uniforms.pulseMagnitude.needsUpdate = true;

        // update the millisecondsLast variable with the current time
        this.millisecondsLast = new Date().getTime();
    }
}