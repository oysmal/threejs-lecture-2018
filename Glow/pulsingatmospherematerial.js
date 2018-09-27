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
	var vertexShader = `
		varying vec3 vVertexWorldPosition;
		varying vec3 vVertexNormal;

		varying vec4 vFragColor;
        uniform float pulseMagnitude;
        attribute float pulsePhase;
        varying float pulseMag;

		void main() {
			vVertexNormal = normalize(normalMatrix * normal);
			vec3 vPos = position + normal*pulsePhase*pulseMagnitude;
			vVertexWorldPosition = (modelMatrix * vec4(vPos, 1.0)).xyz;
            pulseMag = pulsePhase;
			// set gl_Position
			gl_Position	= projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
		}
	`;
	var fragmentShader	= `
		uniform vec3 glowColor;
		uniform float coeficient;
		uniform float power;

		varying vec3 vVertexNormal;
		varying vec3 vVertexWorldPosition;

		varying vec4 vFragColor;
        varying float pulseMag;

		void main() {
			vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;
			vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;
			viewCameraToVertex = normalize(viewCameraToVertex);
			float intensity	= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power)*(1.0-pulseMag);
			gl_FragColor = vec4(glowColor, intensity);
		}
	`;

	// create custom material from the shader code above
	//   that is within specially labeled script tags
	var material	= new THREE.ShaderMaterial({
		uniforms: { 
			coeficient	: {
				type	: "f", 
				value	: 1.0
			},
			power		: {
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