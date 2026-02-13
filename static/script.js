const img = document.getElementById('draggableImage');
const container = document.querySelector('.image-container');
const handle = document.getElementById('dragHandle');
let isMoving = false;
let offsetX = 0;
let offsetY = 0;
// bottom offset in px to keep the container above the viewport bottom
const bottomOffset = 20;

handle.addEventListener('mousedown', (e) => {
    isMoving = true;
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    // stop any falling and switch to airborne image while grabbed
    isFalling = false;
    img.src = 'images/caffeAir.gif';
});

document.addEventListener('mousemove', (e) => {
    if (isMoving) {
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        
        // Get container dimensions
        const rect = container.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        
        // Constrain to viewport (respect bottomOffset)
        x = Math.max(0, Math.min(x, window.innerWidth - containerWidth));
        y = Math.max(0, Math.min(y, window.innerHeight - containerHeight - bottomOffset));
        
        container.style.left = x + 'px';
        container.style.top = y + 'px';
    }
});




// GRAVITY simulation: when released, apply gravity until container rests at bottom
let vy = 0; // vertical velocity (px/s)
let lastTime = null;
let gravity = 1500; // px/s^2
let bounceFactor = 0.25; // energy retained after bounce
let isFalling = false;

function startFall() {
    // only start falling if not being dragged
    if (isMoving) return;
    // set initial velocity to 0 and start loop
    vy = 0;
    lastTime = null;
    isFalling = true;
    requestAnimationFrame(step);
}

function step(timestamp) {
    if (!isFalling) return;
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000; // seconds
    lastTime = timestamp;

    // integrate velocity
    vy += gravity * dt;

    // update position
    const rect = container.getBoundingClientRect();
    let newY = rect.top + vy * dt;
    const containerHeight = rect.height;
    const maxY = window.innerHeight - containerHeight - bottomOffset;

    if (newY >= maxY) {
        // hit bottom — stop without bouncing
        newY = maxY;
        isFalling = false;
        vy = 0;
        container.style.top = newY + 'px';
        return;
    }

    container.style.top = newY + 'px';
    requestAnimationFrame(step);
}

// start gravity when mouseup if container not at bottom
document.addEventListener('mouseup', (e) => {
    if (!isMoving) return;
    isMoving = false;
    // revert image to default when released
    img.src = 'images/caffeDefault.gif';
    // small delay to allow position to settle
    setTimeout(() => {
        const rect = container.getBoundingClientRect();
        const containerHeight = rect.height;
        const maxY = window.innerHeight - containerHeight - bottomOffset;
        if (rect.top < maxY - 1) {
            startFall();
        }
    }, 0);
});

// (handled in the primary mousedown listener)

// continuously check when idle and start gravity if needed
function checkIdle() {
    const rect = container.getBoundingClientRect();
    const containerHeight = rect.height;
    const maxY = window.innerHeight - containerHeight - bottomOffset;
    if (!isMoving && !isFalling && rect.top < maxY - 1) {
        startFall();
    }
    updateShake();
    requestAnimationFrame(checkIdle);
}

requestAnimationFrame(checkIdle);

// Toggle shake only while grabbed and above vertical midpoint
function updateShake() {
    const rect = container.getBoundingClientRect();
    const mid = window.innerHeight / 2;
    if (isMoving && rect.top < mid) {
        if (!container.classList.contains('shake')) {
            container.classList.add('shake');
            img.src = 'images/caffeShake.gif';
        }
    } else {
        if (container.classList.contains('shake')) {
            container.classList.remove('shake');
            // when leaving shake: if still dragging, show airborne image; otherwise default
            img.src = isMoving ? 'images/caffeAir.gif' : 'images/caffeDefault.gif';
        }
    }
}