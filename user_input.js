import * as THREE from 'three'
import { PhysObj } from './objects/physObj'

const pauseButton = document.getElementById("pause")

// ids of various input fields
const [moveable, mass, charge, vx, vy, vz, px, py, pz] 
    = ["input_moveable", "input_mass", "input_charge", "input_v_x", "input_v_y", "input_v_z", "input_pos_x", "input_pos_y", "input_pos_z"]


function getDataFromElementId(id) {
  if (id == "input_moveable") {
    console.log(document.getElementById(id).checked)
    return document.getElementById(id).checked
  }

  if (document.getElementById(id).value == "0") {
    return 0
  }

  if (document.getElementById(id).value == "") {
    return 0
  }

  if (isNaN(parseInt(document.getElementById(id).value))) {
    return 0
  }

  console.log(parseInt(document.getElementById(id).value))
  return parseInt(document.getElementById(id).value)
}

function addObjectToScene(moveable, mass, charge, velocity, position, scene) {
  new PhysObj(moveable, mass, charge, velocity, position, scene)
}

function addObjectFromUserInput(scene) {
  if (getDataFromElementId(mass) == 0) {
    window.alert("mass of an object can't be 0")
    return 0
  }
  
  addObjectToScene(getDataFromElementId(moveable), 
    getDataFromElementId(mass), 
    getDataFromElementId(charge), 
    new THREE.Vector3(getDataFromElementId(vx), 
    getDataFromElementId(vy), 
    getDataFromElementId(vz)), 
    new THREE.Vector3(getDataFromElementId(px), 
    getDataFromElementId(py), 
    getDataFromElementId(pz)), scene)
}

export function addButton(scene) {
  document.addEventListener("keydown", (key) => {
    console.log(key.key)
    if (key.key == "Enter") {
      document.getElementById("big_button").click()
    }
  })
  document.getElementById("big_button").addEventListener("click", () => {
    console.log("click")
    addObjectFromUserInput(scene)
  })
}

document.getElementById(moveable).addEventListener("click", () => {
  console.log("test")
})

// fix this firing twice

pauseButton.addEventListener("click", () => {
  console.log(pauseButton.getAttribute("on"))
  if (pauseButton.getAttribute("on") == 1) {
    pauseButton.setAttribute("on", 0)
    pauseButton.style.backgroundColor = "#941e06"
  } else {
    pauseButton.setAttribute("on", 1)
    pauseButton.style.backgroundColor = "#117d2e"
  }
})