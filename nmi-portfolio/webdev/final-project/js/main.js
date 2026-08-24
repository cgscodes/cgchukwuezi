document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNavLink();
  setupBookingForm();
  setupGalleryFilters();
  setupFeaturedCarousel();
  setupBookingCalendar();
});

// Highlight current nav link based on URL
function highlightActiveNavLink() {
  const navLinks = document.querySelectorAll("header nav a[href$='.html']");
  const path = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Simple fake submit handler for the booking form
function setupBookingForm() {
  const form = document.querySelector("main form");

  // Only run on the booking page where the form exists
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const nameInput = form.querySelector("#name");
    const dateInput = form.querySelector("#date");

    const name = nameInput?.value.trim();
    const date = dateInput?.value.trim();

    // If somehow missing, do nothing
    if (!name || !date) return;

    let message = form.querySelector(".booking-message");
    if (!message) {
      message = document.createElement("p");
      message.className = "booking-message";
      form.appendChild(message);
    }

    message.textContent = `Thanks, ${name}. Your demo request for ${date} has been recorded.`;
  });
}

// Gallery filter buttons
function setupGalleryFilters() {
  const buttons = document.querySelectorAll(".gallery-filter-btn");
  const items = document.querySelectorAll(".gallery-item");

  if (!buttons.length || !items.length) return; // not on gallery page

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      // Update active state on buttons
      buttons.forEach(btn => {
        btn.classList.toggle("is-active", btn === button);
      });

      // Show / hide items
      items.forEach(item => {
        const category = item.dataset.category;
        const shouldShow = filter === "all" || category === filter;

        item.style.display = shouldShow ? "" : "none";
      });
    });
  });
}

// Featured carousel on gallery page
function setupFeaturedCarousel() {
  const carousel = document.querySelector(".featured-carousel");
  if (!carousel) return;

  const slides = carousel.querySelectorAll(".carousel-slide");
  const dots = carousel.querySelectorAll(".carousel-dot");
  const prevBtn = carousel.querySelector(".carousel-arrow.prev");
  const nextBtn = carousel.querySelector(".carousel-arrow.next");

  if (!slides.length) return;

  let currentIndex = 0;

  function showSlide(index) {
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });

    currentIndex = index;
  }

  prevBtn?.addEventListener("click", () => {
    showSlide(currentIndex - 1);
  });

  nextBtn?.addEventListener("click", () => {
    showSlide(currentIndex + 1);
  });

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.index) || 0;
      showSlide(index);
    });
  });
}

// Booking page calendar
function setupBookingCalendar() {
  const calendar = document.querySelector(".calendar");
  const daysContainer = document.querySelector("#calendar-days");
  const titleEl = document.querySelector(".calendar-title");
  const prevBtn = document.querySelector(".calendar-nav.prev-month");
  const nextBtn = document.querySelector(".calendar-nav.next-month");
  const dateInput = document.querySelector("#date");

  if (!calendar || !daysContainer || !titleEl || !dateInput) return;

  let current = new Date();
  current.setDate(1); // point to first of the month
  let selectedDate = null;

  function renderCalendar() {
    const year = current.getFullYear();
    const month = current.getMonth(); // 0-11

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    titleEl.textContent = `${monthNames[month]} ${year}`;
    daysContainer.innerHTML = "";

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Empty slots before 1st
    for (let i = 0; i < firstDayIndex; i++) {
      const empty = document.createElement("div");
      empty.className = "calendar-day muted";
      empty.textContent = "";
      daysContainer.appendChild(empty);
    }

    // Actual days
    for (let day = 1; day <= lastDayOfMonth; day++) {
      const date = new Date(year, month, day);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "calendar-day";
      btn.textContent = String(day);

      // highlight today
      if (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        day === today.getDate()
      ) {
        btn.classList.add("today");
      }

      // mark selected
      if (
        selectedDate &&
        date.toDateString() === selectedDate.toDateString()
      ) {
        btn.classList.add("selected");
      }

      btn.addEventListener("click", () => {
        selectedDate = date;
        dateInput.value = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
        renderCalendar(); // re-render to refresh selected state
      });

      daysContainer.appendChild(btn);
    }
  }

  prevBtn?.addEventListener("click", () => {
    current.setMonth(current.getMonth() - 1);
    renderCalendar();
  });

  nextBtn?.addEventListener("click", () => {
    current.setMonth(current.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
}

// Fade-in on scroll
function setupFadeIn() {
  const elements = document.querySelectorAll(".fade-in");

  function reveal() {
    const trigger = window.innerHeight * 0.88;

    elements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) {
        el.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", reveal);
  reveal();
}

document.addEventListener("DOMContentLoaded", setupFadeIn);
