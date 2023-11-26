const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
var images = [];

function clearCanvas() {
  images.length = 0;
  activeImage = null;
  drawImages();
}

function loadImages2(blobList) {
  blobList.forEach((blob, index) => {
    const img = new Image();
    img.onload = () => {
      const row = Math.floor(index/2);
      const column = index%2;
      const x = column * canvas.width/2;
      const y = row * canvas.height/5;
      const width = canvas.width/2;
      const height = canvas.height/5;

      images.push({
        img,
        x,
        y,
        width,
        height,
      });

      drawImages2();
    };
    img.src = URL.createObjectURL(blob);
  });
}

function drawImages2() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  images.forEach(({ img, x, y, width, height }) => {
    ctx.drawImage(img, x, y, width, height);
  });
}

function loadImages(blobList) {
  blobList.forEach((blob, index) => {
    const img = new Image();
    img.onload = () => {
      images.push({
        img,
        x: 50 * index,
        y: 50,
        width: 200,
        height: 150,
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
        mouseX >= x + width - 20 &&
        mouseX <= x + width &&
        mouseY >= y + height - 20 &&
        mouseY <= y + height
      ) {
        isResizing = true;
      }

      return;
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    console.log(activeImage);
    if (activeImage !== null) {
      const newMouseX = e.clientX - canvas.getBoundingClientRect().left;
      const newMouseY = e.clientY - canvas.getBoundingClientRect().top;

      if (isResizing) {
        images[activeImage].width = newMouseX - images[activeImage].x;
        images[activeImage].height = newMouseY - images[activeImage].y;
      } 
      // else {
      //   images[activeImage].x = newMouseX;
      //   images[activeImage].y = newMouseY;
      // }

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