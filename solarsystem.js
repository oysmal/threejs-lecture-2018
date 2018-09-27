/**
 * Our solar system. Remember, Separation of Concerns is the most important design pattern!
 */
class SolarSystem {

    
    // Helper function
    rotateObject(object, rotation) {
        object.rotation.x += rotation[0];
        object.rotation.y += rotation[1];
        object.rotation.z += rotation[2];
    }
}
