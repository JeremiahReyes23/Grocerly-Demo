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
    // Receipt-first inventory: manual entry remains available as a secondary option.
    const inventoryAdd = document.getElementById("btn-inventory-add-trigger");
    if (inventoryAdd) {
      inventoryAdd.innerHTML = '<i class="fas fa-camera" aria-hidden="true"></i> Scan receipt';
      inventoryAdd.setAttribute("title", "Scan or upload a grocery receipt");
      inventoryAdd.addEventListener("click", function (event) {
        // Existing manual-add handler runs on the same button. Block it here in capture phase.
        event.stopImmediatePropagation();
        go("groceries");
        document.getElementById("btn-ocr-scan-trigger")?.focus();
      }, true);
      const actions = inventoryAdd.parentElement;
      const manual = document.createElement("button");
      manual.type = "button";
      manual.className = "btn btn-outline grocerly-manual-add";
      manual.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i> Add manually';
      manual.addEventListener("click", function () {
        document.getElementById("modal-add-grocery")?.classList.add("active");
      });
      actions.appendChild(manual);
    }

    // Product-label photo recognition is an assisted draft, never an unverified inventory update.
    const inventoryPage = document.getElementById("page-inventory");
    if (inventoryPage) {
      const panel = document.createElement("section");
      panel.className = "grocerly-product-panel";
      panel.innerHTML = `
        <div class="grocerly-product-icon"><i class="fas fa-seedling" aria-hidden="true"></i></div>
        <div class="grocerly-product-copy"><h2>Got one item?</h2><p>Take a picture of its label or shelf tag. We'll try to fill in the details for you.</p></div>
        <label class="grocerly-product-button" for="grocerly-product-photo"><i class="fas fa-camera" aria-hidden="true"></i> Photo of item</label>
        <input id="grocerly-product-photo" type="file" accept="image/*" capture="environment" class="grocerly-hidden-input" aria-label="Choose a product label photo">
        <p class="grocerly-product-feedback" id="grocerly-product-feedback" role="status" aria-live="polite"></p>
      `;
      inventoryPage.querySelector(".header-bar")?.insertAdjacentElement("afterend", panel);
      const photo = panel.querySelector("#grocerly-product-photo");
      const feedback = panel.querySelector("#grocerly-product-feedback");
      photo.addEventListener("change", async function () {
        const file = photo.files && photo.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          feedback.textContent = "Please choose a photo.";
          return;
        }
        feedback.textContent = "Reading the label…";
        try {
          if (!window.Tesseract) throw new Error("Photo reading is unavailable right now.");
          const result = await window.Tesseract.recognize(file, "eng");
          const lines = (result.data.text || "").split(/\r?\n/).map(x => x.trim()).filter(Boolean);
          const priceMatches = [...(result.data.text || "").matchAll(/(?:\$\s*)?(\d{1,4}[.,]\d{2})\b/g)];
          const price = priceMatches.length === 1 ? Number(priceMatches[0][1].replace(",", ".")) : null;
          const name = lines.find(x => /[a-zA-Z]{3}/.test(x) && !/^\$?\s*\d/.test(x)) || "";
          if (!name) {
            feedback.textContent = "We couldn't read a product name. Try a clearer photo or add it manually.";
            return;
          }
          document.getElementById("btn-inventory-add-trigger")?.dispatchEvent(new Event("grocerly-manual-open"));
          const modal = document.getElementById("modal-add-grocery");
          modal?.classList.add("active");
          const nameInput = document.getElementById("groc-name");
          const priceInput = document.getElementById("groc-price");
          if (nameInput) nameInput.value = name.slice(0, 100);
          if (priceInput) priceInput.value = price === null ? "" : price.toFixed(2);
          feedback.textContent = price === null
            ? "We found possible label text. Check the name and enter the price before saving."
            : "We found possible label text and a price. Please check both before saving.";
          const notice = modal?.querySelector(".grocerly-photo-notice") || document.createElement("p");
          notice.className = "grocerly-photo-notice";
          notice.textContent = "Photo suggestions can be wrong. Confirm the product, quantity and shelf price before adding.";
          const content = modal?.querySelector(".modal-content");
          if (content && !notice.isConnected) content.prepend(notice);
          nameInput?.focus();
        } catch (err) {
          feedback.textContent = "We couldn't read that photo. Try again or use Add manually.";
        } finally {
          photo.value = "";
        }
      });
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
