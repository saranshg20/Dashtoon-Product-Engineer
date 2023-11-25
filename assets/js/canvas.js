const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
var images = [];

function loadImages(blobList) {
  blobList.forEach((blob, index) => {
    const img = new Image();
    img.onload = () => {
      images.push({
        img,
        x: 50 * index,
        y: 50,
        width: 100,
        height: 75,
      });
      drawImages();
    };
    img.src = URL.createObjectURL(blob);
  });
}

function drawImages() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  images.forEach(({ img, x, y, width, height }) => {
    ctx.drawImage(img, x, y, width, height);
  });
}

function handleMouseEvents(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  let activeImage = null;
  let isResizing = false;

  images.forEach(({ x, y, width, height }, index) => {
    if (
      mouseX >= x &&
      mouseX <= x + width &&
      mouseY >= y &&
      mouseY <= y + height
    ) {
      activeImage = index;

      // Check if mouse is near any corner for resizing
      if (
        mouseX >= x + width - 10 &&
        mouseX <= x + width &&
        mouseY >= y + height - 10 &&
        mouseY <= y + height
      ) {
        isResizing = true;
      }
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (activeImage !== null) {
      const newMouseX = e.clientX - canvas.getBoundingClientRect().left;
      const newMouseY = e.clientY - canvas.getBoundingClientRect().top;

      if (isResizing) {
        images[activeImage].width = newMouseX - images[activeImage].x;
        images[activeImage].height = newMouseY - images[activeImage].y;
      } else {
        images[activeImage].x = newMouseX - images[activeImage].width / 2;
        images[activeImage].y = newMouseY - images[activeImage].height / 2;
      }

      drawImages();
    }
  });

  canvas.addEventListener("mouseup", () => {
    activeImage = null;
    isResizing = false;
    canvas.removeEventListener("mousemove", handleMouseEvents);
  });
}

// Resize canvas according to window dimensions
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

canvas.addEventListener("mousedown", (event) => {
  handleMouseEvents(event);
});
