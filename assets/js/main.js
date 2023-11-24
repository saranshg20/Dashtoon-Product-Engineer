(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Mobile nav dropdowns activate
   */
  on(
    "click",
    ".navbar .dropdown > a",
    function (e) {
      if (select("#navbar").classList.contains("navbar-mobile")) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle("dropdown-active");
      }
    },
    true
  );

  /**
   * Scroll with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Preloader
   */
  function showLoadingIndicator() {
    // Display the preloader
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'flex';
  }

  function hideLoadingIndicator() {
    // Hide the preloader
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
  }

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  /**
   * Slider animation
   */
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

  function reinitializeSlider() {
    // Retrieve stored images from local storage
    const storedImages = JSON.parse(localStorage.getItem("comicImages")) || [];

    // Get the carousel inner container
    const carouselInner = document.querySelector('.carousel-inner');

    // Clear existing carousel items
    carouselInner.innerHTML = '';

    // Loop through stored images and append them to the carousel
    storedImages.forEach(({ text, imageBlob }) => {
      console.log(imageBlob);
      const imageUrl = URL.createObjectURL(imageBlob);

      // Create a carousel item
      const carouselItem = document.createElement('div');
      carouselItem.className = 'carousel-item';

      // Create an image element
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      imgElement.alt = text;
      imgElement.className = 'd-block w-100';

      // Append the image to the carousel item
      carouselItem.appendChild(imgElement);

      // Append the carousel item to the carousel inner container
      carouselInner.appendChild(carouselItem);
    });

    // Make the first item active
    const firstItem = carouselInner.firstChild;
    firstItem.classList.add('active');
  }

  async function appendImageToLocalstorage(text) {
    showLoadingIndicator();
    const MAX_IMAGES = 10;

    // Query image based on text
    const imageBlob = await queryImage({ inputs: text });

    // Get the current images from local storage
    let images = JSON.parse(localStorage.getItem("comicImages")) || [];

    // Append the new image
    images.push({ text, imageBlob });

    // If the number of images exceeds the maximum, remove the oldest one
    if (images.length > MAX_IMAGES) {
      images.shift(); // Remove the oldest image
    }

    console.log(localStorage.getItem("comicImages"));

    // Save the updated images to local storage
    localStorage.setItem("comicImages", JSON.stringify(images));

    console.log(localStorage.getItem("comicImages"));
    console.log(JSON.stringify(imageBlob));

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

      appendImageToLocalstorage(textareaValue.toString()).then(() => {
        console.log(textareaValue.toString());
        console.log("Image appended to local storage");
      });
    });

  hideLoadingIndicator();
  reinitializeSlider();
  /**
   * Initiate Pure Counter
   */
  new PureCounter();
})();