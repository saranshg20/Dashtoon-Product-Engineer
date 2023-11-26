/**
 * Generated Panel Images List
 */
var panelImages = [];

/**
 * Initialize Event Listeners
 */
function initEventListeners() {
  /**
   * Extract the data from the textarea
   */
  document
    .getElementById("generate-image-btn")
    .addEventListener("click", function (event) {
      event.preventDefault();

      var textareaValue = document.getElementById("formControlTextarea1").value;

      if (textareaValue.trim() == "") {
        return;
      }

      if (panelImages.length == 10) {
        alert("Limit for 10 images!!");
        return;
      }

      appendImage(textareaValue.toString());
    });

  /**
   * Add images to canvas area
   */
  document
    .getElementById("add-image-btn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      clearCanvas();
      loadImages2(panelImages);
    });

  /**
   * Add images to canvas area
   */
  document
    .getElementById("download-comic-btn")
    .addEventListener("click", function (event) {
      // Get the canvas element
      var canvas = document.getElementById("myCanvas");

      // Create a new canvas with the desired width and height
      var newCanvas = document.createElement("canvas");
      newCanvas.width = 600;
      newCanvas.height = 900;

      // Copy the content of the original canvas to the new canvas
      var context = newCanvas.getContext("2d");
      context.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);

      // Convert the new canvas to a data URL
      var dataUrl = newCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "canvas_image.png";
      link.click();
    });
}

/**
 * Initialize Buttons in Slider
 */
function initButtonsInCarousel() {
  const carouselInner = document.querySelector(".carousel-inner");
  // Create the previous control
  const prevControl = document.createElement("a");
  prevControl.className = "carousel-control-prev";
  prevControl.href = "#carouselIndicators";
  prevControl.role = "button";
  prevControl.setAttribute("data-slide", "prev");

  const prevIcon = document.createElement("span");
  prevIcon.className = "carousel-control-prev-icon";
  prevIcon.setAttribute("aria-hidden", "true");

  const prevText = document.createElement("span");
  prevText.className = "sr-only";
  prevText.textContent = "Prev";

  prevControl.appendChild(prevIcon);
  prevControl.appendChild(prevText);

  // Create the next control
  const nextControl = document.createElement("a");
  nextControl.className = "carousel-control-next";
  nextControl.href = "#carouselIndicators";
  nextControl.role = "button";
  nextControl.setAttribute("data-slide", "next");

  const nextIcon = document.createElement("span");
  nextIcon.className = "carousel-control-next-icon";
  nextIcon.setAttribute("aria-hidden", "true");

  const nextText = document.createElement("span");
  nextText.className = "sr-only";
  nextText.textContent = "Next";

  nextControl.appendChild(nextIcon);
  nextControl.appendChild(nextText);

  // Append controls to the carousel container
  carouselInner.appendChild(prevControl);
  carouselInner.appendChild(nextControl);
}

/**
 * Querying from API
 */
async function queryImage(data, timeout = 50000) {
  // Create an AbortController
  const controller = new AbortController();
  const { signal } = controller;

  // Set a timeout to abort the fetch after the specified time
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        headers: {
          Accept: "image/png",
          Authorization:
            "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
        signal, // Attach the signal to the fetch request
      }
    );

    // Clear the timeout since the fetch was successful
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      alert("Please retry. Found error while making API call.");
      return null;
    }

    const imageBlob = await response.blob();
    return imageBlob;
  } catch (error) {
    // Handle the aborted fetch or other errors
    if (error.name === "AbortError") {
      alert("Timeout, try again.");
    } else {
      console.error("Fetch error:", error);
    }
    return null;
  }
}

/**
 * Modify sliders
 * on successful query output
 */
function modifySlider() {
  // Get the carousel inner container
  const carouselInner = document.querySelector(".carousel-inner");

  // Clear existing carousel items
  carouselInner.innerHTML = "";

  // Loop through stored images and append them to the carousel
  panelImages.forEach((imageBlob) => {
    // Create a carousel item
    const carouselItem = document.createElement("div");
    carouselItem.className = "carousel-item";

    // Create an image element
    const imgElement = document.createElement("img");
    imgElement.src = URL.createObjectURL(imageBlob);
    imgElement.alt = "Image";
    imgElement.className = "d-block w-100";

    // Append the image to the carousel item
    carouselItem.appendChild(imgElement);

    // Append the carousel item to the carousel inner container
    carouselInner.appendChild(carouselItem);
  });

  // Make the first item active
  const firstItem = carouselInner.firstChild;
  firstItem.classList.add("active");

  // Add buttons to move in carousel
  initButtonsInCarousel();
}

/**
 * Add image to global variable
 * @param {String} text
 */
async function appendImage(text) {
  showLoadingIndicator();

  // Query image based on text
  const imageBlob = await queryImage({ inputs: text });
  panelImages.push(imageBlob);

  modifySlider();
  hideLoadingIndicator();
}

/**
 * Main
 */
function main() {
  initEventListeners();
  hideLoadingIndicator();
  resizeCanvas();
}

main();
