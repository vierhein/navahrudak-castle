import * as THREE from 'three';
import { Octree } from 'three/addons/math/Octree.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Player {
    height = 0.3;
    radius = 0.5;
    maxSpeed = 3;
    jumpSpeed = 3;
    gravity = -9.8;
    onGround = false;
    input = new THREE.Vector3();
    velocity = new THREE.Vector3();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
    controls = new PointerLockControls(this.camera, document.body);

    octree = new Octree();
    playerCollider = new Capsule(
        new THREE.Vector3(0, this.height / 2, 0),
        new THREE.Vector3(0, -this.height / 2, 0),
        this.radius
    );

    constructor(scene) {
        this.position.set(0, 4, -3);
        scene.add(this.camera);

        document.addEventListener('keyup', this.onKeyUp.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    get position() {
        return this.camera.position;
    }

    applyInputs(dt) {
        if (this.controls.isLocked === true) {
            // Apply gravity
            if (!this.onGround) {
                this.velocity.y += this.gravity * dt;
            } else {
                this.velocity.y = 0;
            }

            this.velocity.x = this.input.x;
            this.velocity.z = this.input.z;

            this.controls.moveRight(this.velocity.x * dt);
            this.controls.moveForward(this.velocity.z * dt);
            this.position.y += this.velocity.y * dt;

            // Update player collider position
            this.playerCollider.start.set(this.position.x, this.position.y + this.height / 2, this.position.z);
            this.playerCollider.end.set(this.position.x, this.position.y - this.height / 2, this.position.z);

            this.checkCollisions();

            // Prevent the player from falling through the ground
            if (this.position.y < 0) {
                this.position.y = 0;
                this.velocity.y = 0;
                this.onGround = true;
            }
        }

        document.getElementById('player-position').innerHTML = this.toString();
    }

    checkCollisions() {
        const result = this.octree.capsuleIntersect(this.playerCollider);
        if (result) {
            const collisionNormal = result.normal;
            const depth = result.depth;

            // Adjust the position and velocity of the player based on the collision
            this.position.add(collisionNormal.multiplyScalar(depth));
            this.velocity.addScaledVector(collisionNormal, -this.velocity.dot(collisionNormal));

            // If the collision normal is pointing upwards, the player is on the ground
            if (collisionNormal.y > 0.05) {
                this.onGround = true;
                this.velocity.y = Math.max(0, this.velocity.y);
            } else {
                this.onGround = false;
            }
        }
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
            case 'Space':
                if (this.onGround) {
                    this.velocity.y = this.jumpSpeed;
                    this.onGround = false;
                }
                break;
            case 'KeyR':
                if (this.repeat) break;
                this.position.set(0, 4, -3);
                this.velocity.set(0, 0, 0);
                break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
            case 'KeyS':
                this.input.z = 0;
                break;
            case 'KeyA':
            case 'KeyD':
                this.input.x = 0;
                break;
        }
    }

    toString() {
        let str = '';
        str += `X: ${this.position.x.toFixed(3)} `;
        str += `Y: ${this.position.y.toFixed(3)} `;
        str += `Z: ${this.position.z.toFixed(3)}`;
        return str;
    }
}
