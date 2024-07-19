import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Player {
    height = 1.75;
    radius = 0.5;
    maxSpeed = 5;
  
    jumpSpeed = 10;
    sprinting = false;
    onGround = false;
  
    input = new THREE.Vector3();
    velocity = new THREE.Vector3();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
    controls = new PointerLockControls(this.camera, document.body);
    
    /**
     * @param {THREE.Scene} scene
     */
    constructor(scene) {
        this.position.set(0, 1, 0);
        scene.add(this.camera);

        document.addEventListener('keyup', this.onKeyUp.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        // document.addEventListener('mousedown', this.onMouseDown.bind(this));
    }

    /**
    * @param {THREE.Vector3}
    */
    get position() {
        return this.camera.position;
    }

    applyInputs(dt) {
        // console.log(dt);
        if (this.controls.isLocked === true) {
            this.velocity.x = this.input.x;
            this.velocity.z = this.input.z;
            this.controls.moveRight(this.velocity.x * dt);
            this.controls.moveForward(this.velocity.z * dt);
            this.position.y += this.velocity.y * dt;

            if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
            }
        }

        document.getElementById('player-position').innerHTML = this.toString();
    }

    onKeyDown(event) {
        if (!this.controls.isLocked) {
            this.controls.lock();
        }
    
        switch (event.code) {
          case 'KeyW':
            this.input.z = this.maxSpeed;
            break;
          case 'KeyA':
            this.input.x = -this.maxSpeed;
            break;
          case 'KeyS':
            this.input.z = -this.maxSpeed;
            break;
          case 'KeyD':
            this.input.x = this.maxSpeed;
            break;
          case 'KeyR':
            if (this.repeat) break;
            this.position.y = 1;
            this.velocity.set(0, 0, 0);
            break;
        }
      }
    
    /**
     * Event handler for 'keyup' event
     * @param {KeyboardEvent} event 
    */
    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
            this.input.z = 0;
            break;
            case 'KeyA':
            this.input.x = 0;
            break;
            case 'KeyS':
            this.input.z = 0;
            break;
            case 'KeyD':
            this.input.x = 0;
            break;
        }
    }
    
    /**
    * Returns player position in a readable string form
    * @returns {string}
    */
    toString() {
        let str = '';
        str += `X: ${this.position.x.toFixed(3)} `;
        str += `Y: ${this.position.y.toFixed(3)} `;
        str += `Z: ${this.position.z.toFixed(3)}`;
        return str;
    }
}