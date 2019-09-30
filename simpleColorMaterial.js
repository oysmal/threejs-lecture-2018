const SimpleColorMaterial = (texture) => {
    const vertexShader = `
        varying vec2 vUv;                                                                   // Export texture coordinates so we get them in the fragment shader.
		void main() {
            vUv = uv;                                                                       // Threejs gives us the texture coordinates in the 'uv' variable, so set that to our vUv variable. 
			gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);         // Translate position to screen coordinates and set the gl_Position
		}
	`;

    const fragmentShader = `
        uniform sampler2D texture;                                                         // Uniform controlling the texture
        uniform vec3 colorMask;                                                            // Uniform controlling the colorMask

        varying vec2 vUv;                                                                  // Receive the texture coordinates from our vertex shader

		void main() {
            vec4 textureColor = texture2D(texture, vUv);                                   // Sample the texture using the coordinates      
			gl_FragColor = vec4(textureColor.xyz * colorMask, 1.0);                        // Set the fragment color, applying the colorMask to the texture color.
		}
	`;

    // create custom material from the shader code above
    const material = new THREE.ShaderMaterial({
        // Setup uniforms
        uniforms: {
            texture: {
                type: 't',
                value: texture,
            },
            colorMask: {
                type: 'c',
                value: new THREE.Color('#22AAFF'),
            },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });
    return material;
};
