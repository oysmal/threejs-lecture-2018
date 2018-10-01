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
		uniform float pulseMagnitude;                                                   // Pulse magnitude uniform controlling how big the pulse is
		uniform float intensity;                                                        // Uniform controlling the intensity of the beams
		varying float intensityFrag;													// Here we are declaring the variables we will pass through to the fragment shader
        attribute float pulsePhase;                                                     // Pulse phase uniform, setting the current phase of the pulse
        
		void main() {
			vec3 vPos = position + normal*pulsePhase*pulseMagnitude;                    // Calculate the position of the vertex by adding the normal (not in eyespace) multiplied by the phase and magnitude
            intensityFrag = intensity*(1.0-pulsePhase);                                 // Calculate the intensity of the color at current phase. Use the phase to decrease intensity at the end of the beam
			gl_Position	= projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);         // Translate position to screen coordinates and set the gl_Position
		}
	`;

	const fragmentShader = `
		uniform vec3 glowColor;                                                         // Uniform controlling the glow color 
		varying float intensityFrag;

		void main() {
			gl_FragColor = vec4(glowColor, intensityFrag);                              // Set the frag color, with the intensity passed from the vertex shader as alpha value
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
				value	: 1.0
			},
		},
		vertexShader	: vertexShader,
		fragmentShader	: fragmentShader,
		transparent	: true,
		depthWrite	: false,
	});
	return material
}