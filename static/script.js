const img = document.getElementById('draggableImage');
let isMoving = false;
let offsetX = 0;
let offsetY = 0;

img.addEventListener('mousedown', (e) => {
    isMoving = true;
    offsetX = e.clientX - img.getBoundingClientRect().left;
    offsetY = e.clientY - img.getBoundingClientRect().top;
    img.style.position = 'absolute';
});

document.addEventListener('mousemove', (e) => {
    if (isMoving) {
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        
        // Get image dimensions
        const rect = img.getBoundingClientRect();
        const imgWidth = rect.width;
        const imgHeight = rect.height;
        
        // Constrain to viewport
        x = Math.max(0, Math.min(x, window.innerWidth - imgWidth));
        y = Math.max(0, Math.min(y, window.innerHeight - imgHeight));
        
        img.style.left = x + 'px';
        img.style.top = y + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isMoving = false;
});