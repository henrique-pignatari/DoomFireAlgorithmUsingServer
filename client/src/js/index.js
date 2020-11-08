const fireCanvas = document.getElementById("fire-canvas");
const fireHeigth = 40;
const fireWidth = 40;
const fireCollorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}];
let fireStrength = 3;
let fireIntensityArray = [];

const socket = io();

socket.on('connect', ()=>{
    const id = socket.id;
    console.log(`Concectado com o id: ${id}`)
})

document.querySelectorAll("button").forEach(element => element.addEventListener("click", changefireStrength))

function createFireDataStructure(){
    const numberOfPixels = fireHeigth*fireWidth;

    for (let i = 0; i < numberOfPixels; i++) {
        fireIntensityArray[i] = 0;       
    }
}

function calculateFirePropagation(){
    for (let column = 0; column < fireWidth; column++) {
        for(let row = 0; row < fireHeigth; row++){
            const pixelIndex = column + (fireWidth*row);
            updateFireIntensityPerPixel(pixelIndex);
        }
    }
    renderFire();
}

function updateFireIntensityPerPixel(currentPixelIndex){
    const belowPixelIndex = currentPixelIndex + fireWidth;
    
    if(belowPixelIndex >= fireWidth*fireHeigth){
        return
    }

    const decay = Math.floor(Math.random()*fireStrength);
    const belowPixelFireIntensity = fireIntensityArray[belowPixelIndex];
    const newFireIntensity = 
    belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;

    fireIntensityArray[currentPixelIndex - decay] = newFireIntensity;
}

function createFireSource(){
    for(let column = 0; column <= fireWidth; column++){
        const overflowPixelIndex = fireWidth * fireHeigth;
        const pixelIndex = (overflowPixelIndex - fireWidth) + column

        fireIntensityArray[pixelIndex] = 36;
    }
}

function renderFire(){
    const debug = false;
    let htmlText = '<table cellpadding=0 cellspacing=0>';

    for(let row= 0; row < fireHeigth; row++){
        htmlText += '<tr>'
        
        for (let column = 0; column < fireWidth; column++) {
            const pixelIndex = column + (fireWidth * row);
            const fireIntensity = fireIntensityArray[pixelIndex];

            if(debug === true){
                htmlText+='<td>';
                htmlText += `<div class="pixel-index">${pixelIndex}</div>`;
                htmlText += fireIntensity;
                htmlText += '</td>';
            }else{
                const color = fireCollorsPalette[fireIntensity]
                const colorString = `${color.r},${color.g},${color.b}`
                htmlText += `<td class="pixel" style="background-color: rgb(${colorString})">`
                htmlText += "</td>"
            }
        }
        htmlText += '</tr>'
    }
    htmlText += '</table>'

    fireCanvas.innerHTML = htmlText;
}
function start(){
    createFireDataStructure();
    createFireSource();
    renderFire()

    setInterval(calculateFirePropagation,50)
}

start()

function changefireStrength(event){
    const value = event.target.value;
    const maxFireStrength = 2;
    const minFireStrength = 10;
    const changeValue = 0.5; 
    
    if(value === "max"){
        fireStrength = maxFireStrength
    }else if(value === "min"){
        fireStrength = minFireStrength
    }else if(value === "+"){
        fireStrength -= (fireStrength-changeValue) >= maxFireStrength ? changeValue : 0; 
        console.log(fireStrength)
    }else if(value === "-"){
        fireStrength += (fireStrength+changeValue) <= minFireStrength ? changeValue : 0;
        console.log(fireStrength)
    }else if(value == "emit"){
        socket.emit(value,"Essa e a mensagem vinda do client");
    }
}