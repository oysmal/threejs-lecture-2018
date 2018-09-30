/**
 * Extended version of jeromeetienne's AtmosphereMaterial. The vertex shader requires a 
 * float attribute "pulsePhase", which is used to offset the vertex position
 * along the normal, by the magnitude specified by the pulseMagnitude uniform. 
 * The pulsePhase is passed on to the fragment shader, where it is
 * used for reducing the opacity along with the increase of the pulsePhase.
 * 
 * Original Credit: https://github.com/jeromeetienne/threex.geometricglow (MIT-License)
 */

/**
 * from http://stemkoski.blogspot.fr/2013/07/shaders-in-threejs-glow-and-halo.html
 * @return {[type]} [description]
 */
const createPulsingAtmosphereMaterial = () => {
	const vertexShader = `
		varying vec3 vVertexWorldPosition;												// Here we are declaring the variables we will pass through to the fragment shader
		varying vec3 vVertexNormal;
		varying vec4 vFragColor;
		varying float pulsePhaseFrag;
        uniform float pulseMagnitude;                                                   // pulse magnitude uniform controlling how big the pulse is
        attribute float pulsePhase;                                                     // pulse phase uniform, setting the current phase of the pulse
        
		void main() {
			vVertexNormal = normalize(normalMatrix * normal);                           // translate the normal to eye space 
			vec3 vPos = position + normal*pulsePhase*pulseMagnitude;                    // calculate the position of the vertex by adding the normal (not in eyespace) multiplied by the phase and magnitude
			vVertexWorldPosition = (modelMatrix * vec4(vPos, 1.0)).xyz;                 // translate the position to eye space
            pulsePhaseFrag = pulsePhase;                                                      // send the pulse phase to the fragment shader
			// set gl_Position
			gl_Position	= projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);         // translate position to screen coordinates
		}
	`;

	const fragmentShader = `
		uniform vec3 glowColor;                                                         // Uniform controlling the glow color 
		uniform float intensity;                                                        // Uniform controlling the intensity of the beams

		varying vec3 vVertexNormal;                                                     // Variables we get from the vertex shader
		varying vec3 vVertexWorldPosition;
		varying vec4 vFragColor;
        varying float pulsePhaseFrag;

		void main() {
			vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;                             // Get the vector between vertex and camera in world space
			vec3 viewCameraToVertex	= normalize((viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz);       // translate the vector into eye space and normalize it
			float _intensity	= intensity*(1.0-pulsePhaseFrag);                                             // Calculate the intensity of the color at current phase. Use the phase to decrease intensity at the end of the beam
			gl_FragColor = vec4(glowColor, _intensity);                                                    // Set the frag color
		}
	`;

	// create custom material from the shader code above
	const material	= new THREE.ShaderMaterial({
        // Setup uniforms
		uniforms: {
			intensity   : {
				type	: "f",
				value	: 2
			},
			glowColor	: {
				type	: "c",
				value	: new THREE.Color('yellow')
			},
			pulseMagnitude	: {
				type	: "f",
				value	: 0.0
			},
		},
		vertexShader	: vertexShader,
		fragmentShader	: fragmentShader,
		transparent	: true,
		depthWrite	: false,
	});
	return material
}