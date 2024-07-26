const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
<<<<<<< HEAD
const penPencil = document.querySelector('.pen-pencil');
const clearButton = document.getElementById('clear');
const eraserButton = document.getElementById('eraser');
const resetButton = document.getElementById('reset');
const saveButton = document.getElementById('save');
const resizeButton = document.getElementById('resize');
const sizeTabs = document.querySelectorAll('#size-tab1, #size-tab2, #size-tab3, #size-tab4');
const colorButtons = document.querySelectorAll('.colors button');

let isDrawing = false;
let isEraser = false;
let currentSize = 2;
let currentColor = '#000000';
let canvasState = [];

function initializeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.backgroundColor = "white";
}

// Change cursor style
function setCursor(type) {
    canvas.style.cursor = type;
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    draw(e);
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        draw(e);
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath();
    saveCanvasState();
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mouseenter', (e) => {
    if (e.buttons === 1) { // Check if the left mouse button is pressed
        isDrawing = true;
        draw(e);
    }
});

sizeTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        currentSize = (index + 1) * 2; // Size 2, 4, 6, 8
        sizeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

colorButtons.forEach(button => {
    button.addEventListener('mouseover', () => {
        button.style.border = '2px solid black';
    });
    button.addEventListener('mouseout', () => {
        button.style.border = '1px solid black';
    });
    button.addEventListener('click', () => {
        currentColor = button.style.backgroundColor;
        isEraser = false;
        setCursor('crosshair');
    });
});

clearButton.addEventListener('click', () => {
    if (canvasState.length > 0) {
        canvasState.pop();
        if (canvasState.length > 0) {
            restoreCanvasState();
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
});

resetButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasState = [];
    saveCanvasToLocalStorage();
});

saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'canvas_image.png';
    link.href = canvas.toDataURL();
    link.click();
});

resizeButton.addEventListener('click', () => {
    const newWidth = prompt('Enter new width:', canvas.width);
    const newHeight = prompt('Enter new height:', canvas.height);
    if (newWidth && newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        initializeCanvas();
        restoreCanvasState();
    }
});


eraserButton.addEventListener('click', () => {
    isEraser = true;
    currentSize = 10;
    setCursor('url("eraser-icon.png"), auto'); // Change to an eraser cursor, use a custom eraser icon if available
});

penPencil.addEventListener('click', () => {
    isEraser = false;
    currentSize = 2;
    setCursor('url("pencil-icon.png"), auto'); // Change to a pencil cursor, use a custom pencil icon if available
});

window.addEventListener('beforeunload', () => {
    saveCanvasToLocalStorage();
});

// Drawing function
function draw(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isEraser ? 'white' : currentColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Save canvas state
function saveCanvasState() {
    canvasState.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    saveCanvasToLocalStorage();
}

// Restore canvas state
function restoreCanvasState() {
    if (canvasState.length > 0) {
        const state = canvasState[canvasState.length - 1];
        ctx.putImageData(state, 0, 0);
    }
}

// Save canvas to localStorage
function saveCanvasToLocalStorage() {
    localStorage.setItem('canvasState', JSON.stringify({
        dataURL: canvas.toDataURL(),
        width: canvas.width,
        height: canvas.height
    }));
}

// Load canvas from localStorage
function loadCanvasFromLocalStorage() {
    const savedState = localStorage.getItem('canvasState');
    if (savedState) {
        const { dataURL, width, height } = JSON.parse(savedState);
        canvas.width = width;
        canvas.height = height;
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            saveCanvasState();
        };
        img.src = dataURL;
    }
}

// Initialize canvas state
initializeCanvas();
loadCanvasFromLocalStorage();
if (canvasState.length === 0) {
    saveCanvasState();
}
=======
canvas.width = canvas.parentElement.clientWidth;
canvas.height = 650;

let drawing = false;
let actions = []; // Stack to keep track of actions
let index = -1; // Track current position in the stack
let currentColor = 'black'; // Default drawing color

// Load the saved canvas data from localStorage
function loadCanvas() {
    const savedData = localStorage.getItem('canvasData');
    if (savedData) {
        const img = new Image();
        img.src = savedData;
        img.onload = () => ctx.drawImage(img, 0, 0);
    }
}

// Save canvas data to localStorage
function saveCanvas() {
    const dataUrl = canvas.toDataURL();
    localStorage.setItem('canvasData', dataUrl);
}

// Function to save current state of the canvas to actions stack
function saveState() {
    actions = actions.slice(0, index + 1); // Remove any forward actions if they exist
    actions.push(canvas.toDataURL());
    index++;
}

// Set drawing color
function setColor(color) {
    currentColor = color;
}

// Start drawing
function startPosition(e) {
    drawing = true;
    draw(e);
}

// End drawing
function endPosition() {
    drawing = false;
    ctx.beginPath();
}

// Draw on canvas
function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor; // Use the selected color

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

    saveState(); // Save the current state after each drawing
}

// Undo the last action
function undo() {
    if (index < 0) return; // No actions to undo
    const img = new Image();
    img.src = actions[index];
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    index--;
}

// Clear the last drawing action
function clearLastAction() {
    if (index < 0) return; // No actions to clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (index > 0) {
        const img = new Image();
        img.src = actions[index - 1];
        img.onload = () => ctx.drawImage(img, 0, 0);
    }
    index--;
}

// Event listeners for color buttons
document.querySelectorAll('.colors button').forEach(button => {
    button.addEventListener('click', () => {
        const color = button.style.backgroundColor;
        setColor(color);
    });
});

// Event listeners
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
document.getElementById('clear').addEventListener('click', clearLastAction);
document.getElementById('reset').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem('canvasData');
    actions = [];
    index = -1;
});
document.getElementById('save').addEventListener('click', () => {
    saveCanvas();
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Load saved canvas on page load
window.onload = loadCanvas;
>>>>>>> feca3536b1a6979318f98ab983506b1d84d91915
