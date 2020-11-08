const fireCanvas = document.getElementById("fire-canvas");

const socket = io();

socket.on('connect', ()=>{
    const id = socket.id;
    console.log(`Concectado com o id: ${id}`)
})

socket.on('renderFire',(table)=>{
    fireCanvas.innerHTML = table;
})

document.querySelectorAll("button").forEach(element => element.addEventListener("click", changefireStrength));

function changefireStrength(event){
    const value = event.target.value;
    socket.emit('changefireStrength',value)
}