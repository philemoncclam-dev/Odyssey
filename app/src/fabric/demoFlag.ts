// Whether the staged Fabric estate is installed.
//
// Its own module, three lines, so that the UI can ask without importing
// `demoApi` — which carries the whole invented estate. That module is loaded
// dynamically and only when demo mode is switched on, so a normal build never
// ships the fixtures; a static import from the Fabric layout route would undo
// that by pulling them back into the boot graph.

let active = false

export const setDemoActive = (on: boolean) => {
  active = on
}

/** True while the demo estate is installed. Drives the on-screen banner. */
export const isDemoActive = () => active
