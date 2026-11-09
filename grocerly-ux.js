// Grocerly's small UX enhancement layer. Original app.js remains the feature engine.
(function () {
  "use strict";
  function ready() {
    const more = document.getElementById("grocerly-more-toggle");
    const menu = document.getElementById("grocerly-more-menu");
    const nav = document.getElementById("app-bottom-nav");
    function closeMenu() {
      if (!menu || !more) return;
      menu.hidden = true;
      more.setAttribute("aria-expanded", "false");
    }
    if (more && menu) {
      more.addEventListener("click", function () {
        menu.hidden = !menu.hidden;
        more.setAttribute("aria-expanded", String(!menu.hidden));
      });
      document.addEventListener("click", function (event) {
        if (!event.target.closest(".nav-more-wrap")) closeMenu();
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMenu();
      });
    }

    const allowed = new Set(["dashboard", "meals", "inventory", "groceries", "analytics", "profile"]);
    function go(tab) {
      if (!allowed.has(tab) || typeof transitionToPage !== "function") return;
      State.activeTab = tab;
      if (nav) nav.querySelectorAll(".nav-item").forEach(function (item) {
        item.classList.toggle("active", item.dataset.tab === tab);
      });
      transitionToPage("page-" + tab);
      if (tab === "dashboard") refreshDashboard();
      if (tab === "meals") refreshRecipesList();
      if (tab === "inventory") refreshInventoryList();
      if (tab === "groceries") refreshPurchasesFolders();
      if (tab === "analytics") renderAnalyticsCharts();
      if (tab === "profile") refreshProfileCard();
      closeMenu();
    }

    document.querySelectorAll("[data-grocerly-page]").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        go(btn.dataset.grocerlyPage);
      });
    });
    if (nav) nav.querySelectorAll(".nav-item").forEach(function (item) {
      item.addEventListener("click", closeMenu);
    });
    // Preserve existing calendar functions, but put the calendar on the planning page.
    const calendar = document.querySelector("#page-dashboard .weekly-calendar-section");
    const meals = document.getElementById("page-meals");
    if (calendar && meals) {
      const details = document.createElement("details");
      details.className = "grocerly-calendar-details";
      const summary = document.createElement("summary");
      summary.textContent = "Weekly meal calendar";
      details.append(summary, calendar);
      const header = meals.querySelector(".header-bar");
      if (header) header.insertAdjacentElement("afterend", details);
      else meals.prepend(details);
    }
    const scanner = document.getElementById("btn-ocr-scan-trigger");
    if (scanner) scanner.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        scanner.click();
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
