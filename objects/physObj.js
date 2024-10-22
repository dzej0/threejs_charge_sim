import * as THREE from 'three'
import { Vector3 } from "three"

const k = 0.1

function calcDistance(pos1, pos2) {
  let x,y,z
  x = pos2.x - pos1.x
  y = pos2.y - pos1.y
  z = pos2.z - pos1.z
  return Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2))
}

export class PhysObj {
  worldObject = new THREE.Mesh()
  static objectList = []

  moveable = new Boolean
  mass
  charge

  velocity = new Vector3

  constructor(moveable, mass, charge, velocity, position, scene) {
    console.log("Creating object with parameters:")
    console.log(moveable) 
    console.log(mass) 
    console.log(charge) 
    console.log(velocity) 
    console.log(position) 
    
    this.moveable = moveable
    this.mass = mass
    this.charge = charge
    this.velocity = velocity
    
    const positive_material = new THREE.MeshStandardMaterial( {color:0xff0000} )
    const negative_material = new THREE.MeshStandardMaterial( {color:0x0000ff} )
    const neutral_material = new THREE.MeshStandardMaterial({color:0x333333})

    const sphere_geometry = new THREE.SphereGeometry(1, 64, 64)
    
    let tempMaterial

    if (charge > 0) {
      tempMaterial = positive_material
    } else if (charge < 0) {
      tempMaterial = negative_material
    } else {
      tempMaterial = neutral_material
    }

    this.worldObject = new THREE.Mesh(sphere_geometry, tempMaterial)
    scene.add(this.worldObject)
    
    this.worldObject.position.set(position.x, position.y, position.z)

    PhysObj.objectList.push(this)
  }

  applyForce(force, delta) {
    if (this.moveable) {
      this.velocity.x += (force.x/this.mass) * delta
      this.velocity.y += (force.y/this.mass) * delta
      this.velocity.z += (force.z/this.mass) * delta
    }
  }
  
  changePosition(translationVector) {
    this.worldObject.position.set(
      this.worldObject.position.x += translationVector.x,
      this.worldObject.position.y += translationVector.y,
      this.worldObject.position.z += translationVector.z
      )
  }

  static #moveTick(delta) {
    PhysObj.objectList.forEach((obj) => {
      let translationVector = new THREE.Vector3
      translationVector.set(obj.velocity.x, obj.velocity.y, obj.velocity.z)
      translationVector.multiplyScalar(delta)
      obj.changePosition(translationVector)
    })
  }
  
  static tick(delta) {
    for (let i = 0; i < PhysObj.objectList.length; i++) {
      for (let j = i + 1; j < PhysObj.objectList.length; j++) {
        if (calcDistance(PhysObj.objectList[i].worldObject.position, PhysObj.objectList[j].worldObject.position) == 0) {
          console.warn(`Distance between objects ${i} and ${j} is 0`)
          console.warn(PhysObj.objectList[i], PhysObj.objectList[j])
          console.warn(`Moving objects away`)
          PhysObj.objectList[i].worldObject.position.addScalar(0.05)
          PhysObj.objectList[j].worldObject.position.addScalar(-0.05)
          continue
        }
        let forceValue = 
        k * PhysObj.objectList[i].charge * PhysObj.objectList[j].charge 
        / Math.pow(calcDistance(PhysObj.objectList[i].worldObject.position, PhysObj.objectList[j].worldObject.position), 2)

        let force = new THREE.Vector3
        force.x = PhysObj.objectList[i].worldObject.position.x - PhysObj.objectList[j].worldObject.position.x
        force.y = PhysObj.objectList[i].worldObject.position.y - PhysObj.objectList[j].worldObject.position.y
        force.z = PhysObj.objectList[i].worldObject.position.z - PhysObj.objectList[j].worldObject.position.z
        force.normalize()
        force.multiplyScalar(forceValue)

        PhysObj.objectList[i].applyForce(force, delta)
        PhysObj.objectList[j].applyForce(force.multiplyScalar(-1), delta)
      }
    }

    PhysObj.#moveTick(delta)
  }

  static editObject(index, callback) {
    callback(PhysObj.objectList[index])
  }

  static removeAllObjects() {
    PhysObj.objectList = []
  }
}