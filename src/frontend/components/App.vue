<template>
    <div id="app">
        <div class="app-scaffold">
            <div class="overlay-container">
                <div class="splash-container" :class="{'visible': splashVisible}">
                    <div class="splash-content">
                        <div class="logo">Panr</div>
                        <v-progress-circular indeterminate color="#FFFFFF"></v-progress-circular>
                    </div>
                </div>
                <div class="start-container" :class="{'visible': startVisible}">
                    <div class="start-content">
                        <div class="body">
                            <div class="logo"></div>
                            <div class="title">Virtual Tour</div>
                        </div>
                        <div class="button" @click="toggleStart()">Launch</div>
                    </div>
                </div>
            </div>
            <div class="body-container">
                <div class="ui-container">
                    <label for="devOrienToggle" style="position: absolute; top: 8px; right: 30px; z-index: 6; color: #FFFFFF;">Device Orientation:</label>
                    <input id="devOrienToggle" type="checkbox" style="position: absolute; top: 10px; right: 10px; z-index: 6;" v-if="deviceOrientationSupported" v-model="deviceOrientationEnabled" />
                </div>
                <div class="content-container">
                    <div ref="three"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as THREE from 'three';
    import Stats from 'three/examples/jsm/libs/stats.module.js';
    import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';
    import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

    export default {
        name: "PanrApp",
        data() {
            return {
                "splashVisible": true,
                "startVisible": true,
                three: null,
                lon: 0,
                lat: 0,
                phi: 0,
                theta: 0,
                onPointerDownMouseX: 0,
                onPointerDownMouseY: 0,
                deviceOrientationSupported: false,
                deviceOrientationEnabled: false,
                initialLocation: "bac59ce4-14ac-4b97-8497-3a555f6e22ed"
            }
        },
        methods: {
            toggleSplash: function (bool = !this.splashVisible) {
                this.splashVisible = bool;
            },
            toggleStart: function (bool = !this.startVisible) {
                this.startVisible = bool;

                document.documentElement.requestFullscreen();
            },
            loadScene: function(location) {
                location = this.$store.state.locations[location];

                const geometry = new THREE.SphereGeometry(500, 60, 40);
				// invert the geometry on the x-axis so that all of the faces point inward
				geometry.scale(-1, 1, 1);

				const texture = new THREE.TextureLoader().load(location.src);
				const material = new THREE.MeshBasicMaterial({ map: texture });

                const mesh = new THREE.Mesh(geometry, material);

                while(this.three.scene.children.length > 0){ 
                    this.three.scene.remove(this.three.scene.children[0]); 
                }

                this.three.scene.add(mesh);

                for(let hotspot of location.hotspots) {
                    const geometry2 = new THREE.CircleGeometry(10, 40);
                    const material2 = new THREE.MeshBasicMaterial({ color: hotspot.colour, side: THREE.DoubleSide, transparent: true, opacity: 0.75, depthTest: false });
                    const circle = new THREE.Mesh(geometry2, material2);

                    circle.position.set(hotspot.position[0], hotspot.position[1], hotspot.position[2])
                    circle.rotation.y = hotspot.rotation[0];
                    this.three.scene.add(circle);

                    circle.callback = () => {
                        this.loadScene(`${hotspot.location}`);
                    }
                }
            },
            update: function() {
                this.lat = Math.max(-85, Math.min(85, this.lat));
                this.phi = THREE.MathUtils.degToRad(90 - this.lat);
                this.theta = THREE.MathUtils.degToRad(this.lon);

                const x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
                const y = 500 * Math.cos(this.phi);
                const z = 500 * Math.sin(this.phi) * Math.sin(this.theta);

                this.three.camera.lookAt(x, y, z);
            },
            animate: function() {
                // requestAnimationFrame(this.animate);
                if(this.deviceOrientationEnabled) {
                    this.three.controls.update();
                } else {
                    this.update();
                }

                this.three.renderer.render(this.three.scene, this.three.camera);

                this.three.stats.update();
            },
            onPointerDown: function(event) {
                if (this.deviceOrientationEnabled || event.isPrimary === false) return;

				this.onPointerDownMouseX = event.clientX;
				this.onPointerDownMouseY = event.clientY;

				this.onPointerDownLon = this.lon;
				this.onPointerDownLat = this.lat;

				document.addEventListener('pointermove', this.onPointerMove);
				document.addEventListener('pointerup', this.onPointerUp);
            },
            onPointerMove: function(event) {
                if (this.deviceOrientationEnabled || event.isPrimary === false) return;

				this.lon = (this.onPointerDownMouseX - event.clientX) * 0.1 + this.onPointerDownLon;
				this.lat = (event.clientY - this.onPointerDownMouseY) * 0.1 + this.onPointerDownLat;
            },
            onPointerUp: function(event) {
                if (this.deviceOrientationEnabled || event.isPrimary === false) return;

				document.removeEventListener('pointermove', this.onPointerMove);
				document.removeEventListener('pointerup', this.onPointerUp);
            },
            onWindowResize: function() {
				this.three.camera.aspect = window.innerWidth / window.innerHeight;
				this.three.camera.updateProjectionMatrix();

				this.three.renderer.setSize(window.innerWidth, window.innerHeight);
			},
            onDocumentMouseDown: function(event) {
                // event.preventDefault();

                this.three.mouse.x = (event.clientX / this.three.renderer.domElement.clientWidth) * 2 - 1;
                this.three.mouse.y = -(event.clientY / this.three.renderer.domElement.clientHeight) * 2 + 1;

                this.three.raycaster.setFromCamera(this.three.mouse, this.three.camera);

                let intersects = this.three.raycaster.intersectObjects(this.three.scene.children); 

                if (intersects.length > 1) {
                    if(intersects[0].object.callback) intersects[0].object.callback();
                }
            }
        },
        mounted() {
            this.three = {
                camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100),
                scene: new THREE.Scene(),
                renderer: new THREE.WebGLRenderer(),
                controls: null,
                stats: new Stats(),
                raycaster: new THREE.Raycaster(),
                mouse: new THREE.Vector2()
            };

            window.addEventListener('click', this.onDocumentMouseDown, false);

            let arrow = new THREE.ArrowHelper(this.three.raycaster.ray.direction, this.three.raycaster.ray.origin, 100, Math.random() * 0xffffff );
            this.three.scene.add(arrow);
 
            arrow.setDirection(this.three.raycaster.ray.direction);
 
            // update the raycaster
            this.three.raycaster.set(this.three.camera.getWorldPosition(), this.three.camera.getWorldDirection());

            if (window.DeviceOrientationEvent) {
                this.three.controls = new DeviceOrientationControls(this.three.camera);

                this.deviceOrientationSupported = true;
            }

            let three = this.$refs['three'];

            this.three.renderer.setPixelRatio(window.devicePixelRatio);
            this.three.renderer.setSize(window.innerWidth, window.innerHeight);

            three.appendChild(this.three.renderer.domElement);
            three.appendChild(this.three.stats.dom);

            if('xr' in navigator) {
                navigator.xr.isSessionSupported('immersive-vr').then(supported => {
                    if(!supported) return;

                    three.appendChild(VRButton.createButton(this.three.renderer));
                    this.three.renderer.xr.enabled = true;

                    document.addEventListener('touch', this.onDocumentMouseDown, false);
                });
            }

            this.three.renderer.setAnimationLoop(this.animate);

            three.addEventListener('pointerdown', this.onPointerDown);
            three.style.touchAction = 'none';

            this.loadScene(this.initialLocation);

            this.animate();

            window.addEventListener('resize', this.onWindowResize);

            new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 1500);
            }).then(() => {
                this.toggleSplash(false);
            });
        }
    }
