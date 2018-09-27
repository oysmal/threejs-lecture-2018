// entry point to our application
class App {
    
    constructor(state) {
        this.state = state; // Save the injected state as an instance variable

        // Declare the variables Three.js needs for initialization
        this.width = window.innerWidth; // use entire window width
        this.height = window.innerHeight; // use entire window height
        this.aspect = this.width / this.height; // calculate the aspect ratio for frustum calculation
        this.fov = 45; // set the field of view to 45 degrees
        this.near = 0.1; // set the near clipping plane to 0.1
        this.far = 1000; // set the far clipping plane to 1000

        // Store the stuff we need several places on the state object
        this.state.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far); // Create an instance of Three.js's Perspective Camera
        this.state.scene = new THREE.Scene(); // Create the Three.js scene object

        // Create the Three.js Renderer (using WebGL), set antialias to true
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        // Add camera to scene
        this.state.scene.add(this.state.camera); 
        this.state.camera.position.z = 50;  // move a small amount back so we can see origo.

        // Clear window to black and set size
        this.renderer.setClearColor(0x000000);
        this.renderer.setSize(this.width, this.height);

        // Add the canvas element to the body element of the page.
        document.body.appendChild(this.renderer.domElement);

        // Create an array on the state object for storing objects 
        // that we wish to animate. All such objects need an animate() method.
        this.state.animate_objects = [];

        this.render();  // start rendering
    }

    // Render the scene
    render() {
        // Loop over the animate_objects and call the animate() method on each one.
        this.state.animate_objects.map(obj => {
            obj.animate();
        })

        // Perform the render of the scene from our camera's point of view
        this.renderer.render(this.state.scene, this.state.camera);

        // This line loops the render call, remember to bind our context so we can access our stuff!
        window.requestAnimFrame(this.render.bind(this));
    }
}


// shim layer with setTimeout fallback for old browsers (ignore this)
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
    