window.onload = () => {
    console.log('starting app...');
    let state = new State();
    new App(state);
    new SolarSystem(state);
};
