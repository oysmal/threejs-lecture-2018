/**
 * Our solar system. Remember, Separation of Concerns is the most important design pattern!
 */
class SolarSystem {
    
    constructor(state) {
        this.state = state; // Store the injected state

        // define sun settings
        let sunTextureUrl = 'assets/texture_sun.jpg';
        let radius = 5;
        let widthSegments = 64; // How many segments there are horizontally around the sphere
        let heightSegments = 64; // How many segments there are vertically around the sphere

        // Create the sun
        let sunTex = new THREE.TextureLoader().load(sunTextureUrl); // First we load the texture
        let sunGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments); // Create a sphere geometry using the settings above
        
        // Create our sun's material (shading settings), using the MeshBasicMaterial so the sun is always illuminated.
        let sunMaterial = new THREE.MeshBasicMaterial({ map: sunTex }); // set the map option of the settings object to the sun texture we created
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial); // Create the Mesh for the sun, which is the complete sun object that contains the geometry and material, ready for rendering.
        this.state.scene.add(this.sun); // Add the sun to the scene

        this.addSunBeams(); // Add sun beams to our sun

        // create a point light and set it as a child of the sun (so the sun shines on other objects), use 5 as intensity (play around and see what this does for yourselves)
        this.sunlight = new THREE.PointLight(0xFFFFFF, 3);
        this.sun.add(this.sunlight); // Add the sunlight as a child of the sun

        // Create an orbit node for the earth around the sun (Same concept as the WebGLScenegraph)
        this.earthOrbitAroundSun = new THREE.Object3D(); // Since an orbit has no visible geometry, we create an Object3D for this.
        this.sun.add(this.earthOrbitAroundSun); // Add as a child of the sun, so the orbit will be around the center of the sun.

        // after the sun has been added, we need to add the earth to it's orbit

        radius = 2.5;   // change to very unrealistic, but at least smaller, radius
        let earthTextureUrl = 'assets/texture_earth.jpg'; // declare the texture url

        // Create and add earth, same procedure as before
        let earthTex = new THREE.TextureLoader().load(earthTextureUrl);
        let earthGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

        // Create our sun's material, using the MeshPhongMaterial (Phong shading) so it receives light from light-emitting objects in the scene.
        let earthMaterial = new THREE.MeshPhongMaterial({ map: earthTex, shininess:1.0 }); // set the map option of the settings object to the earth texture, and set the shininess of the lightmodel to 1.0 (very low) 
        this.earth = new THREE.Mesh(earthGeometry, earthMaterial);

        this.earth.position.x = 15; // Translate earth out from the sun
        this.earthOrbitAroundSun.add(this.earth); // Add the earth to the earthOrbitAroundSun, so we can control the orbit independently of the sun's spin.

        // Create a soft atmospheric white light so that we can just barely see the dark side of the earth.
        // Ambient light has no direction, and is applied to all objects in the scene.
        let amb = new THREE.AmbientLight(0xFFFFFF, 0.05);
        this.state.scene.add(amb); // Add the light to the scene.

        this.state.animate_objects.push(this); // Add this object to the state's animate_objects array, so the animate function is called each render pass
    }

    // Lets do all the updating of our objects in this method, so we can just call this from the render method in app.js!
    animate() {
        this.rotateObject(this.sun, [0.0, 0.005, 0.0]); // Spin the sun gently around its own axis
        this.rotateObject(this.earthOrbitAroundSun, [0.0, 0.01, 0.0]); // rotate the earth orbit, thereby rotating the earth which is its child, in orbit around the sun
        this.rotateObject(this.earth, [0.0, 0.02, 0.0]); // Spin the earth around its own axis
    }

    // Helper function
    rotateObject(object, rotation) {
        object.rotation.x += rotation[0];
        object.rotation.y += rotation[1];
        object.rotation.z += rotation[2];
    }

    // Adds sun beams and glow to the sun
    addSunBeams() {
        this.glowMesh = new GeometricGlowMesh(this.sun) // Create a new GlowMesh
        this.sun.add(this.glowMesh.object3d) // Add the glowMesh's object3d instance variable, which holds its meshes as children.
        this.glowMesh.insideMesh.material.uniforms.glowColor.value.set(0xFFEE44); // Set a nice color of the glow.
        this.glowMesh.outsideMesh.material.uniforms.glowColor.value.set(0xFFEE44); // Same for the beams
        this.state.animate_objects.push(this.glowMesh); // Add the glowMesh to our state's animate_objects array, since we want to call its animate() method each render pass.
    }
}