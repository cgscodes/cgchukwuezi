// Date picker
flatpickr("#datePicker", {
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
  minDate: "today",
  disableMobile: true
});

// Time picker
flatpickr("#timePicker", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  time_24hr: false,
  minuteIncrement: 15,
  disableMobile: true
});

// Toast and fake form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const toastEl = document.getElementById("successToast");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const toast = new bootstrap.Toast(toastEl, { delay: 2500 });
    toast.show();

    form.reset();
  });
});
