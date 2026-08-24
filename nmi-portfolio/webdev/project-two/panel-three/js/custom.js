// Flatpickr setup
flatpickr("#rsvpDate", {
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
  minDate: "today",
  disableMobile: true
});

flatpickr("#rsvpTime", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "h:i K",
  minuteIncrement: 15,
  disableMobile: true
});

// Toast + fake submit handler
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rsvpForm");
  const toastEl = document.getElementById("rsvpToast");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const toast = new bootstrap.Toast(toastEl, { delay: 2400 });
    toast.show();
    form.reset();
  });
});