</script>

<style>
    html, body {
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
</style>

<style scoped>
    #app {
        display: flex;
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .app-scaffold {
        display: flex;
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .app-scaffold .overlay-container {
        display: flex;
        position: absolute;

        z-index: 4;
        pointer-events: none;

        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .app-scaffold .body-container {
        display: flex;
        position: absolute;

        z-index: 2;

        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .splash-container {
        display: flex;
        position: absolute;
        z-index: 2;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: linear-gradient(68.66deg, #DB00FF 0%, #FF007A 10.42%, #FF2828 46.87%, #FFC149 100%), #000000;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease-in-out;
    }
    .splash-container.visible {
        opacity: 1;
        pointer-events: all;
    }
    .splash-container .splash-content {
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .splash-container .splash-content .logo {
        font-family: var(--theme-font);
        font-size: 60px;
        font-weight: 900;
        color: white;
        margin-bottom: 6px;
    }

    .start-container {
        display: flex;
        position: absolute;
        z-index: 1;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: linear-gradient(68.66deg, rgba(219, 0, 255, 1) 0%, rgba(255, 0, 123, 0.8) 10.42%, rgba(255, 40, 40, 0.6) 46.87%, rgba(255, 193, 73, 0.9) 100%), url('../img/background/start.jpg'), #000000;
        background-size: cover;
        background-position: bottom center;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease-in-out;
    }
    .start-container.visible {
        opacity: 1;
        pointer-events: all;
    }
    .start-container .start-content {
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 600px;
        height: 100%;
        padding: 12px;
    }
    .start-container .start-content .body {
        display: flex;
        position: relative;
        flex-grow: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        justify-self: flex-start;
        align-items: flex-start;
        width: 100%;
        max-height: 340px;
        margin: auto;
        padding: 20px;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0.6);
    }
    .start-container .start-content .body .logo {
        display: flex;
        position: relative;
        min-width: 100%;
        height: 100%;
        max-height: 128px;
        margin: auto;
        background-image: url('../img/logo/utc-olp.svg');
        background-size: contain;
        background-position: center;
    }
    .start-container .start-content .body .title {
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 100%;
        font-family: var(--theme-font);
        font-size: 32px;
        font-weight: 700;
        color: #FFFFFF;
    }
    .start-container .start-content .button {
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        justify-self: flex-end;
        align-self: flex-end;
        width: 100%;
        height: 48px;
        font-family: var(--theme-font);
        font-weight: 800;
        font-size: 24px;
        background-color: #2E35DB;
        color: #FFFFFF;
        border-radius: 8px;
        transition: background-color 0.2s ease-in-out;
    }
    .start-container .start-content .button:hover, .start-container .start-content .button:focus {
        background-color: #232792;
    }

    .content-container {
        display: flex;
        position: absolute;
        width: 100vw;
        height: 100vh;
        /* background-color: #000000; */
    }
</style>