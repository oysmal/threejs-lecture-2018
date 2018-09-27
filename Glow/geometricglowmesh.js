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
    }

    animate() {
        
    }
}