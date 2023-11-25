(function () {
  "use strict";

  var panelImages = [];

  /**
   * Preloader
   */
  function showLoadingIndicator() {
    // Display the preloader
    const preloader = document.getElementById("preloader");
    preloader.style.display = "flex";
  }

  function hideLoadingIndicator() {
    // Hide the preloader
    const preloader = document.getElementById("preloader");
    preloader.style.display = "none";
  }

  /**
   * Slider animation
   */
  function initializeSliderButtons() {
    document
      .querySelector(".carousel-control-next")
      .addEventListener("click", function () {
        $("#carouselExampleIndicators").carousel("next");
      });

    document
      .querySelector(".carousel-control-prev")
      .addEventListener("click", function () {
        $("#carouselExampleIndicators").carousel("prev");
      });
  }

  /**
   * Querying from API
   */
  async function queryImage(data) {
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
      }
    );

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return null;
    }

    const imageBlob = await response.blob();
    return imageBlob;
  }

  function addButtonsToCarousel() {
    const carouselInner = document.querySelector(".carousel-inner");
    // Create the previous control
    const prevControl = document.createElement("a");
    prevControl.className = "carousel-control-prev";
    prevControl.href = "#carouselExampleIndicators";
    prevControl.role = "button";
    prevControl.setAttribute("data-slide", "prev");

    const prevIcon = document.createElement("span");
    prevIcon.className = "carousel-control-prev-icon";
    prevIcon.setAttribute("aria-hidden", "true");

    const prevText = document.createElement("span");
    prevText.className = "sr-only";
    prevText.textContent = "Previous";

    prevControl.appendChild(prevIcon);
    prevControl.appendChild(prevText);

    // Create the next control
    const nextControl = document.createElement("a");
    nextControl.className = "carousel-control-next";
    nextControl.href = "#carouselExampleIndicators";
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

  function reinitializeSlider() {
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
      console.log(imageBlob);
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
    addButtonsToCarousel();

    initializeSliderButtons();
  }

  async function appendImageToGlobalVariable(text) {
    showLoadingIndicator();

    // Query image based on text
    /**{@Type } */
    const imageBlob = await queryImage({ inputs: text });
    console.log(imageBlob);
    panelImages.push(imageBlob);

    reinitializeSlider();
    hideLoadingIndicator();
  }

  /**
   * Extract the data from the textarea
   */
  document
    .getElementById("generate-image-btn")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default behavior (navigation)

      var textareaValue = document.getElementById("formControlTextarea1").value;

      if (panelImages.length == 10) {
        alert("Limit for 10 images!!");
        return;
      }

      appendImageToGlobalVariable(textareaValue.toString()).then(() => {
        console.log(textareaValue.toString());
      });
    });

  hideLoadingIndicator();

  /**
   * Initiate Pure Counter
   */
  new PureCounter();
})();
