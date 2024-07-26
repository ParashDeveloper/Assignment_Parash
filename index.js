const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
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
