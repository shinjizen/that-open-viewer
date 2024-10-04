import * as OBC from '@thatopen/components';
import * as WEBIFC from 'web-ifc';
import { storage, ref, getDownloadURL } from './firebase.ts';

const container = document.getElementById('container') as HTMLDivElement;

// Create instance for thatopen-components
const components = new OBC.Components();

// Create world from components instance
const worlds = components.get(OBC.Worlds);
const world = worlds.create<
    OBC.SimpleScene,
    OBC.OrthoPerspectiveCamera,
    OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);

components.init();

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.create(world);

world.scene.three.background = null;

// Load IFC w/ fragments
const fragments = components.get(OBC.FragmentsManager);
const fragmentIfcLoader = components.get(OBC.IfcLoader);

await fragmentIfcLoader.setup();

// Setup WASM
fragmentIfcLoader.settings.wasm = {
    path: "https://unpkg.com/web-ifc@0.0.57/",
    absolute: true,
};

const excludedCategories = [
    WEBIFC.IFCTENDONANCHOR,
    WEBIFC.IFCREINFORCINGBAR,
    WEBIFC.IFCREINFORCINGELEMENT
];

for (const category of excludedCategories) {
    fragmentIfcLoader.settings.excludedCategories.add(category);
};

fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

const urlParams = new URLSearchParams(window.location.search);
const filename = urlParams.get('filename');

if (filename) {
    getIfcFromFirebase(filename);
} else {
    console.error('Filename tidak ditemukan dalam URL.');
}

// Get IFC from Firebase
async function getIfcFromFirebase(_filename: string) {
    const storageRef = ref(storage, `ifc_files/${_filename}`);

    try {
        const fileUrl = await getDownloadURL(storageRef);
        console.log('URL Files from Firebase: ', fileUrl);

        await loadIfc(fileUrl)
    } catch (err) {
        console.log('Load failed from Firebase: ', err);
    }
}

// Load IFC Files from getFunction
async function loadIfc(fileUrl: string) {
    const response = await fetch(fileUrl);

    if (!response.ok) {
        throw new Error('Load failed IFC Files: ' + response.statusText);
    }

    const data = await response.arrayBuffer();
    const buffer = new Uint8Array(data);
    
    const model = await fragmentIfcLoader.load(buffer);
    world.scene.three.add(model);
};

fragments.onFragmentsLoaded.add((model) => {
    console.log(model);
});