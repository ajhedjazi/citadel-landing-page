const internalLinks = document.querySelectorAll('a[href^="#"]');

internalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const applicationForm = document.querySelector(".application-form");
const formStatus = document.querySelector("#form-status");

if (applicationForm && formStatus) {
  applicationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent =
      "Thanks. This placeholder form is ready to connect to your booking or CRM workflow.";
    applicationForm.reset();
  });
}
