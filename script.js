
const loader = new THREE.TextureLoader()
const height = loader.load('textures/height.jpg')
const texture = loader.load('textures/land.jpg')
//const alpha = loader.load('textures/alpha.jpg')



// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.PlaneBufferGeometry(15, 10, 64, 64);

// Materials

const material = new THREE.MeshStandardMaterial({
    map: texture,
    displacementMap: height,
    transparent: true,
    displacementScale: 0.6

})
//material.color = new THREE.Color(0xff0000)

// Mesh
const plane = new THREE.Mesh(geometry, material)
scene.add(plane)
plane.rotation.x = 180.85


// gui.add(plane.rotation,'x').min(0).max(600)



// Lights

const pointLight = new THREE.PointLight(0xffffff, 1.71)
pointLight.position.x = -1.86
pointLight.position.y = 2.71
pointLight.position.z = 2.58
scene.add(pointLight)

// gui.add(pointLight.position, 'y').min(-3).max(3).step(0.01)
// gui.add(pointLight.position, 'x').min(-6).max(6).step(0.01)
// gui.add(pointLight.position, 'z').min(-3).max(3).step(0.01)
// gui.add(pointLight, 'intensity').min(0).max(10).step(0.01)

// const pointLightHelper2 = new THREE.PointLightHelper(pointLight,1)
// scene.add(pointLightHelper2)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -2
camera.position.y = 0.5
camera.position.z = 5
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



const abint = new THREE.AmbientLight(0x000000, 0.5)
scene.add(abint)


const mloader = new THREE.GLTFLoader();
mloader.load('nasa_curiosity_clean/scene.gltf', function (gltf) {
   
    const rover = gltf.scene;


  //  The Models Animation
    const animations = gltf.animations;
   
    const mixer = new THREE.AnimationMixer(rover);

    animations.forEach(animation => {

        console.log(animation)
   
        mixer.clipAction(animation).play();
       

    });

    scene.add(gltf.scene)
 
    const clock = new THREE.Clock()



    const tick = () => {

        const elapsedTime = clock.getElapsedTime()


        plane.material.displacementScale = .3 + mouseY * 0.0008

       // rover.rotation.y =  mouseY * 0.005
       
        
        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)

        const delta = clock.getDelta();
        mixer.update(delta)
    }

    tick()


})



/**
 * Animate
 */



document.addEventListener('mousemove', animateTerrain)

let mouseY = 0;

function animateTerrain(event) {
    mouseY = event.clientY
}

