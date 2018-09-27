/**
 *  Simple class for holding state, using the singleton design pattern
 */

class State {

    constructor() {

        // Singleton setup. If there is an active instance, return that. Do not create a new one.
        if (State._instance) {
            return State._instance;
        }

        State._instance = this; // set the instance variable to "this" so that future calls to the constructor can use the same instance.
        return State._instance; // explicitly return the instance so that we understand what happens.
    }

    // Use this to get a reference to State object (can also just use new, same stuff, but this is similar to Java)
    static getInstance() {
        if (State._instance) {
            return State._instance;
        } else {
            return new State();
        }
    }
};

State._instance = null;  // Set the class variable (static variable);
