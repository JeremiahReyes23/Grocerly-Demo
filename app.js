// Grocerly Main Application Logic Core

// ----------------------------------------------------
// 1. APPLICATION STATE
// ----------------------------------------------------
const State = {
  user: {
    name: "Jane Doe",
    email: "jane.doe@gmail.com",
    householdSize: 2,
    location: "Philadelphia, PA",
    age: 29,
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a0aec0"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
    goals: [],
    budgetAmount: 300,
    budgetPeriod: "monthly",
    desiredStorageWeeks: 2,
    healthyEatingFoods: [],
    mealPlanningFreq: 5,
    macroGoals: { calories: 2000, protein: 120, carbs: 200, fat: 70 },
    isPremium: false,
    lastAiUseDate: null
  },
  customStores: [],
  inventoryPctSort: null,
  inventory: [
    {
      id: "inv_1",
      name: "Organic Chicken Breast",
      category: "Meat & Poultry",
      originalQty: 4,
      currentQty: 4,
      unit: "pcs",
      price: 18.50,
      store: "Costco",
      purchaseDate: "2026-06-28",
      expiryDate: "2026-07-01", // Expiring in 2 days
      storageLoc: "Fridge",
      timesUsed: 0,
      costPerUnit: 4.63,
      notes: "Keep in original airtight wrap"
    },
    {
      id: "inv_2",
      name: "Whole Milk 1gal",
      category: "Dairy & Eggs",
      originalQty: 1,
      currentQty: 1,
      unit: "gal",
      price: 4.50,
      store: "Costco",
      purchaseDate: "2026-06-27",
      expiryDate: "2026-06-30", // Expiring in 1 day
      storageLoc: "Fridge",
      timesUsed: 0,
      costPerUnit: 4.50,
      notes: "Keep at back of fridge"
    },
    {
      id: "inv_3",
      name: "Avocados",
      category: "Produce",
      originalQty: 6,
      currentQty: 5,
      unit: "pcs",
      price: 6.00,
      store: "Costco",
      purchaseDate: "2026-06-27",
      expiryDate: "2026-07-04",
      storageLoc: "Fridge",
      timesUsed: 1,
      costPerUnit: 1.00,
      notes: "Move to counter if too hard"
    },
    {
      id: "inv_4",
      name: "Organic Spinach",
      category: "Produce",
      originalQty: 1,
      currentQty: 1,
      unit: "bag",
      price: 5.00,
      store: "Costco",
      purchaseDate: "2026-06-28",
      expiryDate: "2026-07-02",
      storageLoc: "Fridge",
      timesUsed: 0,
      costPerUnit: 5.00,
      notes: "Put paper towel inside bag to absorb moisture"
    },
    {
      id: "inv_5",
      name: "Brown Jasmine Rice",
      category: "Pantry",
      originalQty: 5,
      currentQty: 5,
      unit: "lbs",
      price: 9.50,
      store: "Trader Joe's",
      purchaseDate: "2026-06-15",
      expiryDate: "2027-06-15",
      storageLoc: "Pantry",
      timesUsed: 1,
      costPerUnit: 1.90,
      notes: "In airtight container"
    }
  ],
  recipes: [
    {
      id: "rec_1",
      name: "Avocado Toast with Egg",
      description: "Fast, nutrient-dense breakfast with fresh healthy fats.",
      ingredients: [
        { name: "Avocados", qty: 1, unit: "pcs" },
        { name: "Organic Eggs", qty: 2, unit: "pcs" },
        { name: "Wheat Bread", qty: 2, unit: "pcs" }
      ],
      instructions: "Toast the bread. Mash the avocado with a pinch of salt and lime juice. Fry the eggs in a pan. Spread avocado on toast, top with cooked eggs and chili flakes.",
      nutrition: { calories: 410, protein: 18, fat: 22, carbs: 32 }
    },
    {
      id: "rec_2",
      name: "Grilled Chicken & Rice Bowl",
      description: "Lean high-protein meal prep classic.",
      ingredients: [
        { name: "Organic Chicken Breast", qty: 1, unit: "pcs" },
        { name: "Brown Jasmine Rice", qty: 1, unit: "lbs" },
        { name: "Organic Spinach", qty: 0.25, unit: "bag" }
      ],
      instructions: "Season chicken with garlic powder, paprika, salt, and pepper. Grill chicken for 6 minutes each side. Cook rice according to package. Serve chicken sliced over rice with fresh spinach.",
      nutrition: { calories: 580, protein: 44, fat: 8, carbs: 76 }
    },
    {
      id: "rec_3",
      name: "Creamy Garlic Spinach Pasta",
      description: "Simple rich pantry meal with greens.",
      ingredients: [
        { name: "Whole Milk 1gal", qty: 0.1, unit: "gal" },
        { name: "Organic Spinach", qty: 0.5, unit: "bag" },
        { name: "Jasmine Rice", qty: 0.5, unit: "lbs" }
      ],
      instructions: "Cook pasta in salted water. In a pan, sauté garlic, pour milk and reduce. Fold in spinach until wilted. Toss in pasta with parmesan cheese.",
      nutrition: { calories: 490, protein: 16, fat: 12, carbs: 68 }
    }
  ],
  trips: [
    {
      id: "trip_1",
      store: "Costco",
      date: "2026-06-28",
      cost: 34.00,
      items: ["Organic Chicken Breast", "Organic Spinach", "Whole Milk 1gal", "Avocados"],
      wasted: 0,
      mealsMade: 2
    },
    {
      id: "trip_2",
      store: "Trader Joe's",
      date: "2026-06-15",
      cost: 48.50,
      items: ["Brown Jasmine Rice", "Olive Oil", "Ground Beef"],
      wasted: 4.20,
      mealsMade: 5
    }
  ],
  notifications: [
    { id: "notif_1", text: "Whole Milk 1gal expires tomorrow. Suggest: Freeze or bake today.", urgent: true, read: false, actionType: "freeze", actionTarget: "inv_2" },
    { id: "notif_2", text: "Organic Chicken Breast expires in 2 days. Freeze it now to save $18.50.", urgent: true, read: false, actionType: "freeze", actionTarget: "inv_1" },
    { id: "notif_3", text: "Predictive shopping: Olive Oil is likely running low next week.", urgent: false, read: false }
  ],
  wasteLogs: [
    { id: "w_1", name: "Strawberries 1lb", qty: 1, unit: "box", cost: 4.50, action: "Spoiled", date: "2026-06-20" },
    { id: "w_2", name: "Wheat Bread", qty: 0.5, unit: "box", cost: 1.50, action: "Spoiled", date: "2026-06-24" }
  ],
  activeTab: "dashboard",
  firstLaunch: true,
  calendar: {}
};

// ----------------------------------------------------
// 2. CONFIG DATA & DICTIONARIES
// ----------------------------------------------------
const GOALS_PRESETS = [
  { id: "goal_budget", title: "Stay within grocery budget", icon: "fa-wallet" },
  { id: "goal_healthy", title: "Eat healthier", icon: "fa-heart-pulse" },
  { id: "goal_planning", title: "Meal planning", icon: "fa-calendar-days" },
  { id: "goal_waste", title: "Reduce food waste", icon: "fa-trash-can-slash" },
  { id: "goal_preservation", title: "Food preservation", icon: "fa-snowflake" },
  { id: "goal_inventory", title: "Inventory tracking", icon: "fa-boxes-stacked" },
  { id: "goal_organization", title: "Grocery organization", icon: "fa-folder-open" },
  { id: "goal_calories", title: "Track calories", icon: "fa-calculator" },
  { id: "goal_protein", title: "Track protein", icon: "fa-egg" },
  { id: "goal_carbs", title: "Track carbohydrates", icon: "fa-bread-slice" },
  { id: "goal_fat", title: "Track fat", icon: "fa-oil-can" },
  { id: "goal_longevity", title: "Make groceries last longer", icon: "fa-hourglass-end" },
  { id: "goal_shop_less", title: "Shop less frequently", icon: "fa-clock" },
  { id: "goal_save_money", title: "Save more money", icon: "fa-piggy-bank" },
  { id: "goal_sharing", title: "Family grocery sharing", icon: "fa-users" }
];

const USDA_SHELF_LIFE = {
  "Meat & Poultry": { fridge: 2, freezer: 270 },
  "Dairy & Eggs": { fridge: 7, freezer: 90 },
  "Produce": { fridge: 5, freezer: 180 },
  "Pantry": { fridge: 30, freezer: 365 },
  "Bakery": { fridge: 4, freezer: 120 },
  "Frozen": { fridge: 1, freezer: 365 }
};

const OCR_TEMPLATES = {
  "Costco": {
    store: "Costco Whse #123",
    items: [
      { name: "Organic Chicken Breast", category: "Meat & Poultry", qty: 2, unit: "pcs", price: 16.90 },
      { name: "Organic Eggs 24ct", category: "Dairy & Eggs", qty: 1, unit: "pcs", price: 7.20 },
      { name: "Organic Spinach", category: "Produce", qty: 2, unit: "bag", price: 5.50 },
      { name: "Avocados 6ct", category: "Produce", qty: 1, unit: "pcs", price: 5.99 }
    ]
  },
  "Walmart": {
    store: "Walmart Supercenter",
    items: [
      { name: "Ground Beef 2lbs", category: "Meat & Poultry", qty: 1, unit: "pcs", price: 11.20 },
      { name: "Wheat Bread", category: "Bakery", qty: 2, unit: "pcs", price: 2.60 },
      { name: "Bananas 3lbs", category: "Produce", qty: 1, unit: "lbs", price: 1.89 },
      { name: "Greek Yogurt 32oz", category: "Dairy & Eggs", qty: 1, unit: "pcs", price: 4.80 }
    ]
  },
  "Trader Joe's": {
    store: "Trader Joe's #541",
    items: [
      { name: "Salmon Fillets", category: "Meat & Poultry", qty: 1, unit: "pcs", price: 14.50 },
      { name: "Jasmine Rice 5lbs", category: "Pantry", qty: 1, unit: "pcs", price: 5.99 },
      { name: "Organic Olive Oil", category: "Pantry", qty: 1, unit: "pcs", price: 8.99 },
      { name: "Broccoli Florets", category: "Produce", qty: 2, unit: "bag", price: 2.29 }
    ]
  },
  "Aldi": {
    store: "ALDI Stores Inc",
    items: [
      { name: "Fresh Strawberries", category: "Produce", qty: 2, unit: "box", price: 3.18 },
      { name: "Irish Butter", category: "Dairy & Eggs", qty: 1, unit: "pcs", price: 3.49 },
      { name: "Chicken Tenderloins", category: "Meat & Poultry", qty: 1, unit: "pcs", price: 8.50 },
      { name: "Flour Tortillas", category: "Bakery", qty: 1, unit: "pcs", price: 1.69 }
    ]
  },
  "Target": {
    store: "Target Store #1842",
    items: [
      { name: "Gala Apples 3lbs", category: "Produce", qty: 1, unit: "pcs", price: 3.99 },
      { name: "Instant Oatmeal", category: "Pantry", qty: 1, unit: "box", price: 3.29 },
      { name: "Penne Pasta 1lb", category: "Pantry", qty: 3, unit: "pcs", price: 1.19 },
      { name: "Organic Pasta Sauce", category: "Pantry", qty: 2, unit: "pcs", price: 2.49 }
    ]
  },
  "Whole Foods": {
    store: "Whole Foods Market",
    items: [
      { name: "Organic Chicken Wings", category: "Meat & Poultry", qty: 1, unit: "pcs", price: 12.49 },
      { name: "Organic Blueberries", category: "Produce", qty: 1, unit: "box", price: 4.99 },
      { name: "Unsweetened Almond Milk", category: "Dairy & Eggs", qty: 2, unit: "pcs", price: 3.89 },
      { name: "Red Quinoa 1lb", category: "Pantry", qty: 1, unit: "pcs", price: 5.49 }
    ]
  }
};

// Fraction parsing and formatting utilities
function parseQuantityValue(val) {
  if (typeof val === 'string' && val.includes('/')) {
    const parts = val.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
  }
  return parseFloat(val) || 0;
}

function formatQuantityValue(val, unit) {
  if (unit === 'fraction') {
    const tolerance = 0.01;
    if (Math.abs(val - 1/3) < tolerance) return '1/3';
    if (Math.abs(val - 2/3) < tolerance) return '2/3';
    if (Math.abs(val - 1/2) < tolerance) return '1/2';
    if (Math.abs(val - 1/4) < tolerance) return '1/4';
    if (Math.abs(val - 3/4) < tolerance) return '3/4';
    if (Math.abs(val - 1/5) < tolerance) return '1/5';
    if (Math.abs(val - 2/5) < tolerance) return '2/5';
    if (Math.abs(val - 3/5) < tolerance) return '3/5';
    if (Math.abs(val - 4/5) < tolerance) return '4/5';
    if (Math.abs(val - 1/6) < tolerance) return '1/6';
    if (Math.abs(val - 5/6) < tolerance) return '5/6';
    if (Math.abs(val - 1/8) < tolerance) return '1/8';
    if (Math.abs(val - 3/8) < tolerance) return '3/8';
    if (Math.abs(val - 5/8) < tolerance) return '5/8';
    if (Math.abs(val - 7/8) < tolerance) return '7/8';
  }
  return val;
}

function bindFractionUnitListener(selectId, qtyId) {
  const selectEl = document.getElementById(selectId);
  const qtyEl = document.getElementById(qtyId);
  if (selectEl && qtyEl) {
    const handler = () => {
      if (selectEl.value === 'fraction') {
        qtyEl.type = 'text';
        qtyEl.placeholder = 'e.g. 1/3';
      } else {
        qtyEl.type = 'number';
        qtyEl.placeholder = '';
      }
    };
    selectEl.addEventListener('change', handler);
    // run once to initialize
    handler();
  }
}

function updateInventoryDatalist() {
  let datalist = document.getElementById("inventory-suggestions");
  if (!datalist) {
    datalist = document.createElement("datalist");
    datalist.id = "inventory-suggestions";
    document.body.appendChild(datalist);
  }
  
  const names = new Set();
  if (State && State.inventory) {
    State.inventory.forEach(item => names.add(item.name));
  }
  // Add some standard items
  names.add("Organic Chicken Breast");
  names.add("Ground Beef 2lbs");
  names.add("Wheat Bread");
  names.add("Salmon Fillets");
  names.add("Organic Milk");
  names.add("Organic Eggs");
  names.add("Apples");
  names.add("Bananas");
  names.add("Avocado");
  names.add("Tomato");
  names.add("Spinach");
  names.add("Garlic");
  names.add("Onion");

  datalist.innerHTML = Array.from(names).map(name => `<option value="${name}"></option>`).join('');
}

window.replenishItem = function(id) {
  const item = State.inventory.find(i => i.id === id);
  if (!item) return;
  
  const origExp = new Date(item.expiryDate);
  const origPur = new Date(item.purchaseDate);
  const diffTime = Math.max(0, origExp - origPur);
  
  const todayStr = new Date().toISOString().split('T')[0];
  item.purchaseDate = todayStr;
  
  const newExp = new Date(Date.now() + diffTime);
  item.expiryDate = newExp.toISOString().split('T')[0];
  
  item.currentQty = item.originalQty || item.currentQty;
  
  saveStateToStorage();
  refreshInventoryList();
  refreshDashboard();
  alert(`"${item.name}" has been replenished to 100% and dates updated!`);
};



function populateStoreDropdowns() {
  const standardStores = ["Costco", "Walmart", "Trader Joe's", "Aldi", "Target", "Whole Foods", "Local Market"];
  const customStores = State.customStores || [];
  const allStores = [...new Set([...standardStores, ...customStores])];
  
  const selects = ["groc-store", "edit-groc-store", "done-shopping-store", "man-store-select"];
  selects.forEach(id => {
    const selectEl = document.getElementById(id);
    if (selectEl) {
      const currentValue = selectEl.value;
      selectEl.innerHTML = "";
      allStores.forEach(store => {
        const option = document.createElement("option");
        option.value = store;
        option.textContent = store;
        selectEl.appendChild(option);
      });
      const otherOption = document.createElement("option");
      otherOption.value = "Other";
      otherOption.textContent = "Other";
      selectEl.appendChild(otherOption);
      
      if (currentValue && (allStores.includes(currentValue) || currentValue === "Other")) {
        selectEl.value = currentValue;
      }
    }
  });
}

function recalculateInventoryRemaining() {
  if (!State || !State.inventory) return;

  // Reset all inventory items to 100% (100)
  State.inventory.forEach(item => {
    item.remainingPercent = 100;
  });

  // Collect all scheduled recipes in the Weekly Planner
  const scheduledRecipeIds = [];
  if (State.calendar) {
    Object.keys(State.calendar).forEach(dateKey => {
      const dayMeals = State.calendar[dateKey];
      if (dayMeals) {
        if (dayMeals.Breakfast) scheduledRecipeIds.push(dayMeals.Breakfast);
        if (dayMeals.Lunch) scheduledRecipeIds.push(dayMeals.Lunch);
        if (dayMeals.Dinner) scheduledRecipeIds.push(dayMeals.Dinner);
      }
    });
  }

  // Deduct matching ingredient percentages (FIFO)
  scheduledRecipeIds.forEach(recipeId => {
    const recipe = State.recipes.find(r => r.id === recipeId);
    if (!recipe || !recipe.ingredients) return;

    recipe.ingredients.forEach(ing => {
      // Find matching inventory items, sort by purchaseDate (FIFO)
      const matchingItems = State.inventory
        .filter(item => item.name.toLowerCase().includes(ing.name.toLowerCase()))
        .sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));

      let percentToDeduct = (parseFloat(ing.qty) || 0.5) * 100;

      for (let item of matchingItems) {
        if (percentToDeduct <= 0) break;
        if (item.remainingPercent > 0) {
          if (item.remainingPercent >= percentToDeduct) {
            item.remainingPercent -= percentToDeduct;
            percentToDeduct = 0;
          } else {
            percentToDeduct -= item.remainingPercent;
            item.remainingPercent = 0;
          }
        }
      }
    });
  });

  // Automatically check expiry thresholds and update notifications
  checkAndGenerateExpiryNotifications();
}

function checkAndGenerateExpiryNotifications() {
  if (!State || !State.inventory) return;
  if (!State.notifications) State.notifications = [];

  State.inventory.forEach(item => {
    const daysLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft === 7 || daysLeft === 3 || daysLeft === 0) {
      const notifId = `exp_notif_${item.id}_${daysLeft}`;
      const exists = State.notifications.some(n => n.id === notifId);
      if (!exists) {
        let text = "";
        if (daysLeft === 7) {
          text = `"${item.name}" has 7 Days Left. Plan a meal soon to avoid wasting it!`;
        } else if (daysLeft === 3) {
          text = `"${item.name}" has 3 Days Left! Cook or freeze it before it spoils.`;
        } else {
          text = `"${item.name}" expires today! Use it or log disposition now.`;
        }
        
        State.notifications.push({
          id: notifId,
          text: text,
          urgent: daysLeft <= 3,
          read: false,
          actionType: "freeze",
          actionTarget: item.id
        });
      }
    }
  });

  updateNotificationsBadge();
}

function getUsageProgressBarColor(pct) {
  let hue = 0;
  if (pct >= 70) {
    hue = 90 + ((pct - 70) / 30) * 50; // 90 to 140
  } else if (pct >= 40) {
    hue = 50 + ((pct - 40) / 30) * 40; // 50 to 90
  } else if (pct >= 10) {
    hue = 25 + ((pct - 10) / 30) * 25; // 25 to 50
  } else {
    hue = (pct / 10) * 25; // 0 to 25
  }
  return `hsl(${hue}, 75%, 45%)`;
}

// ----------------------------------------------------
// 3. INITIALIZATION AND ROUTING
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Fraction unit listeners
  bindFractionUnitListener('man-unit', 'man-qty');
  bindFractionUnitListener('groc-unit', 'groc-qty');
  bindFractionUnitListener('edit-groc-unit', 'edit-groc-qty');
  updateInventoryDatalist();

  // Store Other custom input listeners
  const grocStoreSelect = document.getElementById("groc-store");
  const grocStoreOther = document.getElementById("groc-store-other");
  if (grocStoreSelect && grocStoreOther) {
    grocStoreSelect.addEventListener("change", () => {
      if (grocStoreSelect.value === "Other") {
        grocStoreOther.style.display = "block";
      } else {
        grocStoreOther.style.display = "none";
      }
    });
  }

  const editGrocStoreSelect = document.getElementById("edit-groc-store");
  const editGrocStoreOther = document.getElementById("edit-groc-store-other");
  if (editGrocStoreSelect && editGrocStoreOther) {
    editGrocStoreSelect.addEventListener("change", () => {
      if (editGrocStoreSelect.value === "Other") {
        editGrocStoreOther.style.display = "block";
      } else {
        editGrocStoreOther.style.display = "none";
      }
    });
  }

  populateStoreDropdowns();

  // Bind scroll listener for Add Modal scroll arrow
  const addModalContent = document.querySelector('#modal-add-grocery .modal-content');
  const addScrollArrow = document.getElementById('groc-scroll-arrow');
  if (addModalContent && addScrollArrow) {
    addModalContent.addEventListener('scroll', () => {
      const scrollHeight = addModalContent.scrollHeight;
      const scrollTop = addModalContent.scrollTop;
      const clientHeight = addModalContent.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 20) {
        addScrollArrow.style.opacity = '0';
        addScrollArrow.style.transform = 'scale(0.8)';
      } else {
        addScrollArrow.style.opacity = '0.8';
        addScrollArrow.style.transform = 'scale(1)';
      }
    });
  }

  // Sync status bar time
  updateStatusBarTime();
  setInterval(updateStatusBarTime, 1000 * 60);

  // Load state from LocalStorage if available
  loadStateFromStorage();

  // Initialize UI components
  initOnboardingFlow();
  initMainTabs();
  initReceiptScanning();
  initInventoryManagement();
  initMealBuilder();
  initAnalytics();
  initProfileSettings();
  initGlobalSearch();
  initAIAssistant(); // AI Hub initialization
  initPremiumSubscription(); // Premium checkout initialization

  // If already logged in, skip onboarding
  const isLoggedIn = localStorage.getItem("grocerly_logged_in") === "true" || sessionStorage.getItem("grocerly_logged_in") === "true";
  if (isLoggedIn) {
    transitionToPage("page-dashboard");
    document.getElementById("app-bottom-nav").classList.add("active");
    if (State.firstLaunch) {
      showWelcomeTutorial();
    }
  } else {
    // Start splash screen countdown
    setTimeout(() => {
      transitionToPage("page-login");
    }, 2000);
  }

  // Refresh lists
  refreshDashboard();
  refreshInventoryList();
  refreshRecipesList();
  updateNotificationsBadge();
});

function updateStatusBarTime() {
  const timeEl = document.getElementById("status-time");
  if (timeEl) {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    timeEl.textContent = `${hours}:${minutes}`;
  }
}

function transitionToPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add("active");
    // Close global search if switching pages
    document.getElementById("global-search-container").classList.remove("active");
  }

  // Dynamically show/hide bottom navigation based on the page
  const mainTabs = ["page-dashboard", "page-groceries", "page-meals", "page-inventory", "page-analytics", "page-profile"];
  const bottomNav = document.getElementById("app-bottom-nav");
  if (bottomNav) {
    if (mainTabs.includes(pageId)) {
      bottomNav.classList.add("active");
    } else {
      bottomNav.classList.remove("active");
    }
  }
}

// ----------------------------------------------------
// 4. ONBOARDING & AUTHENTICATION FLOW
// ----------------------------------------------------
let dynamicQuestionsQueue = [];
let currentQuestionIndex = 0;

function initOnboardingFlow() {
  // Login Actions
  document.getElementById("btn-login-signin").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-password").value;
    const keepSigned = document.getElementById("login-keep-signed-in").checked;
    if (!email || !pass) {
      alert("Please fill in email and password.");
      return;
    }

    try {
      const response = await ClientAPI.request('/api/auth/login', 'POST', { email, password: pass });
      // Apply profile data
      State.user = response.profile;
      State.inventory = response.inventory;
      State.recipes = response.recipes;
      State.trips = response.trips;
      State.notifications = response.notifications;
      State.wasteLogs = response.wasteLogs;
      
      if (keepSigned) {
        localStorage.setItem("grocerly_logged_in", "true");
      } else {
        sessionStorage.setItem("grocerly_logged_in", "true");
      }
      saveStateToStorage();
      alert("Welcome! We've sent a welcome email to your inbox.");
      transitionToPage("page-dashboard");
      document.getElementById("app-bottom-nav").classList.add("active");
    } catch (err) {
      console.warn("API Login failed, checking localStorage fallback:", err);
      // Fallback local auth simulation
      if (email === State.user.email) {
        if (keepSigned) {
          localStorage.setItem("grocerly_logged_in", "true");
        } else {
          sessionStorage.setItem("grocerly_logged_in", "true");
        }
        alert("Welcome! We've sent a welcome email to your inbox.");
        transitionToPage("page-dashboard");
        document.getElementById("app-bottom-nav").classList.add("active");
      } else {
        alert("Authentication failed: " + err.message);
      }
    }
  });

  // Social login simulation
  const handleSocialLogin = (provider) => {
    const modal = document.getElementById("modal-social-login");
    const listContainer = document.getElementById("social-accounts-list");
    const keepSigned = document.getElementById("login-keep-signed-in").checked;

    // Clear previous input
    document.getElementById("social-login-custom-email").value = "";

    // Mock accounts
    const mockAccounts = [
      { name: "Jane Doe", email: "jane.doe@gmail.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
      { name: "Alex Mercer", email: "alex.mercer@gmail.com", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" },
      { name: "Guest Chef", email: "guest@grocerly.app", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100" }
    ];

    listContainer.innerHTML = "";
    mockAccounts.forEach(acc => {
      const row = document.createElement("div");
      row.className = "social-account-select-row";
      row.innerHTML = `
        <div class="social-account-avatar-wrapper">
          <img src="${acc.avatar}" alt="${acc.name}">
        </div>
        <div class="social-account-details">
          <span class="social-account-fullname">${acc.name}</span>
          <span class="social-account-emailaddress">${acc.email}</span>
        </div>
      `;
      row.onclick = () => {
        executeSocialLogin(acc.email, acc.name, acc.avatar, keepSigned);
      };
      listContainer.appendChild(row);
    });

    modal.classList.add("active");
  };

  const executeSocialLogin = async (email, name, avatar, keepSigned, password = "oauth-apple-login") => {
    try {
      const response = await ClientAPI.request('/api/auth/login', 'POST', { email, password });
      State.user = response.profile;
      State.inventory = response.inventory;
      State.recipes = response.recipes;
      State.trips = response.trips;
      State.notifications = response.notifications;
      State.wasteLogs = response.wasteLogs;
    } catch (err) {
      console.warn("API Login failed, attempting signup:", err);
      try {
        const response = await ClientAPI.request('/api/auth/signup', 'POST', { email, password });
        State.user = response.profile;
        State.user.name = name || State.user.name;
        if (avatar) State.user.avatar = avatar;
      } catch (signupErr) {
        console.error("API Signup failed:", signupErr);
        // Fallback for mocked Apple login
        State.user.name = name || "New Chef";
        State.user.email = email;
        State.user.avatar = avatar || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a0aec0"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
      }
    }
    if (keepSigned) {
      localStorage.setItem("grocerly_logged_in", "true");
    } else {
      sessionStorage.setItem("grocerly_logged_in", "true");
    }
    saveStateToStorage();
    document.getElementById("modal-social-login").classList.remove("active");
    refreshProfileCard();
    refreshDashboard();
    transitionToPage("page-dashboard");
  };

  const handleGoogleResponse = async (response) => {
    try {
      const apiResponse = await ClientAPI.request('/api/auth/google', 'POST', { credential: response.credential });
      State.user = apiResponse.profile;
      State.inventory = apiResponse.inventory || [];
      State.recipes = apiResponse.recipes || [];
      State.trips = apiResponse.trips || [];
      State.notifications = apiResponse.notifications || [];
      State.wasteLogs = apiResponse.wasteLogs || [];
      
      const keepSigned = document.getElementById("login-keep-signed-in").checked;
      if (keepSigned) {
        localStorage.setItem("grocerly_logged_in", "true");
      } else {
        sessionStorage.setItem("grocerly_logged_in", "true");
      }
      
      saveStateToStorage();
      refreshProfileCard();
      refreshDashboard();
      
      if (!State.user.goals || State.user.goals.length === 0) {
        transitionToPage("page-profile-setup");
      } else {
        transitionToPage("page-dashboard");
      }
    } catch (err) {
      console.error("Google Auth Integration failed:", err);
      alert("Failed to sign in with Google.");
    }
  };

  // Initialize Google Identity Services (Wait for API to load if async)
  window.onload = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: "721951712629-f4i7m3j2vk4bkana2vjbap26res637g3.apps.googleusercontent.com",
        callback: handleGoogleResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById("btn-login-google-container"),
        { theme: "outline", size: "large", type: "standard" }
      );
    }
  };


  
  document.getElementById("btn-social-login-close").onclick = () => {
    document.getElementById("modal-social-login").classList.remove("active");
  };

  document.getElementById("btn-social-login-submit").onclick = () => {
    const customEmail = document.getElementById("social-login-custom-email").value.trim();
    if (!customEmail || !customEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    const name = customEmail.split("@")[0];
    const keepSigned = document.getElementById("login-keep-signed-in").checked;
    executeSocialLogin(customEmail, name.charAt(0).toUpperCase() + name.slice(1), "", keepSigned);
  };

  // Enter key press triggers sign in
  const loginInputs = [document.getElementById("login-email"), document.getElementById("login-password")];
  loginInputs.forEach(input => {
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          document.getElementById("btn-login-signin").click();
        }
      });
    }
  });

  // Enter key press triggers registration
  const registerInputs = [
    document.getElementById("reg-name"),
    document.getElementById("reg-email"),
    document.getElementById("reg-password"),
    document.getElementById("reg-password-confirm")
  ];
  registerInputs.forEach(input => {
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          document.getElementById("btn-register-signup").click();
        }
      });
    }
  });

  const btnGotoRegister = document.getElementById("btn-login-goto-register");
  if (btnGotoRegister) {
    btnGotoRegister.addEventListener("click", () => {
      transitionToPage("page-register");
    });
  }

  document.getElementById("btn-login-forgot").addEventListener("click", () => {
    alert("Password reset instructions sent to registered email.");
  });

  // Register Actions
  document.getElementById("btn-register-signup").addEventListener("click", async () => {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const pass = document.getElementById("reg-password").value;
    const passConfirm = document.getElementById("reg-password-confirm").value;
    
    if (!name || !email || !pass) {
      alert("Please fill in all fields.");
      return;
    }
    if (pass !== passConfirm) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await ClientAPI.request('/api/auth/signup', 'POST', { email, password: pass });
      State.user = response.profile;
      State.user.name = name;
      localStorage.setItem("grocerly_logged_in", "true");
      saveStateToStorage();
      alert("Welcome to Grocerly! We've sent a welcome email to your inbox.");
      transitionToPage("page-profile-setup");
    } catch (err) {
      console.warn("API Signup failed, running local registration fallback:", err);
      State.user.email = email;
      State.user.name = name;
      localStorage.setItem("grocerly_logged_in", "true");
      saveStateToStorage();
      transitionToPage("page-profile-setup");
    }
  });

  document.getElementById("btn-register-back-login").addEventListener("click", () => {
    transitionToPage("page-login");
  });

  // Initial trigger for profile setup image
  const renderAvatarPreview = () => {
    const mainAvatar = document.getElementById("profile-avatar-select");
    if (State.user.avatar.startsWith("data:image/svg+xml")) {
      mainAvatar.innerHTML = `${State.user.avatar.replace("data:image/svg+xml;utf8,", "")}`;
    } else {
      mainAvatar.innerHTML = `<img src="${State.user.avatar}" alt="Profile avatar">`;
    }
  };
  renderAvatarPreview();

  // Onboarding File Upload for custom photo
  const avatarSelect = document.getElementById("profile-avatar-select");
  const avatarUpload = document.getElementById("profile-avatar-upload");
  if (avatarSelect && avatarUpload) {
    avatarSelect.addEventListener("click", () => avatarUpload.click());
    avatarUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          State.user.avatar = base64;
          avatarSelect.innerHTML = `<img src="${base64}" alt="Profile avatar">`;
          saveStateToStorage();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  document.getElementById("btn-profile-next").addEventListener("click", () => {
    const name = document.getElementById("profile-name").value;
    const email = document.getElementById("profile-email-setup") ? document.getElementById("profile-email-setup").value : "";
    const household = parseInt(document.getElementById("profile-household").value) || 2;
    const location = document.getElementById("profile-location").value;
    const age = parseInt(document.getElementById("profile-age").value) || null;

    State.user.name = name;
    if (email) State.user.email = email;
    State.user.householdSize = household;
    State.user.location = location;
    State.user.age = age;

    // Render Goals setup page
    renderGoalsSetup();
    transitionToPage("page-goals");
  });

  // Goals setup actions
  document.getElementById("btn-goals-next").addEventListener("click", () => {
    // Compile goals
    const selected = [];
    document.querySelectorAll(".selection-card.selected").forEach(card => {
      selected.push(card.dataset.id);
    });
    State.user.goals = selected;

    if (selected.length === 0) {
      alert("Please select at least one goal to help customize your dashboard!");
      return;
    }

    // Build dynamic questions queue
    buildDynamicQuestions(selected);
    
    if (dynamicQuestionsQueue.length > 0) {
      currentQuestionIndex = 0;
      renderDynamicQuestion(0);
      transitionToPage("page-dynamic-questions");
    } else {
      transitionToPage("page-congrats");
    }
  });
}

function renderGoalsSetup() {
  const container = document.getElementById("goals-list-container");
  container.innerHTML = "";
  GOALS_PRESETS.forEach(goal => {
    const card = document.createElement("div");
    card.className = "selection-card";
    card.dataset.id = goal.id;
    card.innerHTML = `
      <div class="selection-card-icon"><i class="fas ${goal.icon}"></i></div>
      <div class="selection-card-title">${goal.title}</div>
    `;
    card.addEventListener("click", () => {
      card.classList.toggle("selected");
    });
    container.appendChild(card);
  });
}

function buildDynamicQuestions(selectedGoals) {
  dynamicQuestionsQueue = [];
  
  // 1. Budget Question
  if (selectedGoals.includes("goal_budget") || selectedGoals.includes("goal_save_money")) {
    dynamicQuestionsQueue.push({
      type: "budget",
      title: "Grocery Budgeting",
      question: "What is your grocery budget?",
      render: () => `
        <p>Set limits to help our smart tracking optimize your checkout trips.</p>
        <div class="form-group" style="margin-top: 15px;">
          <label>Budget Period</label>
          <div class="options-grid" style="grid-template-columns: repeat(3, 1fr);" id="q-budget-period">
            <div class="grid-option" data-val="weekly">Weekly</div>
            <div class="grid-option" data-val="biweekly">Biweekly</div>
            <div class="grid-option selected" data-val="monthly">Monthly</div>
          </div>
        </div>
        <div class="form-group">
          <label>Dollar Limit Amount</label>
          <div class="input-with-label">
            <span>$</span>
            <input type="number" id="q-budget-val" class="form-control" value="300" min="1">
          </div>
        </div>
      `,
      save: () => {
        const period = document.querySelector("#q-budget-period .grid-option.selected").dataset.val;
        const val = parseFloat(document.getElementById("q-budget-val").value) || 300;
        State.user.budgetPeriod = period;
        State.user.budgetAmount = val;
      }
    });
  }

  // 2. Healthy Eating Question
  if (selectedGoals.includes("goal_healthy")) {
    dynamicQuestionsQueue.push({
      type: "healthy",
      title: "Healthy Eating Options",
      question: "What foods would you like to eat more often?",
      render: () => `
        <p>Choose targets. We will highlight recipes that support these healthy foods.</p>
        <div class="options-grid" style="grid-template-columns: 1fr 1fr; margin-top: 15px;" id="q-healthy-grid">
          <div class="grid-option" data-val="Vegetables">Vegetables</div>
          <div class="grid-option" data-val="Fruit">Fruit</div>
          <div class="grid-option" data-val="Lean Meats">Lean meats</div>
          <div class="grid-option" data-val="Whole Grains">Whole grains</div>
          <div class="grid-option" data-val="Fish">Fish</div>
          <div class="grid-option" data-val="Healthy Fats">Healthy fats</div>
        </div>
      `,
      save: () => {
        const selected = [];
        document.querySelectorAll("#q-healthy-grid .grid-option.selected").forEach(opt => {
          selected.push(opt.dataset.val);
        });
        State.user.healthyEatingFoods = selected;
      }
    });
  }

  // 3. Food Preservation Lifespan
  if (selectedGoals.includes("goal_preservation") || selectedGoals.includes("goal_longevity")) {
    dynamicQuestionsQueue.push({
      type: "preservation",
      title: "Food Preservation",
      question: "How long would you like your groceries to last?",
      render: () => `
        <p>We'll optimize freezing reminders and storage tips to hit this target.</p>
        <div class="options-grid" style="grid-template-columns: 1fr 1fr; margin-top: 15px;" id="q-preserve-grid">
          <div class="grid-option" data-val="1">1 week</div>
          <div class="grid-option selected" data-val="2">2 weeks</div>
          <div class="grid-option" data-val="3">3 weeks</div>
          <div class="grid-option" data-val="4">1 month</div>
        </div>
      `,
      save: () => {
        const val = parseInt(document.querySelector("#q-preserve-grid .grid-option.selected").dataset.val) || 2;
        State.user.desiredStorageWeeks = val;
      }
    });
  }

  // 4. Meal Planning Frequency
  if (selectedGoals.includes("goal_planning")) {
    dynamicQuestionsQueue.push({
      type: "planning",
      title: "Meal Planner",
      question: "How many meals per week do you plan to cook?",
      render: () => `
        <p>Helps coordinate grocery list sizes to avoid leftovers waste.</p>
        <div class="form-group" style="margin-top: 15px;">
          <input type="range" id="q-planning-slider" min="1" max="21" value="5" oninput="document.getElementById('planning-cnt').innerText = this.value">
          <div style="text-align: center; font-weight: 700; font-size: 16px; margin-top: 10px;">
            <span id="planning-cnt">5</span> Cooked Meals / Week
          </div>
        </div>
      `,
      save: () => {
        const val = parseInt(document.getElementById("q-planning-slider").value) || 5;
        State.user.mealPlanningFreq = val;
      }
    });
  }

  // 5. Macro Nutrition Goal (Calories/Protein/Carbs/Fat)
  if (selectedGoals.includes("goal_calories") || selectedGoals.includes("goal_protein") || selectedGoals.includes("goal_carbs") || selectedGoals.includes("goal_fat")) {
    dynamicQuestionsQueue.push({
      type: "nutrition",
      title: "Macro-Nutrition Target",
      question: "Set daily nutrient requirements:",
      render: () => `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
          <div class="form-group">
            <label>Calories (kcal)</label>
            <input type="number" id="q-nutri-cal" class="form-control" value="2000">
          </div>
          <div class="form-group">
            <label>Protein (grams)</label>
            <input type="number" id="q-nutri-prot" class="form-control" value="120">
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label>Carbohydrates (g)</label>
            <input type="number" id="q-nutri-carb" class="form-control" value="200">
          </div>
          <div class="form-group">
            <label>Fat (grams)</label>
            <input type="number" id="q-nutri-fat" class="form-control" value="70">
          </div>
        </div>
      `,
      save: () => {
        State.user.macroGoals.calories = parseInt(document.getElementById("q-nutri-cal").value) || 2000;
        State.user.macroGoals.protein = parseInt(document.getElementById("q-nutri-prot").value) || 120;
        State.user.macroGoals.carbs = parseInt(document.getElementById("q-nutri-carb").value) || 200;
        State.user.macroGoals.fat = parseInt(document.getElementById("q-nutri-fat").value) || 70;
      }
    });
  }
}

function renderDynamicQuestion(index) {
  const container = document.getElementById("dynamic-questions-container");
  const qData = dynamicQuestionsQueue[index];
  
  // Update progress bar
  const progressPercent = ((index) / dynamicQuestionsQueue.length) * 100;
  document.getElementById("dynamic-progress-bar").style.width = `${progressPercent}%`;

  container.innerHTML = `
    <div style="font-size: 11px; font-weight: 700; color: var(--primary-green); text-transform: uppercase;">${qData.title}</div>
    <h1 style="font-size: 22px; margin-bottom: 10px;">${qData.question}</h1>
    <div id="dynamic-q-options">${qData.render()}</div>
  `;

  // Attach event click toggles for options inside questions
  const gridOpts = container.querySelectorAll(".options-grid .grid-option");
  gridOpts.forEach(opt => {
    opt.addEventListener("click", () => {
      // If it's a multi select (e.g. healthy eating), toggle
      if (qData.type === "healthy") {
        opt.classList.toggle("selected");
      } else {
        // Single select (e.g. budget period, preservation days)
        gridOpts.forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
      }
    });
  });

  // Navigation button binds
  const nextBtn = document.getElementById("btn-dynamic-next");
  const backBtn = document.getElementById("btn-dynamic-back");

  nextBtn.onclick = () => {
    // Save answer
    qData.save();

    if (currentQuestionIndex < dynamicQuestionsQueue.length - 1) {
      currentQuestionIndex++;
      renderDynamicQuestion(currentQuestionIndex);
    } else {
      document.getElementById("dynamic-progress-bar").style.width = "100%";
      saveStateToStorage();
      // Setup Congratulations Page details
      document.getElementById("congrats-summary").innerText = `Your profile is complete! Based on your goals, we've set a daily macro target of ${State.user.macroGoals.calories} kcal, and a ${State.user.budgetPeriod} grocery budget of $${State.user.budgetAmount}.`;
      transitionToPage("page-congrats");
    }
  };

  backBtn.onclick = () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderDynamicQuestion(currentQuestionIndex);
    } else {
      transitionToPage("page-goals");
    }
  };
}

// Congrats Finish binds
document.getElementById("btn-congrats-finish").addEventListener("click", () => {
  transitionToPage("page-dashboard");
  document.getElementById("app-bottom-nav").classList.add("active");
  
  saveStateToStorage();
  refreshDashboard();
  
  if (State.firstLaunch) {
    showWelcomeTutorial();
  }
});

// Welcome Tutorial slider
function showWelcomeTutorial() {
  const modal = document.getElementById("modal-welcome");
  modal.classList.add("active");
  
  let currentSlide = 0;
  const slides = modal.querySelectorAll(".tutorial-slide");
  const dots = modal.querySelectorAll(".dot");
  const nextBtn = document.getElementById("btn-tutorial-next");
  const skipBtn = document.getElementById("btn-tutorial-skip");
  const closeBtn = document.getElementById("btn-close-welcome");

  function showSlide(idx) {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    
    slides[idx].classList.add("active");
    dots[idx].classList.add("active");
    
    if (idx === slides.length - 1) {
      nextBtn.textContent = "Start Tracking";
    } else {
      nextBtn.textContent = "Next Tip";
    }
  }

  nextBtn.onclick = () => {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      showSlide(currentSlide);
    } else {
      modal.classList.remove("active");
      State.firstLaunch = false;
      saveStateToStorage();
    }
  };

  const dismiss = () => {
    modal.classList.remove("active");
    State.firstLaunch = false;
    saveStateToStorage();
  };

  skipBtn.onclick = dismiss;
  closeBtn.onclick = dismiss;

  dots.forEach((dot, idx) => {
    dot.onclick = () => {
      currentSlide = idx;
      showSlide(idx);
    };
  });
}

// ----------------------------------------------------
// 5. MAIN NAVIGATION TABS
// ----------------------------------------------------
function initMainTabs() {
  document.querySelectorAll("#app-bottom-nav .nav-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = item.dataset.tab;
      State.activeTab = tab;
      
      document.querySelectorAll("#app-bottom-nav .nav-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      
      transitionToPage(`page-${tab}`);

      // Refresh corresponding screens when loaded
      if (tab === "dashboard") refreshDashboard();
      if (tab === "groceries") refreshPurchasesFolders();
      if (tab === "inventory") refreshInventoryList();
      if (tab === "meals") refreshRecipesList();
      if (tab === "analytics") renderAnalyticsCharts();
      if (tab === "profile") refreshProfileCard();
    });
  });
}

// ----------------------------------------------------
// 6. HOME DASHBOARD REFRESH
// ----------------------------------------------------
function refreshDashboard() {
  recalculateInventoryRemaining();
  // Update welcome greeting
  const firstName = State.user.name.split(" ")[0];
  const welcomeText = document.getElementById("dash-welcome-text");
  if (welcomeText) welcomeText.innerText = `Welcome, ${firstName}`;
  
  const avatarImg = document.getElementById("dash-avatar-img");
  if (avatarImg) avatarImg.src = State.user.avatar;

  // Render active goals in a 2x2 grid
  const goalsGrid = document.getElementById("dash-goals-grid");
  if (goalsGrid) {
    goalsGrid.innerHTML = "";
    let activeGoalIds = State.user.goals || [];
    let activeGoals = GOALS_PRESETS.filter(g => activeGoalIds.includes(g.id));
    if (activeGoals.length < 4) {
      const remaining = 4 - activeGoals.length;
      const unselected = GOALS_PRESETS.filter(g => !activeGoalIds.includes(g.id));
      for (let i = 0; i < Math.min(remaining, unselected.length); i++) {
        activeGoals.push({ ...unselected[i], isRecommendation: true });
      }
    }
    activeGoals.slice(0, 4).forEach(goal => {
      const card = document.createElement("div");
      card.className = "goal-grid-card";
      if (goal.isRecommendation) {
        card.style.opacity = "0.7";
        card.style.borderStyle = "dashed";
      }
      card.innerHTML = `
        <div class="goal-grid-card-icon" style="${goal.isRecommendation ? 'background: var(--border-color); color: var(--text-secondary);' : ''}">
          <i class="fas ${goal.icon}"></i>
        </div>
        <div class="goal-grid-card-title">${goal.title}${goal.isRecommendation ? ' <span style="font-size: 9px; font-weight: 500; color: var(--primary-green); font-style: italic;">(Suggested)</span>' : ''}</div>
      `;
      card.onclick = () => {
        document.querySelector("[data-tab='profile']").click();
        setTimeout(() => {
          const editBtn = document.getElementById("btn-profile-edit-goals");
          if (editBtn) editBtn.click();
        }, 100);
      };
      goalsGrid.appendChild(card);
    });
  }

  // Check if we use "Starting Estimate"
  const isEstimate = State.trips.length < 3;
  const estLabel = isEstimate ? " <span style='font-size: 10px; color: var(--text-secondary); font-weight: normal; text-transform: none; display: block; margin-top: 2px;'>(Starting Estimate)</span>" : "";

  // 1. Budget Stats
  const totalSpend = State.inventory.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const remainingBudget = State.user.budgetAmount - totalSpend;
  
  const budgetRemEl = document.getElementById("stat-budget-rem");
  const budgetProgEl = document.getElementById("stat-budget-prog");
  if (budgetRemEl) budgetRemEl.innerHTML = `$${remainingBudget.toFixed(2)}`;
  if (budgetProgEl) budgetProgEl.innerHTML = `Spent: <span style="color: var(--accent-orange); font-weight: 700;">-$${totalSpend.toFixed(2)}</span> of $${State.user.budgetAmount}`;
  
  const budgetCard = document.getElementById("card-stat-budget");
  if (budgetCard) {
    if (remainingBudget < 0) {
      budgetCard.classList.remove("green-alert");
      budgetCard.classList.add("orange-alert");
      if (budgetRemEl) budgetRemEl.style.color = "var(--accent-orange)";
    } else {
      budgetCard.classList.remove("orange-alert");
      budgetCard.classList.add("green-alert");
      if (budgetRemEl) budgetRemEl.style.color = "var(--primary-green)";
    }
  }

  // 2. Savings Projected
  const monthlySavings = (State.user.budgetAmount * 0.15);
  const savingsValEl = document.getElementById("stat-savings-val");
  if (savingsValEl) savingsValEl.innerHTML = `$${monthlySavings.toFixed(2)}${estLabel}`;

  // 3. Grocery Lifespan
  const durationValEl = document.getElementById("stat-duration-val");
  if (durationValEl) durationValEl.innerHTML = `${State.user.desiredStorageWeeks * 7} days${estLabel}`;

  // 4. Food Waste
  const totalWastedVal = State.wasteLogs.reduce((acc, w) => acc + w.cost, 0);
  const totalBoughtVal = totalSpend + totalWastedVal;
  const wastePercent = totalBoughtVal > 0 ? (totalWastedVal / totalBoughtVal) * 100 : 0;
  
  const wasteValEl = document.getElementById("stat-waste-val");
  const wastePctEl = document.getElementById("stat-waste-pct");
  if (wasteValEl) wasteValEl.innerHTML = `$${totalWastedVal.toFixed(2)}${estLabel}`;
  if (wastePctEl) wastePctEl.innerText = `${wastePercent.toFixed(1)}% of total bought`;

  // Render the Dropdown Inventory Table
  renderDashboardGroceryList();

  // Render the Actionable Needs List
  renderActionableNeeds();

  // Render the Weekly Meal Planner Calendar
  renderMealPlanningCalendar();

  // Dashboard notifications badge check
  updateNotificationsBadge();
}

function renderDashboardGroceryList() {
  const tbody = document.getElementById("dash-grocery-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (State.inventory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:15px; color:var(--text-secondary);">No ingredients in inventory. Add some in Purchases!</td></tr>`;
    return;
  }

  // Bind the Meals button
  const goMealsBtn = document.getElementById("btn-dash-go-meals");
  if (goMealsBtn) {
    goMealsBtn.onclick = () => {
      document.querySelector("[data-tab='meals']").click();
    };
  }

  State.inventory.forEach(item => {
    const tr = document.createElement("tr");
    
    // Calculate expiry status
    const daysLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    let statusText = `${daysLeft} days left`;
    let statusStyle = "color: var(--primary-green); font-weight: 700;";
    
    if (daysLeft <= 0) {
      statusText = "EXPIRED";
      statusStyle = "color: var(--accent-orange); font-weight: 700;";
    } else if (daysLeft <= 2) {
      statusText = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
      statusStyle = "color: var(--accent-orange); font-weight: 700;";
    } else {
      statusStyle = "color: var(--text-secondary);";
    }

    tr.innerHTML = `
      <td style="font-weight: 600;">${item.name}</td>
      <td style="text-align: center; color: var(--text-secondary);">${item.currentQty} ${item.unit}</td>
      <td style="text-align: center; color: var(--text-secondary);"><i class="fas ${getStorageIcon(item.storageLoc)}"></i> ${item.storageLoc}</td>
      <td style="text-align: right; ${statusStyle}">${statusText}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderActionableNeeds() {
  const alertsList = document.getElementById("dash-actionable-alerts-list");
  const pulseDot = document.getElementById("dash-pulse-dot");
  if (!alertsList) return;
  
  alertsList.innerHTML = "";
  const activeAlerts = State.notifications.filter(n => !n.read);

  if (activeAlerts.length > 0) {
    if (pulseDot) pulseDot.style.display = "inline-block";
    
    activeAlerts.forEach(notif => {
      const alertItem = document.createElement("div");
      alertItem.className = "actionable-alert-item";
      
      let actionBtnHTML = "";
      if (notif.actionType === "freeze") {
        actionBtnHTML = `<button class="actionable-alert-btn" onclick="triggerAutoFreeze('${notif.actionTarget}', '${notif.id}')"><i class="fas fa-snowflake"></i> Freeze</button>`;
      } else {
        actionBtnHTML = `<button class="actionable-alert-btn btn-resolve" onclick="resolveActionableNeed('${notif.id}')">Resolved</button>`;
      }

      alertItem.innerHTML = `
        <div class="actionable-alert-content">
          <i class="fas ${notif.urgent ? 'fa-triangle-exclamation' : 'fa-circle-info'} actionable-alert-icon" style="color: ${notif.urgent ? 'var(--accent-orange)' : 'var(--primary-green)'};"></i>
          <span class="actionable-alert-text">${notif.text}</span>
        </div>
        ${actionBtnHTML}
      `;
      alertsList.appendChild(alertItem);
    });
  } else {
    if (pulseDot) pulseDot.style.display = "none";
    alertsList.innerHTML = `
      <div class="empty-state" style="padding: 15px; text-align: center; width: 100%;">
        <i class="fas fa-circle-check" style="font-size: 24px; color: var(--primary-green); margin-bottom: 8px;"></i>
        <p style="margin:0; font-size:12px; color:var(--text-secondary);">All inventory storage looks stable. No pending actions!</p>
      </div>
    `;
  }
}

function resolveActionableNeed(notifId) {
  State.notifications = State.notifications.filter(n => n.id !== notifId);
  saveStateToStorage();
  refreshDashboard();
}

function renderMealPlanningCalendar() {
  const container = document.getElementById("calendar-days-container");
  if (!container) return;
  container.innerHTML = "";

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Calculate dates
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sun, 1 is Mon, etc.
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() + distanceToMonday);

  if (!State.calendar) State.calendar = {};

  daysOfWeek.forEach((dayName, index) => {
    const dateOfThisDay = new Date(mondayDate);
    dateOfThisDay.setDate(mondayDate.getDate() + index);
    const dateKey = dateOfThisDay.toISOString().split("T")[0]; // YYYY-MM-DD
    const displayDate = dateOfThisDay.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    if (!State.calendar[dateKey]) {
      State.calendar[dateKey] = { Breakfast: null, Lunch: null, Dinner: null };
    }

    const dayRow = document.createElement("div");
    dayRow.className = "calendar-day-row";
    
    dayRow.innerHTML = `
      <div class="calendar-day-info" style="display: flex; align-items: center;">
        <span class="calendar-day-name">${dayName}</span>
        <span class="calendar-day-date-label" style="margin-left: 4px;">${displayDate}</span>
        <i class="fas fa-chevron-down" onclick="toggleCalendarDayExpand(this)" style="margin-left: auto; cursor: pointer; color: var(--text-secondary); font-size: 10px; padding: 4px;"></i>
      </div>
      <div class="calendar-day-slots" data-date="${dateKey}">
        ${renderCalendarMealSlot(dateKey, "Breakfast")}
        ${renderCalendarMealSlot(dateKey, "Lunch")}
        ${renderCalendarMealSlot(dateKey, "Dinner")}
      </div>
    `;

    container.appendChild(dayRow);
  });
}

function renderCalendarMealSlot(dateKey, mealType) {
  const mealVal = State.calendar[dateKey] ? State.calendar[dateKey][mealType] : null;
  const recipe = mealVal ? State.recipes.find(r => r.id === mealVal) : null;
  
  if (recipe) {
    return `
      <div class="calendar-meal-slot filled">
        <div onclick="openMealSelectorModal('${dateKey}', '${mealType}')" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; cursor: pointer;">
          <span class="calendar-meal-slot-type">${mealType}</span>
          <span class="calendar-meal-slot-name" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${recipe.name}</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <i class="fas fa-pen calendar-meal-slot-edit-btn" onclick="event.stopPropagation(); editPlannerRecipe('${recipe.id}')" style="cursor: pointer; font-size: 11px; color: var(--primary-green); padding: 4px;"></i>
          <div class="calendar-meal-slot-clear-btn" onclick="event.stopPropagation(); clearCalendarSlot('${dateKey}', '${mealType}')" style="position: static; transform: none; padding: 4px;">
            <i class="fas fa-circle-xmark"></i>
          </div>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="calendar-meal-slot" onclick="openMealSelectorModal('${dateKey}', '${mealType}')">
        <span class="calendar-meal-slot-type" style="opacity: 0.6;">${mealType}</span>
        <span class="calendar-meal-slot-name" style="color: var(--text-secondary); font-size: 8px;"><i class="fas fa-plus"></i> Add</span>
      </div>
    `;
  }
}

window.editPlannerRecipe = function(recipeId) {
  const tabBtn = document.querySelector("[data-tab='meals']");
  if (tabBtn) tabBtn.click();
  setTimeout(() => {
    if (typeof openRecipeEditModal === 'function') {
      openRecipeEditModal(recipeId);
    }
  }, 100);
};

function openMealSelectorModal(day, mealType) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay active";
  modal.style.zIndex = "1000";
  
  const box = document.createElement("div");
  box.className = "modal-box";
  box.style.maxWidth = "400px";
  box.style.width = "92%";
  
  let optionsHTML = "";
  if (State.recipes.length === 0) {
    optionsHTML = `<p style="text-align:center; padding:10px; font-size:13px; color:var(--text-secondary);">No recipes found. Create one in Meal Builder first!</p>`;
  } else {
    State.recipes.forEach(recipe => {
      const isAvailable = checkRecipeIngredientsAvailable(recipe).available;
      optionsHTML += `
        <div class="social-account-select-row" style="margin-bottom: 8px; padding: 12px; border-color: ${isAvailable ? 'var(--primary-green)' : 'var(--border-color)'};" onclick="selectMealForCalendar('${day}', '${mealType}', '${recipe.id}', this)">
          <div style="display:flex; flex-direction:column; text-align:left; flex:1;">
            <span style="font-weight:700; font-size:13px; color:var(--text-main);">${recipe.name}</span>
            <span style="font-size:11px; color:var(--text-secondary);">${recipe.description}</span>
          </div>
          <span class="recipe-tag" style="background-color: ${isAvailable ? 'var(--primary-green-light)' : 'var(--border-color)'}; color: ${isAvailable ? 'var(--primary-green)' : 'var(--text-secondary)'}; font-size:9px; border:none; padding:2px 6px;">
            ${isAvailable ? 'Ready' : 'Low Stock'}
          </span>
        </div>
      `;
    });
  }
  
  box.innerHTML = `
    <div class="modal-header">
      <h2 style="font-size:16px; font-weight:800; margin-bottom:0;">Select Meal for ${day} (${mealType})</h2>
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
    </div>
    <div class="modal-content" style="padding:12px 8px; max-height: 300px; overflow-y: auto;">
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${optionsHTML}
      </div>
    </div>
  `;
  
  modal.appendChild(box);
  document.body.appendChild(modal);
}

window.selectMealForCalendar = function(day, mealType, recipeId, element) {
  if (!State.calendar[day]) State.calendar[day] = { Breakfast: null, Lunch: null, Dinner: null };
  
  State.calendar[day][mealType] = recipeId;
  saveStateToStorage();
  refreshInventoryList();
  refreshDashboard();
  
  const overlay = element.closest(".modal-overlay");
  if (overlay) overlay.remove();
};

window.clearCalendarSlot = function(day, mealType) {
  if (State.calendar[day]) {
    State.calendar[day][mealType] = null;
    saveStateToStorage();
    refreshDashboard();
  }
};

function updateNotificationsBadge() {
  const badge = document.getElementById("notif-badge-indicator");
  const count = State.notifications.filter(n => !n.read).length;
  if (count > 0 && badge) {
    badge.style.display = "block";
  } else if (badge) {
    badge.style.display = "none";
  }
}

// Bind Notification Center Click
document.getElementById("btn-dashboard-notifs").addEventListener("click", () => {
  const modal = document.getElementById("modal-notifications");
  const list = document.getElementById("notif-center-list");
  list.innerHTML = "";

  if (State.notifications.length === 0) {
    list.innerHTML = `<p style="text-align:center; padding: 20px;">No alerts logged.</p>`;
  } else {
    State.notifications.forEach(notif => {
      const item = document.createElement("div");
      item.className = "alert-item" + (notif.read ? "" : " alert-urgent");
      item.innerHTML = `
        <i class="fas fa-bell" style="color: ${notif.urgent ? 'var(--accent-orange)' : 'var(--primary-green)'};"></i>
        <div class="alert-item-content" style="cursor: pointer;" onclick="markNotificationRead('${notif.id}')">
          <div class="alert-title">${notif.text}</div>
          <div class="alert-desc">${notif.read ? 'Opened' : 'Tap to mark read'}</div>
        </div>
      `;
      list.appendChild(item);
    });
  }
  modal.classList.add("active");
});

document.getElementById("btn-notif-modal-close").onclick = () => {
  document.getElementById("modal-notifications").classList.remove("active");
};

function markNotificationRead(id) {
  const notif = State.notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    saveStateToStorage();
    refreshDashboard();
    // Refresh modal list
    document.getElementById("btn-dashboard-notifs").click();
  }
}

function triggerAutoFreeze(itemId, notifId) {
  const item = State.inventory.find(i => i.id === itemId);
  if (item) {
    item.storageLoc = "Freezer";
    
    // Extend expiry by 6 months (180 days) based on USDA freezer times
    const expiry = new Date(item.expiryDate);
    expiry.setDate(expiry.getDate() + 180);
    item.expiryDate = expiry.toISOString().split("T")[0];

    // Remove notification
    State.notifications = State.notifications.filter(n => n.id !== notifId);

    saveStateToStorage();
    refreshDashboard();
    refreshInventoryList();
    alert(`Successfully moved ${item.name} to the Freezer! Shelf life extended by 6 months.`);
  }
}

// ----------------------------------------------------
// 7. RECEIPT OCR SCANNING & ENTRY
// ----------------------------------------------------
let ocrTempReceiptData = null;

function initReceiptScanning() {
  // Option Selector Buttons
  const tabs = document.querySelectorAll(".entry-options .entry-btn");
  const panels = document.querySelectorAll(".entry-panel");

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");

      if (btn.id === "btn-tab-ocr") {
        document.getElementById("panel-ocr").classList.add("active");
        const camTrig = document.getElementById("btn-open-camera-trigger");
        if(camTrig) camTrig.click();
      }
      
      if (btn.id === "btn-tab-manual") {
        document.getElementById("panel-manual").classList.add("active");
        // Pre-fill dates
        document.getElementById("man-date-purchase").value = new Date().toISOString().split("T")[0];
      }
      if (btn.id === "btn-tab-digital") document.getElementById("panel-digital").classList.add("active");
    });
  });

  // Store select chip logic
  const storeChips = document.querySelectorAll("#ocr-store-grid .store-chip");
  storeChips.forEach(chip => {
    chip.addEventListener("click", () => {
      storeChips.forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
    });
  });

  // Camera Scanner Binding
  const cameraTrigger = document.getElementById("btn-open-camera-trigger");
  const cameraModal = document.getElementById("modal-camera");
  const video = document.getElementById("camera-video");
  const canvas = document.getElementById("camera-canvas");
  const preview = document.getElementById("camera-preview");
  const btnCapture = document.getElementById("btn-camera-capture");
  const btnRetake = document.getElementById("btn-camera-retake");
  const btnUse = document.getElementById("btn-camera-use");
  const btnCameraClose = document.getElementById("btn-camera-close");
  let cameraStream = null;

  if (cameraTrigger) {
    cameraTrigger.addEventListener("click", async () => {
      try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        video.srcObject = cameraStream;
        video.style.display = "block";
        preview.style.display = "none";
        btnCapture.style.display = "block";
        btnRetake.style.display = "none";
        btnUse.style.display = "none";
        cameraModal.classList.add("active");
      } catch (err) {
        console.error("Camera access failed:", err);
        alert("Unable to access the device camera. Please make sure you grant camera permissions, or use the Simulator option.");
      }
    });
  }

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    if (video) video.srcObject = null;
    cameraModal.classList.remove("active");
  };

  if (btnCameraClose) {
    btnCameraClose.addEventListener("click", stopCameraStream);
  }

  if (btnCapture) {
    btnCapture.addEventListener("click", () => {
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, width, height);
      
      const dataUrl = canvas.toDataURL("image/png");
      
      video.style.display = "none";
      preview.src = dataUrl;
      preview.style.display = "block";
      
      btnCapture.style.display = "none";
      btnRetake.style.display = "block";
      btnUse.style.display = "block";
    });
  }

  if (btnRetake) {
    btnRetake.addEventListener("click", () => {
      video.style.display = "block";
      preview.style.display = "none";
      btnCapture.style.display = "block";
      btnRetake.style.display = "none";
      btnUse.style.display = "none";
    });
  }

  if (btnUse) {
    btnUse.addEventListener("click", async () => {
      stopCameraStream();
      
      const chosenStore = document.querySelector("#ocr-store-grid .store-chip.selected").dataset.store;
      
      if (cameraTrigger) {
        cameraTrigger.classList.add("scanning");
      }
      
      setTimeout(async () => {
        if (cameraTrigger) cameraTrigger.classList.remove("scanning");
        try {
          ocrTempReceiptData = await ClientAPI.request('/api/ocr', 'POST', { store: chosenStore });
          renderReceiptReview(ocrTempReceiptData);
        } catch (err) {
          console.warn("OCR API failed, falling back to local simulation:", err);
          const template = OCR_TEMPLATES[chosenStore];
          ocrTempReceiptData = JSON.parse(JSON.stringify(template)); // Deep clone
          ocrTempReceiptData.date = new Date().toISOString().split("T")[0];
          renderReceiptReview(ocrTempReceiptData);
        }
      }, 1500);
    });
  }

  // Store select dropdown binding
  const storeSelect = document.getElementById("man-store-select");
  const storeInput = document.getElementById("man-store");
  const storeOtherGroup = document.getElementById("man-store-other-group");
  if (storeSelect && storeInput) {
    storeSelect.addEventListener("change", () => {
      if (storeSelect.value === "Other") {
        storeOtherGroup.style.display = "block";
        storeInput.value = "";
        storeInput.focus();
      } else {
        storeOtherGroup.style.display = "none";
        storeInput.value = storeSelect.value;
      }
    });
    // Set initial value
    storeInput.value = storeSelect.value;
  }

  // Save manual receipt save button
  document.getElementById("btn-manual-save").addEventListener("click", () => {
    const name = document.getElementById("man-name").value;
    const cat = document.querySelector("#man-cat-grid .grid-option.selected").dataset.cat;
    const qty = parseQuantityValue(document.getElementById("man-qty").value) || 1;
    const unit = document.getElementById("man-unit").value;
    const price = parseFloat(document.getElementById("man-price").value) || 0.00;
    const store = storeSelect.value === "Other" ? storeInput.value : storeSelect.value;
    const pDate = document.getElementById("man-date-purchase").value;
    const eDate = document.getElementById("man-date-expiry").value;
    const loc = document.querySelector("#man-loc-grid .grid-option.selected").dataset.loc;
    const notes = document.getElementById("man-notes").value;

    if (!name) {
      alert("Please enter the ingredient name.");
      return;
    }

    // Auto compute expiry if empty
    let expiry = eDate;
    if (!expiry) {
      const p = new Date(pDate);
      const limitDays = USDA_SHELF_LIFE[cat] ? (loc === "Freezer" ? USDA_SHELF_LIFE[cat].freezer : USDA_SHELF_LIFE[cat].fridge) : 7;
      p.setDate(p.getDate() + limitDays);
      expiry = p.toISOString().split("T")[0];
    }

    const newItem = {
      id: "inv_" + Date.now(),
      name,
      category: cat,
      originalQty: qty,
      currentQty: qty,
      unit,
      price,
      store,
      purchaseDate: pDate,
      expiryDate: expiry,
      storageLoc: loc,
      timesUsed: 0,
      costPerUnit: price / qty,
      notes
    };

    State.inventory.unshift(newItem);
    
    // Log trip
    State.trips.unshift({
      id: "trip_" + Date.now(),
      store,
      date: pDate,
      cost: price,
      items: [name],
      wasted: 0,
      mealsMade: 0
    });

    saveStateToStorage();
    if (typeof refreshPurchasesFolders === "function") refreshPurchasesFolders();
    alert(`${name} successfully added to inventory!`);
    
    // Reset manual form fields
    document.getElementById("man-name").value = "";
    document.getElementById("man-price").value = "";
    document.getElementById("man-notes").value = "";
  });

  // Form options grids binds
  bindOptionGrid("#man-cat-grid");
  bindOptionGrid("#man-loc-grid");

  // OCR Save / Cancel
  document.getElementById("btn-ocr-cancel").addEventListener("click", () => {
    document.getElementById("receipt-review-container").style.display = "none";
    ocrTempReceiptData = null;
  });

  document.getElementById("btn-ocr-save").addEventListener("click", () => {
    if (!ocrTempReceiptData) return;

    const finalItems = [];
    let receiptCostTotal = 0;

    // Read items from edited review list
    document.querySelectorAll(".review-item-row").forEach(row => {
      const idx = parseInt(row.dataset.index);
      const itemData = ocrTempReceiptData.items[idx];
      if (itemData) {
        // Collect current edited quantities
        const qty = parseFloat(row.querySelector(".review-qty-input").value) || 1;
        const price = parseFloat(row.querySelector(".review-price-input").value) || 0.00;
        
        // Generate expiration dates
        const pDate = new Date();
        const expiry = new Date();
        const limitDays = USDA_SHELF_LIFE[itemData.category] ? USDA_SHELF_LIFE[itemData.category].fridge : 7;
        expiry.setDate(pDate.getDate() + limitDays);

        const newItem = {
          id: `inv_${Date.now()}_${idx}`,
          name: itemData.name,
          category: itemData.category,
          originalQty: qty,
          currentQty: qty,
          unit: itemData.unit,
          price: price,
          store: ocrTempReceiptData.store,
          purchaseDate: pDate.toISOString().split("T")[0],
          expiryDate: expiry.toISOString().split("T")[0],
          storageLoc: itemData.category === "Frozen" ? "Freezer" : (itemData.category === "Pantry" ? "Pantry" : "Fridge"),
          timesUsed: 0,
          costPerUnit: price / qty,
          notes: "Auto-imported from OCR scan"
        };
        
        State.inventory.unshift(newItem);
        finalItems.push(itemData.name);
        receiptCostTotal += price;
      }
    });

    // Add shopping trip record
    State.trips.unshift({
      id: "trip_" + Date.now(),
      store: ocrTempReceiptData.store,
      date: ocrTempReceiptData.date,
      cost: receiptCostTotal,
      items: finalItems,
      wasted: 0,
      mealsMade: 0
    });

    saveStateToStorage();
    if (typeof refreshPurchasesFolders === "function") refreshPurchasesFolders();
    
    // Hide panel
    document.getElementById("receipt-review-container").style.display = "none";
    ocrTempReceiptData = null;
    alert("Receipt items loaded successfully into inventory!");
  });
}

function bindOptionGrid(selector) {
  const container = document.querySelector(selector);
  if (!container) return;
  container.querySelectorAll(".grid-option").forEach(opt => {
    opt.addEventListener("click", () => {
      container.querySelectorAll(".grid-option").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
    });
  });
}

function renderReceiptReview(receiptData) {
  const reviewContainer = document.getElementById("receipt-review-container");
  const storeTitle = document.getElementById("review-receipt-store");
  const dateLabel = document.getElementById("review-receipt-date");
  const listContainer = document.getElementById("review-receipt-items-list");
  const totalLabel = document.getElementById("review-receipt-total");

  storeTitle.textContent = receiptData.store;
  dateLabel.textContent = receiptData.date;
  listContainer.innerHTML = "";

  let receiptSum = 0;
  receiptData.items.forEach((item, index) => {
    receiptSum += item.price;
    const row = document.createElement("div");
    row.className = "review-item-row";
    row.dataset.index = index;
    row.innerHTML = `
      <span class="review-item-name">${item.name}</span>
      <input type="number" class="form-control review-qty-input" value="${item.qty}" style="width: 55px; padding: 4px; font-size:12px; text-align:center; height: auto;">
      <span style="font-size:11px; margin-left: 2px;">${item.unit}</span>
      <span style="font-size:11px; margin-left: auto; color: var(--text-secondary);">$</span>
      <input type="number" class="form-control review-price-input" value="${item.price.toFixed(2)}" step="0.01" style="width: 65px; padding: 4px; font-size:12px; text-align:right; height: auto;">
      <i class="fas fa-trash-can review-item-delete" onclick="deleteReceiptReviewItem(this, ${item.price})"></i>
    `;
    listContainer.appendChild(row);
  });

  totalLabel.textContent = `$${receiptSum.toFixed(2)}`;
  reviewContainer.style.display = "block";
}

function deleteReceiptReviewItem(btnEl, price) {
  const row = btnEl.closest(".review-item-row");
  row.remove();
  
  // Re-sum total
  let totalSum = 0;
  document.querySelectorAll(".review-item-row").forEach(r => {
    totalSum += parseFloat(r.querySelector(".review-price-input").value) || 0;
  });
  document.getElementById("review-receipt-total").textContent = `$${totalSum.toFixed(2)}`;
}

// ----------------------------------------------------
// 8. INVENTORY MANAGEMENT SYSTEM
// ----------------------------------------------------
let activeInventoryFilter = "All";
let isInventorySortAsc = true;
let isMealGenerationMode = false;
let selectedForMealIdea = [];

function initInventoryManagement() {
  // Bind tab filters
  document.querySelectorAll(".loc-tabs .loc-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".loc-tabs .loc-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeInventoryFilter = tab.dataset.location;
      refreshInventoryList();
    });
  });

  // Bind category chips
  document.querySelectorAll("#inventory-category-chips .filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#inventory-category-chips .filter-chip").forEach(c => {
        c.classList.remove("active");
        c.style.background = "var(--bg-card)";
        c.style.color = "var(--text-secondary)";
        c.style.borderColor = "var(--border-color)";
      });
      chip.classList.add("active");
      chip.style.background = "var(--primary-green-light)";
      chip.style.color = "var(--primary-green)";
      chip.style.borderColor = "var(--primary-green)";
      refreshInventoryList();
    });
  });

  // Bind Search Input
  document.getElementById("inventory-search-input").addEventListener("input", () => {
    refreshInventoryList();
  });

  // Expiry Sort Toggle
  document.getElementById("btn-inventory-sort-toggle").addEventListener("click", () => {
    isInventorySortAsc = !isInventorySortAsc;
    const icon = document.getElementById("btn-inventory-sort-toggle").querySelector("i");
    if (isInventorySortAsc) {
      icon.className = "fas fa-arrow-down-a-z";
    } else {
      icon.className = "fas fa-arrow-up-z-a";
    }
    refreshInventoryList();
  });

  // Percentage Sort Toggle
  const pctSortToggle = document.getElementById("btn-inventory-pct-sort-toggle");
  if (pctSortToggle) {
    pctSortToggle.addEventListener("click", () => {
      const icon = pctSortToggle.querySelector("i");
      if (State.inventoryPctSort === null) {
        State.inventoryPctSort = "asc";
        pctSortToggle.style.background = "var(--primary-green-light)";
        pctSortToggle.style.color = "var(--primary-green)";
        pctSortToggle.style.borderColor = "var(--primary-green)";
        icon.className = "fas fa-arrow-down-short-wide";
      } else if (State.inventoryPctSort === "asc") {
        State.inventoryPctSort = "desc";
        pctSortToggle.style.background = "var(--primary-green-light)";
        pctSortToggle.style.color = "var(--primary-green)";
        pctSortToggle.style.borderColor = "var(--primary-green)";
        icon.className = "fas fa-arrow-up-short-wide";
      } else {
        State.inventoryPctSort = null;
        pctSortToggle.style.background = "var(--bg-card)";
        pctSortToggle.style.color = "var(--text-secondary)";
        pctSortToggle.style.borderColor = "var(--border-color)";
        icon.className = "fas fa-percent";
      }
      refreshInventoryList();
    });
  }

  // Modal Split save binds
  document.getElementById("btn-split-modal-close").onclick = () => {
    document.getElementById("modal-split-storage").classList.remove("active");
  };

  document.getElementById("btn-split-confirm").addEventListener("click", () => {
    const itemId = document.getElementById("modal-split-storage").dataset.itemId;
    const item = State.inventory.find(i => i.id === itemId);
    if (!item) return;

    const qtyA = parseFloat(document.getElementById("split-qty-a").value);
    const locA = document.getElementById("split-loc-a").value;
    const qtyB = parseFloat(document.getElementById("split-qty-b").value);
    const locB = document.getElementById("split-loc-b").value;

    if (qtyA + qtyB !== item.currentQty) {
      alert(`Error: Split quantities (${qtyA} + ${qtyB}) must equal current total quantity (${item.currentQty}).`);
      return;
    }

    // Split logic
    item.currentQty = qtyA;
    item.storageLoc = locA;

    // Create package B
    const expiryB = new Date(item.purchaseDate);
    const cat = item.category;
    const shelfDays = USDA_SHELF_LIFE[cat] ? (locB === "Freezer" ? USDA_SHELF_LIFE[cat].freezer : USDA_SHELF_LIFE[cat].fridge) : 7;
    expiryB.setDate(expiryB.getDate() + shelfDays);

    const splitPackageB = {
      id: `inv_${Date.now()}_split`,
      name: `${item.name} (Pkg B)`,
      category: item.category,
      originalQty: qtyB,
      currentQty: qtyB,
      unit: item.unit,
      price: (item.price / (qtyA + qtyB)) * qtyB,
      store: item.store,
      purchaseDate: item.purchaseDate,
      expiryDate: expiryB.toISOString().split("T")[0],
      storageLoc: locB,
      timesUsed: 0,
      costPerUnit: item.costPerUnit,
      notes: `${item.notes || ""} - Split package`
    };

    // Rename original item package
    item.name = `${item.name} (Pkg A)`;

    State.inventory.push(splitPackageB);
    saveStateToStorage();
    
    document.getElementById("modal-split-storage").classList.remove("active");
    refreshInventoryList();
    alert("Storage package split successfully!");
  });
}

function refreshInventoryList() {
  recalculateInventoryRemaining();
  const container = document.getElementById("inventory-list-container");
  const countLabel = document.getElementById("inventory-total-label");
  container.innerHTML = "";

  const query = document.getElementById("inventory-search-input").value.toLowerCase();

  // Find selected category filter chip
  const catChip = document.querySelector("#inventory-category-chips .filter-chip.active");
  const categoryFilter = catChip ? catChip.dataset.category : "All";

  // Filter inventory
  let list = State.inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
    const matchesLoc = activeInventoryFilter === "All" || item.storageLoc === activeInventoryFilter;
    
    // Category matching
    let matchesCategory = categoryFilter === "All";
    if (!matchesCategory) {
      if (categoryFilter === "Produce" && item.category === "Produce") matchesCategory = true;
      else if (categoryFilter === "Bakery" && item.category === "Bakery") matchesCategory = true;
      else if (categoryFilter === "Dairy & Eggs" && item.category === "Dairy & Eggs") matchesCategory = true;
      else if (categoryFilter === "Meat & Poultry" && item.category === "Meat & Poultry") matchesCategory = true;
      else if (item.category.toLowerCase().includes(categoryFilter.toLowerCase())) matchesCategory = true;
    }
    
    return matchesSearch && matchesLoc && matchesCategory;
  });

  // Sort inventory items
  if (State.inventoryPctSort === "asc") {
    list.sort((a, b) => (a.remainingPercent !== undefined ? a.remainingPercent : 100) - (b.remainingPercent !== undefined ? b.remainingPercent : 100));
  } else if (State.inventoryPctSort === "desc") {
    list.sort((a, b) => (b.remainingPercent !== undefined ? b.remainingPercent : 100) - (a.remainingPercent !== undefined ? a.remainingPercent : 100));
  } else {
    // Default Expiry dates sort
    list.sort((a, b) => {
      const diff = new Date(a.expiryDate) - new Date(b.expiryDate);
      return isInventorySortAsc ? diff : -diff;
    });
  }

  countLabel.textContent = `${list.length} ingredient${list.length !== 1 ? 's' : ''} in storage`;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-boxes-packing"></i>
        <p>No storage items found.</p>
      </div>
    `;
    return;
  }

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "inv-card";
    card.dataset.id = item.id;
    
    // Days remaining math
    const daysLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    let lifeClass = "safe";
    const suffix = item.isEstimatedDate ? " (Estimated)" : "";
    let lifeText = "";
    if (daysLeft <= 0) {
      lifeClass = "warn";
      lifeText = `EXPIRED${suffix}`;
    } else {
      if (daysLeft <= 2) {
        lifeClass = "warn";
      }
      lifeText = `${daysLeft} Day${daysLeft !== 1 ? 's' : ''} Left${suffix}`;
    }
    const isSelected = selectedForMealIdea.includes(item.id);
    const checkboxHtml = isMealGenerationMode ? `<div class="inv-card-checkbox ${isSelected ? 'selected' : ''}" onclick="toggleMealGenerationSelection(event, '${item.id}')"></div>` : '';

    const clickAction = isMealGenerationMode 
      ? `toggleMealGenerationSelection(event, '${item.id}')` 
      : `this.closest('.inv-card').classList.toggle('expanded')`;

    card.innerHTML = `
      ${checkboxHtml}
      <div class="inv-card-header" onclick="${clickAction}">
        <div class="inv-card-title-group">
          <span class="inv-card-name">${item.name}</span>
          <span class="inv-card-cat">${item.category} • <i class="fas ${getStorageIcon(item.storageLoc)}"></i> ${item.storageLoc}</span>
        </div>
        <span class="inv-card-life ${lifeClass}">${lifeText}</span>
      </div>
      
      <div class="inv-card-details-row" onclick="${clickAction}" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%;">
        <span class="inv-card-qty" style="white-space: nowrap;">
          ${item.currentQty} ${item.unit}
          <span style="font-size: 11px; font-weight: normal; color: ${getUsageProgressBarColor(item.remainingPercent)}; margin-left: 4px;">
            (${item.remainingPercent.toFixed(0)}%)
          </span>
        </span>
        <div class="timeline-progress-track" style="margin-top: 0; background: var(--border-color); height: 6px; border-radius: 3px; flex: 1;">
          <div class="timeline-progress-bar" style="width: ${item.remainingPercent}%; background: ${getUsageProgressBarColor(item.remainingPercent)}; height: 100%; border-radius: 3px; transition: width 0.3s ease, background-color 0.3s ease;"></div>
        </div>
        <span class="inv-card-sub-info" style="white-space: nowrap; display: flex; align-items: center; gap: 6px;">
          <span>Cost: $${item.price.toFixed(2)}</span>
          <i class="fas fa-angle-down"></i>
        </span>
      </div>

      <div class="inv-expanded-details">
        <div class="expanded-detail-row">
          <span class="expanded-detail-label">Purchased:</span>
          <span class="expanded-detail-value">${item.purchaseDate} at ${item.store || 'Unknown'}</span>
        </div>
        <div class="expanded-detail-row">
          <span class="expanded-detail-label">Best By:</span>
          <span class="expanded-detail-value">${item.expiryDate}${item.isEstimatedDate ? ' <span style="color:var(--text-secondary);font-size:0.9em">(Estimated)</span>' : ''}</span>
        </div>
        <div class="expanded-detail-row">
          <span class="expanded-detail-label">Cost per unit:</span>
          <span class="expanded-detail-value">$${item.costPerUnit.toFixed(2)}/${item.unit}</span>
        </div>
        <div class="expanded-detail-row">
          <span class="expanded-detail-label">Times cooked:</span>
          <span class="expanded-detail-value">${item.timesUsed}</span>
        </div>
        <div class="expanded-detail-row">
          <span class="expanded-detail-label">Storage Notes:</span>
          <span class="expanded-detail-value">${item.notes || 'None'}</span>
        </div>

        <div class="inv-card-actions">
          <button class="inv-action-btn" onclick="openEditGroceryModal('${item.id}')"><i class="fas fa-pen"></i> Edit</button>
          <button class="inv-action-btn btn-action-orange" onclick="replenishItem('${item.id}')"><i class="fas fa-arrows-rotate"></i> Replenish</button>
          <button class="inv-action-btn" onclick="openSplitStorageModal('${item.id}')"><i class="fas fa-scissors"></i> Split</button>
          <button class="inv-action-btn btn-action-green" onclick="removeItemDirectly('${item.id}')"><i class="fas fa-trash-can"></i> Remove</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function getStorageIcon(loc) {
  if (loc === "Fridge") return "fa-temperature-low";
  if (loc === "Freezer") return "fa-snowflake";
  return "fa-box-open";
}

function openSplitStorageModal(itemId) {
  const item = State.inventory.find(i => i.id === itemId);
  if (!item) return;

  const modal = document.getElementById("modal-split-storage");
  modal.dataset.itemId = itemId;
  
  document.getElementById("split-item-name").textContent = item.name;
  document.getElementById("split-item-orig-qty").textContent = `${item.currentQty} ${item.unit}`;
  
  // Pre-fill equal halves
  const half = Math.floor(item.currentQty / 2) || 1;
  document.getElementById("split-qty-a").value = half;
  document.getElementById("split-qty-b").value = item.currentQty - half;
  
  document.getElementById("split-loc-a").value = item.storageLoc;

  modal.classList.add("active");
}

window.removeItemDirectly = function(itemId) {
  const index = State.inventory.findIndex(i => i.id === itemId);
  if (index === -1) return;
  State.inventory.splice(index, 1);
  saveStateToStorage();
  refreshInventoryList();
  refreshDashboard();
};

function promptItemDisposition(itemId) {
  const item = State.inventory.find(i => i.id === itemId);
  if (!item) return;

  const modal = document.getElementById("modal-waste-prompt");
  modal.dataset.itemId = itemId;
  document.getElementById("waste-item-name").textContent = item.name;

  // Add click events to buttons once
  modal.querySelectorAll(".btn").forEach(btn => {
    btn.onclick = () => {
      const disposition = btn.dataset.action;
      executeItemRemoval(itemId, disposition);
      modal.classList.remove("active");
    };
  });

  modal.classList.add("active");
}

document.getElementById("btn-waste-modal-close").onclick = () => {
  document.getElementById("modal-waste-prompt").classList.remove("active");
};

function executeItemRemoval(itemId, action) {
  const index = State.inventory.findIndex(i => i.id === itemId);
  if (index === -1) return;

  const item = State.inventory[index];
  
  if (action === "Spoiled" || action === "Thrown Away") {
    // Add to waste tracker logs
    State.wasteLogs.push({
      id: "w_" + Date.now(),
      name: item.name,
      qty: item.currentQty,
      unit: item.unit,
      cost: item.price,
      action: action,
      date: new Date().toISOString().split("T")[0]
    });
  }

  // Remove item from active inventory list
  State.inventory.splice(index, 1);
  saveStateToStorage();
  refreshInventoryList();
  refreshDashboard();
  alert(`Item logged as "${action}". Analytics updated.`);
}

// ----------------------------------------------------
// 9. MEAL BUILDER & RECIPE ENGINE
// ----------------------------------------------------
let isRecipeEditMode = false;

function initMealBuilder() {
  // Search Recipie
  document.getElementById("recipe-search-input").addEventListener("input", () => {
    refreshRecipesList();
  });

  // Bind meal type filter chips
  document.querySelectorAll("#meal-type-filter-chips .filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#meal-type-filter-chips .filter-chip").forEach(c => {
        c.classList.remove("active");
        c.style.background = "var(--bg-card)";
        c.style.color = "var(--text-secondary)";
        c.style.borderColor = "var(--border-color)";
      });
      chip.classList.add("active");
      chip.style.background = "var(--primary-green-light)";
      chip.style.color = "var(--primary-green)";
      chip.style.borderColor = "var(--primary-green)";
      refreshRecipesList();
    });
  });

  // Add Recipe trigger
  document.getElementById("btn-meals-create-trigger").onclick = () => {
    openRecipeEditModal();
  };

  document.getElementById("btn-recipe-modal-close").onclick = () => {
    document.getElementById("modal-recipe-detail").classList.remove("active");
  };

  // Duplicate button inside details
  document.getElementById("btn-recipe-duplicate").onclick = () => {
    const recipeId = document.getElementById("modal-recipe-detail").dataset.recipeId;
    const orig = State.recipes.find(r => r.id === recipeId);
    if (orig) {
      const copy = JSON.parse(JSON.stringify(orig));
      copy.id = "rec_" + Date.now();
      copy.name = `${copy.name} (Copy)`;
      State.recipes.push(copy);
      saveStateToStorage();
      refreshRecipesList();
      document.getElementById("modal-recipe-detail").classList.remove("active");
      alert("Recipe duplicated successfully!");
    }
  };

  // Edit button inside details
  document.getElementById("btn-recipe-edit").onclick = () => {
    const recipeId = document.getElementById("modal-recipe-detail").dataset.recipeId;
    openRecipeEditModal(recipeId);
  };

  // Add row in editor
  document.getElementById("btn-recipe-add-ingredient-row").onclick = () => {
    addIngredientEditorRow("", 1, "pcs");
  };

  // Cancel edit modal
  document.getElementById("btn-recipe-edit-cancel").onclick = () => {
    document.getElementById("recipe-edit-mode").style.display = "none";
    document.getElementById("recipe-view-mode").style.display = "block";
    
    const recipeId = document.getElementById("edit-recipe-id").value;
    if (!recipeId) {
      document.getElementById("modal-recipe-detail").classList.remove("active");
    }
  };

  // Save recipe button binds
  document.getElementById("btn-recipe-edit-save").onclick = () => {
    const id = document.getElementById("edit-recipe-id").value;
    const name = document.getElementById("edit-recipe-name").value;
    const desc = document.getElementById("edit-recipe-desc").value;
    const instructions = document.getElementById("edit-recipe-instructions").value;

    if (!name) {
      alert("Please enter a recipe name.");
      return;
    }

    // Compile ingredients
    const ingredients = [];
    document.querySelectorAll(".ingredient-input-row").forEach(row => {
      const ingName = row.querySelector(".ing-row-name").value.trim();
      const qtyEl = row.querySelector(".ing-row-qty");
      const ingQty = qtyEl ? parseFloat(qtyEl.value) : 0.5;
      if (ingName) {
        ingredients.push({ name: ingName, qty: ingQty, unit: "%" });
      }
    });

    if (ingredients.length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }

    // Auto compute nutrition metrics
    const calories = ingredients.length * 150 + 80;
    const protein = ingredients.length * 8 + 4;
    const fat = ingredients.length * 4 + 2;
    const carbs = ingredients.length * 12 + 10;

    const data = {
      id: id || "rec_" + Date.now(),
      name,
      description: desc,
      ingredients,
      instructions,
      nutrition: { calories, protein, fat, carbs }
    };

    if (id) {
      // Modify
      const idx = State.recipes.findIndex(r => r.id === id);
      if (idx !== -1) State.recipes[idx] = data;
    } else {
      // Create new
      State.recipes.push(data);
    }

    saveStateToStorage();
    refreshRecipesList();
    
    document.getElementById("modal-recipe-detail").classList.remove("active");
    alert("Recipe saved successfully!");
  };
}


function refreshRecipesList() {
  const container = document.getElementById("recipes-list-container");
  container.innerHTML = "";

  const query = document.getElementById("recipe-search-input").value.toLowerCase();
  
  // Find selected meal type filter
  const filterChip = document.querySelector("#meal-type-filter-chips .filter-chip.active");
  const mealFilter = filterChip ? filterChip.dataset.filter : "All";

  const list = State.recipes.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(query) || r.description.toLowerCase().includes(query);
    
    let type = "Dinner"; // Heuristic
    const nameLower = r.name.toLowerCase();
    const descLower = r.description.toLowerCase();
    if (nameLower.includes("toast") || nameLower.includes("breakfast") || nameLower.includes("egg") || descLower.includes("breakfast")) {
      type = "Breakfast";
    } else if (nameLower.includes("bowl") || nameLower.includes("lunch") || nameLower.includes("salad") || descLower.includes("lunch")) {
      type = "Lunch";
    }
    
    const matchesFilter = mealFilter === "All" || type === mealFilter;
    return matchesSearch && matchesFilter;
  });

  if (list.length === 0) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-mortar-pestle"></i><p>No recipes found.</p></div>`;
    return;
  }

  list.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    
    const check = checkRecipeIngredientsAvailable(recipe);
    let matchClass = "missing";
    let matchText = "Low stock";
    if (check.available) {
      matchClass = "all-available";
      matchText = "Ready to Cook";
    }

    card.innerHTML = `
      <div class="recipe-card-main-row">
        <div class="recipe-card-content">
          <div class="recipe-card-header" style="margin-bottom: 2px;">
            <span class="recipe-card-title" style="font-size: 15px; font-weight: 700; line-height: 1.2;">${recipe.name}</span>
          </div>
          <p class="recipe-card-desc" style="font-size: 11px; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3;">${recipe.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
            <span class="recipe-ingredients-check ${matchClass}" style="font-size: 10px; font-weight: 700;"><i class="fas ${check.available ? 'fa-circle-check' : 'fa-circle-question'}"></i> ${matchText}</span>
            <div style="display: flex; gap: 4px; align-items: center;">
              <span class="recipe-tag" style="font-size: 9px; padding: 2px 5px;">${recipe.nutrition.calories} kcal</span>
              <i class="fas fa-pen recipe-edit-btn" style="color: var(--primary-green); font-size: 12px; cursor: pointer; padding: 4px; margin-right: 4px;" onclick="event.stopPropagation(); openRecipeEditModal('${recipe.id}')"></i>
              <i class="fas fa-trash recipe-delete-btn" style="color: var(--accent-orange); font-size: 12px; cursor: pointer; padding: 4px;" onclick="event.stopPropagation(); deleteRecipe('${recipe.id}')"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="recipe-details-dropdown" id="dropdown-${recipe.id}">
        <strong>Ingredients:</strong>
        <ul style="padding-left: 16px; margin: 0;">
          ${recipe.ingredients.map(ing => {
            const displayQty = ing.qty === 0.125 ? '1/8' 
              : ing.qty === 0.25 ? '1/4' 
              : ing.qty === 0.333 ? '1/3' 
              : ing.qty === 0.5 ? '1/2' 
              : ing.qty === 0.667 ? '2/3' 
              : ing.qty === 0.75 ? '3/4' 
              : ing.qty === 1.0 ? 'Full (100%)' 
              : ing.qty;
            return `<li>${displayQty} of ${ing.name}</li>`;
          }).join('')}
        </ul>
        <strong style="margin-top: 4px;">Instructions:</strong>
        <p style="margin: 0;">${recipe.instructions}</p>
      </div>
    `;

    // Toggle accordion instead of modal
    card.onclick = () => {
      document.getElementById('dropdown-' + recipe.id).classList.toggle('expanded');
    };

    container.appendChild(card);
  });
}

window.deleteRecipe = function(id) {
  if (confirm("Are you sure you want to delete this recipe?")) {
    State.recipes = State.recipes.filter(r => r.id !== id);
    saveStateToStorage();
    refreshRecipesList();
  }
};

function checkRecipeIngredientsAvailable(recipe) {
  let missing = [];
  recipe.ingredients.forEach(req => {
    const matchingItems = State.inventory.filter(inv => inv.name.toLowerCase().includes(req.name.toLowerCase()));
    const totalCurrentPercent = matchingItems.reduce((acc, curr) => acc + ((curr.remainingPercent !== undefined ? curr.remainingPercent : 100) / 100), 0);
    
    if (totalCurrentPercent < req.qty) {
      missing.push({ name: req.name, req: req.qty, got: totalCurrentPercent });
    }
  });

  return {
    available: missing.length === 0,
    missing: missing
  };
}

function updateRecipeCardAvailability(recipe) {
  const label = document.getElementById(`rec-check-${recipe.id}`);
  if (!label) return;

  const result = checkRecipeIngredientsAvailable(recipe);
  if (result.available) {
    label.className = "recipe-ingredients-check all-available";
    label.innerHTML = `<i class="fas fa-circle-check"></i> Ready to Cook`;
  } else {
    label.className = "recipe-ingredients-check missing";
    label.innerHTML = `<i class="fas fa-triangle-exclamation"></i> Low stock`;
  }
}

function openRecipeDetailsModal(recipeId) {
  const recipe = State.recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  const modal = document.getElementById("modal-recipe-detail");
  modal.dataset.recipeId = recipeId;
  
  document.getElementById("recipe-modal-title").textContent = recipe.name;
  document.getElementById("recipe-view-desc").textContent = recipe.description;
  document.getElementById("recipe-view-instructions").textContent = recipe.instructions;

  // Macros layout
  document.getElementById("recipe-view-macros").innerHTML = `
    <span>Calories: <span class="recipe-nutri-val">${recipe.nutrition.calories} kcal</span></span>
    <span style="margin: 0 4px;">•</span>
    <span>Protein: <span class="recipe-nutri-val">${recipe.nutrition.protein}g</span></span>
    <span style="margin: 0 4px;">•</span>
    <span>Carbs: <span class="recipe-nutri-val">${recipe.nutrition.carbs}g</span></span>
    <span style="margin: 0 4px;">•</span>
    <span>Fat: <span class="recipe-nutri-val">${recipe.nutrition.fat}g</span></span>
  `;

  // Render Ingredients bullet details
  const ingredientsList = document.getElementById("recipe-view-ingredients");
  ingredientsList.innerHTML = "";

  const check = checkRecipeIngredientsAvailable(recipe);

  recipe.ingredients.forEach(req => {
    const li = document.createElement("li");
    const isMissing = check.missing.find(m => m.name.toLowerCase() === req.name.toLowerCase());
    
    if (isMissing) {
      li.style.color = "var(--accent-orange)";
      li.innerHTML = `<strong>${(req.qty * 100).toFixed(0)}%</strong> of ${req.name} <span style="font-size:11px;">(You only have ${(isMissing.got * 100).toFixed(0)}%)</span>`;
    } else {
      li.innerHTML = `<strong>${(req.qty * 100).toFixed(0)}%</strong> of ${req.name} <span style="color:var(--primary-green); font-size:11px;"><i class="fas fa-circle-check"></i> Stocked</span>`;
    }
    ingredientsList.appendChild(li);
  });

  // Cook trigger action bind
  const cookBtn = document.getElementById("btn-recipe-cook");
  
  if (cookBtn) {
    cookBtn.disabled = false;
    cookBtn.style.opacity = 1;
    cookBtn.onclick = () => {
      if (!check.available && !confirm("Warning: You are missing ingredients. Schedule anyway?")) {
        return;
      }
      
      const today = new Date();
      const todayKey = today.toISOString().split("T")[0];
      
      if (!State.calendar[todayKey]) {
        State.calendar[todayKey] = { Breakfast: null, Lunch: null, Dinner: null };
      }
      
      let assignedSlot = "Dinner";
      if (!State.calendar[todayKey].Dinner) {
        State.calendar[todayKey].Dinner = recipe.id;
      } else if (!State.calendar[todayKey].Lunch) {
        State.calendar[todayKey].Lunch = recipe.id;
        assignedSlot = "Lunch";
      } else {
        State.calendar[todayKey].Dinner = recipe.id;
      }
      
      saveStateToStorage();
      refreshDashboard();
      refreshInventoryList();
      alert(`"${recipe.name}" has been scheduled for today's ${assignedSlot} in the Weekly Meal Planner and ingredients deducted!`);
      modal.classList.remove("active");
    };
  }

  // Switch modes inside modal
  document.getElementById("recipe-view-mode").style.display = "block";
  document.getElementById("recipe-edit-mode").style.display = "none";

  modal.classList.add("active");
}



function openRecipeEditModal(recipeId = null) {
  const modal = document.getElementById("modal-recipe-detail");
  const editContainer = document.getElementById("recipe-edit-mode");
  const viewContainer = document.getElementById("recipe-view-mode");

  // Show edit form
  viewContainer.style.display = "none";
  editContainer.style.display = "block";

  const idInput = document.getElementById("edit-recipe-id");
  const nameInput = document.getElementById("edit-recipe-name");
  const descInput = document.getElementById("edit-recipe-desc");
  const instructionsInput = document.getElementById("edit-recipe-instructions");
  const rowsContainer = document.getElementById("recipe-edit-ingredients-container");

  rowsContainer.innerHTML = "";

  if (recipeId) {
    const r = State.recipes.find(rec => rec.id === recipeId);
    document.getElementById("recipe-modal-title").textContent = "Edit Recipe";
    idInput.value = r.id;
    nameInput.value = r.name;
    descInput.value = r.description;
    instructionsInput.value = r.instructions;

    r.ingredients.forEach(ing => {
      addIngredientEditorRow(ing.name, ing.qty, ing.unit);
    });
  } else {
    document.getElementById("recipe-modal-title").textContent = "Create Recipe";
    idInput.value = "";
    nameInput.value = "";
    descInput.value = "";
    instructionsInput.value = "";
    // Default 2 blank rows
    addIngredientEditorRow("", 1, "pcs");
    addIngredientEditorRow("", 1, "pcs");
  }

  document.getElementById("btn-meals-create-trigger").addEventListener("click", () => {
    document.getElementById("recipe-modal-title").textContent = "Create Recipe";
    document.getElementById("recipe-name").value = "";
    document.getElementById("recipe-time").value = "";
    document.getElementById("recipe-type").value = "Dinner";
    document.getElementById("recipe-instructions").value = "";
    recipeIngredients = [];
    renderRecipeIngredients();
    editingRecipeId = null;
    document.getElementById("modal-recipe-detail").classList.add("active");
  });

  const btnIdeas = document.getElementById("btn-meals-ideas-trigger");
  if (btnIdeas) {
    btnIdeas.addEventListener("click", () => {
      isMealGenerationMode = true;
      selectedForMealIdea = [];
      document.querySelector("[data-tab='inventory']").click();
      refreshInventoryList();
      alert("Meal Generation Mode activated! Select the ingredients you feel like eating today, then click 'Generate Meal Idea' at the bottom.");
    });
  }

  // Recipe Details Modal close
  document.getElementById("btn-recipe-modal-close").addEventListener("click", () => {
    document.getElementById("modal-recipe-detail").classList.remove("active");
  });

  modal.classList.add("active");
}

function addIngredientEditorRow(name = "", qty = 0.5, unit = "") {
  const container = document.getElementById("recipe-edit-ingredients-container");
  const row = document.createElement("div");
  row.className = "ingredient-input-row";
  
  let qtyVal = parseFloat(qty) || 0.5;
  if (qtyVal > 1.0) qtyVal = 1.0;
  
  row.innerHTML = `
    <input type="text" class="form-control ing-row-name" placeholder="Item name" value="${name}" list="inventory-suggestions" style="flex:2.5;">
    <select class="form-control ing-row-qty" style="flex:1.5; text-align:center;">
      <option value="0.125" ${Math.abs(qtyVal - 0.125) < 0.05 ? 'selected' : ''}>1/8</option>
      <option value="0.25" ${Math.abs(qtyVal - 0.25) < 0.05 ? 'selected' : ''}>1/4</option>
      <option value="0.333" ${Math.abs(qtyVal - 0.333) < 0.05 ? 'selected' : ''}>1/3</option>
      <option value="0.5" ${Math.abs(qtyVal - 0.5) < 0.05 ? 'selected' : ''}>1/2</option>
      <option value="0.667" ${Math.abs(qtyVal - 0.667) < 0.05 ? 'selected' : ''}>2/3</option>
      <option value="0.75" ${Math.abs(qtyVal - 0.75) < 0.05 ? 'selected' : ''}>3/4</option>
      <option value="1.0" ${Math.abs(qtyVal - 1.0) < 0.05 ? 'selected' : ''}>Full (100%)</option>
    </select>
    <i class="fas fa-circle-minus" style="color:var(--accent-orange); cursor:pointer; font-size:18px;" onclick="this.closest('.ingredient-input-row').remove()"></i>
  `;
  container.appendChild(row);
}

// ----------------------------------------------------
// 10. PREDICTIVE SHOPPING AI ENGINE
// ----------------------------------------------------
function generatePredictiveShoppingList() {
  const list = [];
  
  // 1. Core items missing for planned meals
  State.recipes.forEach(recipe => {
    const check = checkRecipeIngredientsAvailable(recipe);
    check.missing.forEach(missing => {
      const exists = list.find(l => l.name.toLowerCase() === missing.name.toLowerCase());
      if (!exists) {
        list.push({ name: missing.name, qty: missing.req, unit: missing.unit, reason: "Recipe Ingredient" });
      }
    });
  });

  // 2. Predictive restocking (Items likely consumed based on simulated frequency)
  // Let's check eggs and oil
  const eggMatching = State.inventory.find(i => i.name.toLowerCase().includes("egg"));
  if (!eggMatching) {
    list.push({ name: "Organic Eggs 24ct", qty: 1, unit: "pcs", reason: "AI Purchase cycle: every 10 days" });
  }

  return list;
}

// ----------------------------------------------------
// 11. ANALYTICS & CHARTS
// ----------------------------------------------------
let chartSpendingRef = null;
let chartRatioRef = null;
let chartNutritionRef = null;
let chartDashSpendingRef = null;

function initAnalytics() {
  // Empty bindings
}

function renderAnalyticsCharts() {
  const textSpendVal = State.trips.reduce((acc, c) => acc + c.cost, 0);

  // Check if we use "Starting Estimate"
  const isEstimate = State.trips.length < 3;
  const estLabel = isEstimate ? " <span style='font-size: 10px; color: var(--text-secondary); font-weight: normal; text-transform: none; display: block; margin-top: 2px;'>(Starting Estimate)</span>" : "";

  document.getElementById("stat-anal-total-spend").innerHTML = `$${textSpendVal.toFixed(2)}${estLabel}`;
  
  const wasteLabel = document.getElementById("stat-anal-waste-pct");
  const totalWastedVal = State.wasteLogs.reduce((acc, w) => acc + w.cost, 0);
  const totalBoughtVal = textSpendVal + totalWastedVal;
  const wastePercent = totalBoughtVal > 0 ? (totalWastedVal / totalBoughtVal) * 100 : 0;
  wasteLabel.innerHTML = `${wastePercent.toFixed(1)}%${estLabel}`;

  // Render Lifespan Timeline
  refreshAnalyticsTimeline();

  // Chart 1: Spending Trends
  const ctxSpend = document.getElementById("chart-anal-spending-trend").getContext("2d");
  if (chartSpendingRef) chartSpendingRef.destroy();
  
  chartSpendingRef = new Chart(ctxSpend, {
    type: 'bar',
    data: {
      labels: ['April', 'May', 'June'],
      datasets: [{
        label: 'Spent ($)',
        data: [195.00, 245.20, textSpendVal],
        backgroundColor: 'rgba(46, 184, 114, 0.85)',
        borderRadius: 8
      }, {
        label: 'Budget Limit ($)',
        data: [300, 300, State.user.budgetAmount],
        type: 'line',
        borderColor: 'rgba(10, 10, 15, 0.35)',
        borderDash: [5, 5],
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });

  // Chart 2: Used vs Wasted
  const ctxRatio = document.getElementById("chart-anal-food-ratio").getContext("2d");
  if (chartRatioRef) chartRatioRef.destroy();
  
  chartRatioRef = new Chart(ctxRatio, {
    type: 'pie',
    data: {
      labels: ['Used/Eaten', 'Wasted / Spoiled'],
      datasets: [{
        data: [textSpendVal, totalWastedVal],
        backgroundColor: ['rgba(46, 184, 114, 0.95)', 'rgba(243, 114, 44, 0.95)']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // Chart 3: Macros target
  const ctxNutri = document.getElementById("chart-anal-nutrition").getContext("2d");
  if (chartNutritionRef) chartNutritionRef.destroy();

  chartNutritionRef = new Chart(ctxNutri, {
    type: 'bar',
    data: {
      labels: ['Protein', 'Carbs', 'Fats', 'Fiber', 'Sodium'],
      datasets: [{
        label: 'Actual Intake %',
        data: [85, 92, 70, 45, 110],
        backgroundColor: [
          'rgba(46, 184, 114, 0.85)',
          'rgba(46, 184, 114, 0.85)',
          'rgba(243, 114, 44, 0.85)',
          'rgba(243, 114, 44, 0.85)',
          'rgba(239, 71, 111, 0.85)'
        ],
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          max: 120,
          grid: { display: false }
        },
        y: {
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  // Sync dashboard spending line chart
  const ctxDash = document.getElementById("chart-dash-spending").getContext("2d");
  if (chartDashSpendingRef) chartDashSpendingRef.destroy();

  // Hide dashboard placeholder
  document.getElementById("chart-spending-placeholder").style.display = "none";

  chartDashSpendingRef = new Chart(ctxDash, {
    type: 'line',
    data: {
      labels: ['W1', 'W2', 'W3', 'W4'],
      datasets: [{
        label: 'Weekly Spending',
        data: [54.20, 80.00, 48.50, textSpendVal],
        borderColor: 'rgba(46, 184, 114, 0.95)',
        tension: 0.3,
        fill: true,
        backgroundColor: 'rgba(46, 184, 114, 0.05)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { grid: { display: false } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ----------------------------------------------------
// 12. PROFILE & SETTINGS
// ----------------------------------------------------
function initProfileSettings() {
  // Profile Page Custom Photo Upload with Zoom & Drag Cropper
  const avatarTrigger = document.getElementById("profile-avatar-trigger");
  const profileCardImg = document.getElementById("profile-card-img");
  const profileCardUpload = document.getElementById("profile-card-upload");
  const cropperModal = document.getElementById("modal-image-editor");
  const cropperImg = document.getElementById("cropper-img");
  const zoomSlider = document.getElementById("cropper-zoom-slider");
  const cropperWorkarea = document.getElementById("cropper-workarea");

  let zoom = 1;
  let posX = 0;
  let posY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  const updateCropperTransform = () => {
    cropperImg.style.transform = `translate(${posX}px, ${posY}px) scale(${zoom})`;
  };

  if (avatarTrigger && profileCardUpload) {
    avatarTrigger.addEventListener("click", () => profileCardUpload.click());
    profileCardUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          cropperImg.src = event.target.result;
          
          zoom = 1;
          posX = 0;
          posY = 0;
          zoomSlider.value = 1;
          
          cropperImg.onload = () => {
            const wWidth = cropperWorkarea.clientWidth;
            const wHeight = cropperWorkarea.clientHeight;
            const iWidth = cropperImg.naturalWidth;
            const iHeight = cropperImg.naturalHeight;
            
            const scale = Math.max(180 / iWidth, 180 / iHeight);
            zoom = scale;
            zoomSlider.min = scale;
            zoomSlider.max = scale * 4;
            zoomSlider.value = scale;
            
            posX = (wWidth - iWidth) / 2;
            posY = (wHeight - iHeight) / 2;
            updateCropperTransform();
          };

          cropperModal.classList.add("active");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (cropperWorkarea) {
    const startDrag = (e) => {
      isDragging = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      startX = clientX - posX;
      startY = clientY - posY;
      e.preventDefault();
    };

    const doDrag = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      posX = clientX - startX;
      posY = clientY - startY;
      updateCropperTransform();
    };

    const stopDrag = () => {
      isDragging = false;
    };

    cropperWorkarea.addEventListener("mousedown", startDrag);
    cropperWorkarea.addEventListener("mousemove", doDrag);
    window.addEventListener("mouseup", stopDrag);

    cropperWorkarea.addEventListener("touchstart", startDrag);
    cropperWorkarea.addEventListener("touchmove", doDrag);
    window.addEventListener("touchend", stopDrag);
  }

  if (zoomSlider) {
    zoomSlider.addEventListener("input", (e) => {
      zoom = parseFloat(e.target.value);
      updateCropperTransform();
    });
  }

  document.getElementById("btn-cropper-cancel").onclick = () => {
    cropperModal.classList.remove("active");
  };
  document.getElementById("btn-image-editor-close").onclick = () => {
    cropperModal.classList.remove("active");
  };

  document.getElementById("btn-cropper-save").onclick = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    const ctx = canvas.getContext("2d");

    const wWidth = cropperWorkarea.clientWidth;
    const wHeight = cropperWorkarea.clientHeight;
    
    const circleX = wWidth / 2;
    const circleY = wHeight / 2;

    const iWidth = cropperImg.naturalWidth;
    const iHeight = cropperImg.naturalHeight;

    ctx.beginPath();
    ctx.arc(90, 90, 90, 0, Math.PI * 2);
    ctx.clip();

    const dx = posX - (circleX - 90);
    const dy = posY - (circleY - 90);
    const dw = iWidth * zoom;
    const dh = iHeight * zoom;

    ctx.drawImage(cropperImg, dx, dy, dw, dh);

    const croppedBase64 = canvas.toDataURL("image/png");
    
    State.user.avatar = croppedBase64;
    if (profileCardImg) profileCardImg.src = croppedBase64;
    const headerAvatar = document.getElementById("dash-avatar-img");
    if (headerAvatar) headerAvatar.src = croppedBase64;
    
    saveStateToStorage();
    cropperModal.classList.remove("active");
    alert("Profile photo updated successfully!");
  };

  // Edit Budget Modal Bindings
  const budgetTrigger = document.getElementById("btn-edit-budget-trigger");
  const budgetModal = document.getElementById("modal-edit-budget");
  const budgetClose = document.getElementById("btn-budget-modal-close");
  const budgetSave = document.getElementById("btn-save-budget");
  
  if (budgetTrigger) {
    budgetTrigger.onclick = () => {
      document.getElementById("edit-budget-amount").value = State.user.budgetAmount;
      // Select active grid option
      document.querySelectorAll("#edit-budget-period .grid-option").forEach(opt => {
        if (opt.dataset.val === State.user.budgetPeriod) {
          opt.classList.add("selected");
        } else {
          opt.classList.remove("selected");
        }
      });
      budgetModal.classList.add("active");
    };
  }

  if (budgetClose) {
    budgetClose.onclick = () => {
      budgetModal.classList.remove("active");
    };
  }

  if (budgetSave) {
    budgetSave.onclick = () => {
      const amount = parseFloat(document.getElementById("edit-budget-amount").value) || 200;
      const period = document.querySelector("#edit-budget-period .grid-option.selected").dataset.val;
      
      State.user.budgetAmount = amount;
      State.user.budgetPeriod = period;
      
      saveStateToStorage();
      refreshDashboard();
      budgetModal.classList.add("active");
      alert("Budget updated successfully!");
    };
  }

  // Bind edit budget period options click
  document.querySelectorAll("#edit-budget-period .grid-option").forEach(opt => {
    opt.onclick = () => {
      document.querySelectorAll("#edit-budget-period .grid-option").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
    };
  });

  // Family Sharing Bind
  document.getElementById("btn-profile-family-sharing").onclick = () => {
    document.getElementById("modal-family-sharing").classList.add("active");
  };

  document.getElementById("btn-family-modal-close").onclick = () => {
    document.getElementById("modal-family-sharing").classList.remove("active");
  };

  // Re-adjust goals trigger
  document.getElementById("btn-profile-edit-goals").onclick = () => {
    renderGoalsSetup();
    transitionToPage("page-goals");
    document.getElementById("app-bottom-nav").classList.remove("active");
  };

  // Logout Trigger
  document.getElementById("btn-logout").onclick = () => {
    if (confirm("Are you sure you want to sign out? Data will remain stored locally.")) {
      localStorage.setItem("grocerly_logged_in", "false");
      document.getElementById("app-bottom-nav").classList.remove("active");
      transitionToPage("page-login");
    }
  };

  // Dark Theme Toggle Binds
  const dtToggle = document.getElementById("dark-theme-toggle");
  
  // Set initial toggle switch state based on active class on body
  dtToggle.checked = document.body.classList.contains("dark-theme");

  dtToggle.addEventListener("change", () => {
    if (dtToggle.checked) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("grocerly_theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("grocerly_theme", "light");
    }
  });
}

function refreshProfileCard() {
  document.getElementById("profile-card-name").textContent = State.user.name;
  document.getElementById("profile-card-img").src = State.user.avatar;
  document.getElementById("profile-card-household").textContent = `Household Size: ${State.user.householdSize} People`;
  
  const statusLabel = document.getElementById("profile-family-status");
  statusLabel.textContent = `${State.user.householdSize} Active Member${State.user.householdSize !== 1 ? 's' : ''}`;

  const profileEmailInput = document.getElementById("profile-settings-email");
  if (profileEmailInput) {
    profileEmailInput.value = State.user.email || "";
    profileEmailInput.onchange = (e) => {
      State.user.email = e.target.value;
      saveStateToStorage();
    };
  }

  // Update plan badge and toggle upgrade button
  const planBadge = document.getElementById("profile-plan-badge");
  const premiumBtn = document.getElementById("btn-profile-go-premium");
  if (planBadge) {
    if (State.user.isPremium) {
      planBadge.textContent = "PREMIUM PLAN";
      planBadge.style.backgroundColor = "var(--primary-green-light)";
      planBadge.style.color = "var(--primary-green)";
      if (premiumBtn) premiumBtn.style.display = "none";
    } else {
      planBadge.textContent = "FREE PLAN";
      planBadge.style.backgroundColor = "var(--border-color)";
      planBadge.style.color = "var(--text-secondary)";
      if (premiumBtn) premiumBtn.style.display = "flex";
    }
  }
}

// ----------------------------------------------------
// 13. GLOBAL SEARCH ENGINE
// ----------------------------------------------------
function initGlobalSearch() {
  // Let's capture the search inputs from multiple screens and link them
  // Or we can add an overlay search modal when typing
  const searchContainer = document.getElementById("global-search-container");
  const resultsContainer = document.getElementById("global-search-results");
  const closeBtn = document.getElementById("btn-close-global-search");

  // We bind search inputs in inventory and recipe pages to search globally if they start with "/"
  const inputs = [
    document.getElementById("inventory-search-input"),
    document.getElementById("recipe-search-input")
  ];

  inputs.forEach(input => {
    input.addEventListener("input", (e) => {
      const val = e.target.value;
      if (val.startsWith("/")) {
        // Trigger global search
        searchContainer.classList.add("active");
        renderGlobalSearchResults(val.substring(1));
      } else {
        searchContainer.classList.remove("active");
      }
    });
  });

  closeBtn.addEventListener("click", () => {
    searchContainer.classList.remove("active");
    inputs.forEach(i => i.value = "");
    refreshInventoryList();
    refreshRecipesList();
  });
}

function renderGlobalSearchResults(term) {
  const container = document.getElementById("global-search-results");
  container.innerHTML = "";
  
  if (!term.trim()) {
    container.innerHTML = `<p style="font-size:12px; color:var(--text-secondary);">Type to search across inventory, meals, and receipt history...</p>`;
    return;
  }

  const query = term.toLowerCase();
  const results = [];

  // 1. Search Inventory
  State.inventory.forEach(item => {
    if (item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)) {
      results.push({ name: item.name, subtitle: `${item.currentQty} ${item.unit} in ${item.storageLoc}`, type: "Inventory", action: () => {
        document.querySelector("[data-tab='inventory']").click();
        document.getElementById("inventory-search-input").value = item.name;
        refreshInventoryList();
      }});
    }
  });

  // 2. Search Recipes
  State.recipes.forEach(recipe => {
    if (recipe.name.toLowerCase().includes(query) || recipe.description.toLowerCase().includes(query)) {
      results.push({ name: recipe.name, subtitle: recipe.description, type: "Recipe / Meal", action: () => {
        document.querySelector("[data-tab='meals']").click();
        openRecipeDetailsModal(recipe.id);
      }});
    }
  });

  // 3. Search Trips
  State.trips.forEach(trip => {
    if (trip.store.toLowerCase().includes(query)) {
      results.push({ name: `${trip.store} Shopping Trip`, subtitle: `${trip.date} • Total Spent: $${trip.cost.toFixed(2)}`, type: "Shopping History", action: () => {
        alert(`Shopping Trip Log Detail:\nStore: ${trip.store}\nDate: ${trip.date}\nTotal Cost: $${trip.cost.toFixed(2)}\nItems: ${trip.items.join(", ")}`);
      }});
    }
  });

  if (results.length === 0) {
    container.innerHTML = `<p style="font-size:12px; color:var(--text-secondary); text-align:center; padding: 20px;">No global matches found for "${term}"</p>`;
    return;
  }

  results.forEach(res => {
    const item = document.createElement("div");
    item.className = "search-result-item";
    item.innerHTML = `
      <div class="search-result-info">
        <span class="search-result-name">${res.name}</span>
        <p style="font-size:11px; margin:0;">${res.subtitle}</p>
      </div>
      <span class="recipe-tag">${res.type}</span>
    `;
    item.onclick = () => {
      res.action();
      document.getElementById("global-search-container").classList.remove("active");
    };
    container.appendChild(item);
  });
}

// ----------------------------------------------------
// 14. LOCAL STORAGE CACHING
// ----------------------------------------------------
function saveStateToStorage() {
  localStorage.setItem("grocerly_state_cache", JSON.stringify(State));
  if (typeof updateInventoryDatalist === 'function') {
    updateInventoryDatalist();
  }
  if (State.user.email) {
    ClientAPI.syncBackend().catch(err => console.warn("Background API sync failed:", err));
  }
}

function loadStateFromStorage() {
  // Sync Dark/Light theme option
  const theme = localStorage.getItem("grocerly_theme");
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }

  const cached = localStorage.getItem("grocerly_state_cache");
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      // Merge values safely
      State.user = parsed.user;
      State.customStores = parsed.customStores || [];
      State.inventory = parsed.inventory;
      State.recipes = parsed.recipes;
      State.trips = parsed.trips;
      State.notifications = parsed.notifications;
      State.wasteLogs = parsed.wasteLogs;
      State.activeTab = parsed.activeTab || "dashboard";
      State.firstLaunch = parsed.firstLaunch !== undefined ? parsed.firstLaunch : true;
    } catch (e) {
      console.error("Failed to parse cached state", e);
    }
  }

  // Populate store dropdowns
  populateStoreDropdowns();

  // Attempt server state sync
  const isLoggedIn = localStorage.getItem("grocerly_logged_in") === "true";
  if (isLoggedIn && State.user.email) {
    loadStateFromServer();
  }
}

// ----------------------------------------------------
// 15. CLIENT API SERVICE & SYNC ENGINE
// ----------------------------------------------------
const API_URL = window.location.origin;

const MockBackend = {
  getDb() {
    let db = localStorage.getItem("grocerly_local_db");
    if (!db) {
      // Seed with default data (similar to db.json)
      const defaultDb = {
        users: {
          "jane.doe@gmail.com": {
            password: "password123",
            profile: {
              name: "Jane Doe",
              email: "jane.doe@gmail.com",
              householdSize: 2,
              location: "Philadelphia, PA",
              age: 29,
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
              goals: ["goal_budget", "goal_healthy", "goal_planning", "goal_waste", "goal_preservation"],
              budgetAmount: 300,
              budgetPeriod: "monthly",
              desiredStorageWeeks: 2,
              healthyEatingFoods: ["Vegetables", "Fruit", "Lean Meats"],
              mealPlanningFreq: 5,
              macroGoals: { calories: 2000, protein: 120, carbs: 200, fat: 70 },
              isPremium: false,
              lastAiUseDate: null
            },
            inventory: [
              { id: "inv_1", name: "Organic Chicken Breast", category: "Meat & Poultry", originalQty: 4, currentQty: 4, unit: "pcs", price: 18.50, store: "Costco", purchaseDate: "2026-06-28", expiryDate: "2026-07-01", storageLoc: "Fridge", timesUsed: 0, costPerUnit: 4.63, notes: "Keep in original airtight wrap" },
              { id: "inv_2", name: "Whole Milk 1gal", category: "Dairy & Eggs", originalQty: 1, currentQty: 1, unit: "gal", price: 4.50, store: "Costco", purchaseDate: "2026-06-27", expiryDate: "2026-06-30", storageLoc: "Fridge", timesUsed: 0, costPerUnit: 4.50, notes: "Keep at back of fridge" },
              { id: "inv_3", name: "Avocados", category: "Produce", originalQty: 6, currentQty: 5, unit: "pcs", price: 6.00, store: "Costco", purchaseDate: "2026-06-27", expiryDate: "2026-07-04", storageLoc: "Fridge", timesUsed: 1, costPerUnit: 1.00, notes: "Move to counter if too hard" },
              { id: "inv_4", name: "Organic Spinach", category: "Produce", originalQty: 1, currentQty: 1, unit: "bag", price: 5.00, store: "Costco", purchaseDate: "2026-06-28", expiryDate: "2026-07-02", storageLoc: "Fridge", timesUsed: 0, costPerUnit: 5.00, notes: "Put paper towel inside bag to absorb moisture" },
              { id: "inv_5", name: "Brown Jasmine Rice", category: "Pantry", originalQty: 5, currentQty: 5, unit: "lbs", price: 9.50, store: "Trader Joe's", purchaseDate: "2026-06-15", expiryDate: "2027-06-15", storageLoc: "Pantry", timesUsed: 1, costPerUnit: 1.90, notes: "In airtight container" }
            ],
            recipes: [
              { id: "rec_1", name: "Avocado Toast with Egg", description: "Fast, nutrient-dense breakfast with fresh healthy fats.", ingredients: [{ name: "Avocados", qty: 1, unit: "pcs" }, { name: "Organic Eggs", qty: 2, unit: "pcs" }, { name: "Wheat Bread", qty: 2, unit: "pcs" }], instructions: "Toast the bread. Mash the avocado with a pinch of salt and lime juice. Fry the eggs in a pan. Spread avocado on toast, top with cooked eggs and chili flakes.", nutrition: { calories: 410, protein: 18, fat: 22, carbs: 32 } },
              { id: "rec_2", name: "Grilled Chicken & Rice Bowl", description: "Lean high-protein meal prep classic.", ingredients: [{ name: "Organic Chicken Breast", qty: 1, unit: "pcs" }, { name: "Brown Jasmine Rice", qty: 1, unit: "lbs" }, { name: "Organic Spinach", qty: 0.25, unit: "bag" }], instructions: "Season chicken with garlic powder, paprika, salt, and pepper. Grill chicken for 6 minutes each side. Cook rice according to package. Serve chicken sliced over rice with fresh spinach.", nutrition: { calories: 580, protein: 44, fat: 8, carbs: 76 } },
              { id: "rec_3", name: "Creamy Garlic Spinach Pasta", description: "Simple rich pantry meal with greens.", ingredients: [{ name: "Whole Milk 1gal", qty: 0.1, unit: "gal" }, { name: "Organic Spinach", qty: 0.5, unit: "bag" }, { name: "Jasmine Rice", qty: 0.5, unit: "lbs" }], instructions: "Cook pasta in salted water. In a pan, sauté garlic, pour milk and reduce. Fold in spinach until wilted. Toss in pasta with parmesan cheese.", nutrition: { calories: 490, protein: 16, fat: 12, carbs: 68 } }
            ],
            trips: [
              { id: "trip_1", store: "Costco", date: "2026-06-28", cost: 34.00, items: ["Organic Chicken Breast", "Organic Spinach", "Whole Milk 1gal", "Avocados"], wasted: 0, mealsMade: 2 },
              { id: "trip_2", store: "Trader Joe's", date: "2026-06-15", cost: 48.50, items: ["Brown Jasmine Rice", "Olive Oil", "Ground Beef"], wasted: 4.20, mealsMade: 5 }
            ],
            notifications: [
              { id: "notif_1", text: "Whole Milk 1gal expires tomorrow. Suggest: Freeze or bake today.", urgent: true, read: false, actionType: "freeze", actionTarget: "inv_2" },
              { id: "notif_2", text: "Organic Chicken Breast expires in 2 days. Freeze it now to save $18.50.", urgent: true, read: false, actionType: "freeze", actionTarget: "inv_1" },
              { id: "notif_3", text: "Predictive shopping: Olive Oil is likely running low next week.", urgent: false, read: false }
            ],
            wasteLogs: [
              { id: "w_1", name: "Strawberries 1lb", qty: 1, unit: "box", cost: 4.50, action: "Spoiled", date: "2026-06-20" },
              { id: "w_2", name: "Wheat Bread", qty: 0.5, unit: "box", cost: 1.50, action: "Spoiled", date: "2026-06-24" }
            ]
          }
        }
      };
      localStorage.setItem("grocerly_local_db", JSON.stringify(defaultDb));
      return defaultDb;
    }
    return JSON.parse(db);
  },
  
  saveDb(db) {
    localStorage.setItem("grocerly_local_db", JSON.stringify(db));
  },

  async handleRequest(endpoint, method, body) {
    const db = this.getDb();
    const url = new URL(endpoint, window.location.origin);
    const path = url.pathname;

    if (path === "/api/auth/login" && method === "POST") {
      const { email, password } = body;
      const user = db.users[email];
      if (user && user.password === password) {
        return user;
      }
      throw new Error("Invalid email or password");
    }

    if (path === "/api/auth/signup" && method === "POST") {
      const { email, password } = body;
      if (db.users[email]) {
        throw new Error("User already exists");
      }
      db.users[email] = {
        password: password,
        profile: {
          name: "New Chef",
          email: email,
          householdSize: 1,
          location: "",
          age: null,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
          goals: [],
          budgetAmount: 200,
          budgetPeriod: "monthly",
          desiredStorageWeeks: 2,
          healthyEatingFoods: [],
          mealPlanningFreq: 3,
          macroGoals: { calories: 2000, protein: 100, carbs: 250, fat: 65 }
        },
        inventory: [],
        recipes: [],
        trips: [],
        notifications: [],
        wasteLogs: []
      };
      this.saveDb(db);
      return db.users[email];
    }

    const email = url.searchParams.get("email") || (body && body.email);
    if (!email || !db.users[email]) {
      throw new Error("User not found or unauthorized");
    }

    const user = db.users[email];

    if (path === "/api/profile") {
      if (method === "GET") return user.profile;
      if (method === "PUT") {
        user.profile = { ...user.profile, ...body.profile };
        this.saveDb(db);
        return user.profile;
      }
    }

    if (path === "/api/inventory") {
      if (method === "GET") return user.inventory;
      if (method === "PUT") {
        user.inventory = body.inventory;
        this.saveDb(db);
        return user.inventory;
      }
    }

    if (path === "/api/recipes") {
      if (method === "GET") return user.recipes;
      if (method === "PUT") {
        user.recipes = body.recipes;
        this.saveDb(db);
        return user.recipes;
      }
    }

    if (path === "/api/trips") {
      if (method === "GET") return user.trips;
      if (method === "PUT") {
        user.trips = body.trips;
        this.saveDb(db);
        return user.trips;
      }
    }

    if (path === "/api/waste") {
      if (method === "GET") return user.wasteLogs;
      if (method === "PUT") {
        user.wasteLogs = body.wasteLogs;
        this.saveDb(db);
        return user.wasteLogs;
      }
    }

    if (path === "/api/notifications") {
      if (method === "GET") return user.notifications;
      if (method === "PUT") {
        user.notifications = body.notifications;
        this.saveDb(db);
        return user.notifications;
      }
    }

    if (path === "/api/ocr" && method === "POST") {
      const { store } = body;
      const template = OCR_TEMPLATES[store || "Costco"];
      if (!template) throw new Error("Store template not found");
      const parsed = JSON.parse(JSON.stringify(template));
      parsed.date = new Date().toISOString().split("T")[0];
      return parsed;
    }

    if (path === "/api/ai/intelligence" && method === "GET") {
      return computeLocalAIIntelligence();
    }

    throw new Error("Endpoint not found");
  }
};

const ClientAPI = {
  async request(endpoint, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (body) {
        options.body = JSON.stringify(body);
      }
      const res = await fetch(`${API_URL}${endpoint}`, options);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'API request failed');
      }
      return await res.json();
    } catch (e) {
      console.warn(`API server error on ${endpoint}, falling back to local simulation:`, e.message);
      return MockBackend.handleRequest(endpoint, method, body);
    }
  },

  async syncBackend() {
    if (!State.user.email) return;
    try {
      // Sync profile
      await this.request('/api/profile', 'PUT', { email: State.user.email, profile: State.user });
      // Sync inventory
      await this.request('/api/inventory', 'PUT', { email: State.user.email, inventory: State.inventory });
      // Sync recipes
      await this.request('/api/recipes', 'PUT', { email: State.user.email, recipes: State.recipes });
      // Sync trips
      await this.request('/api/trips', 'PUT', { email: State.user.email, trips: State.trips });
      // Sync waste logs
      await this.request('/api/waste', 'PUT', { email: State.user.email, wasteLogs: State.wasteLogs });
      // Sync notifications
      await this.request('/api/notifications', 'PUT', { email: State.user.email, notifications: State.notifications });
    } catch (e) {
      console.warn("Failed to synchronize backend database:", e.message);
    }
  }
};

async function loadStateFromServer() {
  const email = State.user.email;
  if (!email) return;
  try {
    const profile = await ClientAPI.request(`/api/profile?email=${encodeURIComponent(email)}`);
    const inventory = await ClientAPI.request(`/api/inventory?email=${encodeURIComponent(email)}`);
    const recipes = await ClientAPI.request(`/api/recipes?email=${encodeURIComponent(email)}`);
    const trips = await ClientAPI.request(`/api/trips?email=${encodeURIComponent(email)}`);
    const waste = await ClientAPI.request(`/api/waste?email=${encodeURIComponent(email)}`);
    const notifications = await ClientAPI.request(`/api/notifications?email=${encodeURIComponent(email)}`);

    // Merge into local state
    State.user = { ...State.user, ...profile };
    State.inventory = inventory;
    State.recipes = recipes;
    State.trips = trips;
    State.wasteLogs = waste;
    State.notifications = notifications;

    localStorage.setItem("grocerly_state_cache", JSON.stringify(State));

    // Refresh active views
    const tab = State.activeTab;
    if (tab === "dashboard") refreshDashboard();
    if (tab === "inventory") refreshInventoryList();
    if (tab === "meals") refreshRecipesList();
    if (tab === "analytics") renderAnalyticsCharts();
    if (tab === "profile") refreshProfileCard();
    updateNotificationsBadge();
    console.log("Successfully synchronized state from backend.");
  } catch (error) {
    console.warn("Offline fallback: running in cached local storage mode.", error);
  }
}

// ----------------------------------------------------
// 16. AI KITCHEN ASSISTANT INTERFACES
// ----------------------------------------------------
let aiCachedIntelligence = null;

function initAIAssistant() {
  // Bind open button on dashboard
  const aiBtn = document.getElementById("btn-dashboard-ai");
  if (aiBtn) {
    aiBtn.onclick = () => {
      openAIHubModal();
    };
  }

  // Bind close button
  const closeBtn = document.getElementById("btn-ai-modal-close");
  if (closeBtn) {
    closeBtn.onclick = () => {
      document.getElementById("modal-ai-assistant").classList.remove("active");
    };
  }

  // Bind tabs
  const tabs = document.querySelectorAll(".ai-tab");
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => {
        t.classList.remove("active");
        t.style.background = "transparent";
        t.style.color = "var(--text-secondary)";
      });
      tab.classList.add("active");
      
      const selectedTab = tab.dataset.aitab;
      document.querySelectorAll(".ai-section-panel").forEach(p => p.style.display = "none");
      
      if (selectedTab === "cook") document.getElementById("ai-panel-cook").style.display = "block";
      if (selectedTab === "suggest") document.getElementById("ai-panel-suggest").style.display = "block";
      if (selectedTab === "preserve") document.getElementById("ai-panel-preserve").style.display = "block";
      if (selectedTab === "forecast") document.getElementById("ai-panel-forecast").style.display = "block";
    };
  });

  // Bind import forecast button
  const importBtn = document.getElementById("btn-ai-import-forecast");
  if (importBtn) {
    importBtn.onclick = () => {
      importForecastedShoppingTrip();
    };
  }

  // Bind export forecast button
  const exportBtn = document.getElementById("btn-ai-export-forecast");
  if (exportBtn) {
    exportBtn.onclick = () => {
      exportForecastedList();
    };
  }
}

function checkAiAccess() {
  if (State.user.isPremium) return true;

  // Free tier check: once every 5 days
  if (State.user.lastAiUseDate) {
    const lastUse = new Date(State.user.lastAiUseDate);
    const today = new Date();
    
    // Calculate difference in calendar days (ignoring hours)
    const lastUseDateOnly = new Date(lastUse.getFullYear(), lastUse.getMonth(), lastUse.getDate());
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = todayDateOnly - lastUseDateOnly;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 5) {
      // Show premium upsell modal
      openPremiumModal();
      return false;
    }
  }
  
  // Update last use date and save
  State.user.lastAiUseDate = new Date().toISOString();
  saveStateToStorage();
  // Sync to backend in background
  ClientAPI.request('/api/profile', 'PUT', { email: State.user.email, profile: State.user })
    .catch(err => console.warn("Failed to sync lastAiUseDate to backend:", err));
    
  return true;
}

function openPremiumModal() {
  const modal = document.getElementById("modal-premium");
  if (modal) {
    modal.classList.add("active");
  }
}

function initPremiumSubscription() {
  // Bind profile go premium button click
  const goPremiumBtn = document.getElementById("btn-profile-go-premium");
  if (goPremiumBtn) {
    goPremiumBtn.onclick = () => {
      openPremiumModal();
    };
  }

  // Bind premium modal close
  const closeBtn = document.getElementById("btn-premium-close");
  if (closeBtn) {
    closeBtn.onclick = () => {
      document.getElementById("modal-premium").classList.remove("active");
    };
  }

  // Bind premium subscribe button
  const subscribeBtn = document.getElementById("btn-premium-subscribe");
  if (subscribeBtn) {
    subscribeBtn.onclick = async (e) => {
      e.preventDefault();
      
      const cardNum = document.getElementById("premium-card-number").value;
      const cardExp = document.getElementById("premium-card-expiry").value;
      const cardCvc = document.getElementById("premium-card-cvc").value;
      
      if (!cardNum || !cardExp || !cardCvc) {
        alert("Please fill in all payment details.");
        return;
      }
      
      // Simulate payment processing
      subscribeBtn.disabled = true;
      subscribeBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing Payment...`;
      
      setTimeout(async () => {
        State.user.isPremium = true;
        saveStateToStorage();
        
        // Sync to backend
        try {
          await ClientAPI.request('/api/profile', 'PUT', { email: State.user.email, profile: State.user });
        } catch (err) {
          console.warn("Failed to sync premium status to backend:", err);
        }
        
        subscribeBtn.disabled = false;
        subscribeBtn.innerHTML = `<i class="fas fa-lock"></i> Subscribe for $2.00/mo`;
        
        // Close modal
        document.getElementById("modal-premium").classList.remove("active");
        
        // Refresh UI
        refreshProfileCard();
        refreshDashboard();
        
        alert("🎉 Congratulations! You are now a Premium Member with unlimited AI access!");
      }, 1500);
    };
  }
}

async function openAIHubModal() {
  if (!checkAiAccess()) return; // Blocked! Premium modal shown.

  const modal = document.getElementById("modal-ai-assistant");
  modal.classList.add("active");
  
  // Render loading placeholder
  document.getElementById("ai-cook-list").innerHTML = `<p style='text-align:center; padding:20px; font-size:12px; color:var(--text-secondary);'><i class='fas fa-spinner fa-spin' style='margin-right:6px;'></i>Analyzing kitchen data...</p>`;
  
  try {
    const data = await ClientAPI.request(`/api/ai/intelligence?email=${encodeURIComponent(State.user.email)}`);
    aiCachedIntelligence = data;
    renderAIHubPanels(data);
  } catch (error) {
    console.warn("AI Intelligence endpoint failed, executing offline calculations fallback:", error);
    // Local calculation fallbacks
    const fallbackData = computeLocalAIIntelligence();
    aiCachedIntelligence = fallbackData;
    renderAIHubPanels(fallbackData);
  }
}

function renderAIHubPanels(data) {
  // Panel A: What can I cook?
  const cookList = document.getElementById("ai-cook-list");
  cookList.innerHTML = "";
  if (data.whatCanICook.length === 0) {
    cookList.innerHTML = `<p style="text-align:center; font-size:12px; color:var(--text-secondary); padding: 10px;">No recipes loaded. Create one in Meal Builder!</p>`;
  } else {
    data.whatCanICook.forEach(recipeMatch => {
      const card = document.createElement("div");
      card.className = "ai-card";
      
      let badgeClass = "medium";
      if (recipeMatch.matchPercent >= 100) badgeClass = "high";
      
      let missingList = "";
      if (recipeMatch.missing.length > 0) {
        missingList = `<div style="font-size:11px; color:var(--accent-orange); margin-top:2px;">Missing: ${recipeMatch.missing.map(m => `${m.name} (need ${m.needed} ${m.unit})`).join(", ")}</div>`;
      }
      
      let cookBtnHTML = "";
      if (recipeMatch.isCookable) {
        cookBtnHTML = `
          <div class="ai-card-actions">
            <button class="ai-card-action-btn" onclick="executeAICook('${recipeMatch.id}')">Cook Meal</button>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="ai-card-header">
          <span class="ai-card-title">${recipeMatch.name}</span>
          <span class="ai-card-badge ${badgeClass}">${recipeMatch.matchPercent}% Matched</span>
        </div>
        ${missingList}
        ${cookBtnHTML}
      `;
      cookList.appendChild(card);
    });
  }

  // Panel B: Recipe Suggestions
  const suggestList = document.getElementById("ai-suggest-list");
  suggestList.innerHTML = "";
  data.suggestions.forEach(sug => {
    const card = document.createElement("div");
    card.className = "ai-card";
    card.innerHTML = `
      <div class="ai-card-header">
        <span class="ai-card-title">${sug.name}</span>
        <span class="ai-card-badge high" style="font-size:9px;">HEALTHY RECOM</span>
      </div>
      <p style="font-size:11px; margin: 4px 0 2px 0;">${sug.description}</p>
      <div class="recipe-nutri-summary" style="padding-top:4px; font-size:10px; margin-bottom:0; border-top: none;">
        <span>Kcal: ${sug.nutrition.calories}</span> • <span>Prot: ${sug.nutrition.protein}g</span> • <span>Carbs: ${sug.nutrition.carbs}g</span>
      </div>
      <div class="ai-card-tip">${sug.reason}</div>
    `;
    suggestList.appendChild(card);
  });

  // Panel C: Expiration Preservation tips
  const preserveList = document.getElementById("ai-preserve-list");
  preserveList.innerHTML = "";
  if (data.preservationTips.length === 0) {
    preserveList.innerHTML = `
      <div class="empty-state" style="padding:15px;">
        <i class="fas fa-circle-check" style="font-size: 24px; color: var(--primary-green);"></i>
        <p style="font-size:12px; margin:0;">All products in storage are healthy! Expiry alerts will show up here.</p>
      </div>
    `;
  } else {
    data.preservationTips.forEach(tip => {
      const card = document.createElement("div");
      card.className = "ai-card";
      
      let actionBtnHTML = "";
      if (tip.actionType === "freeze") {
        actionBtnHTML = `
          <div class="ai-card-actions">
            <button class="ai-card-action-btn" onclick="triggerAIFreeze('${tip.itemId}')"><i class="fas fa-snowflake"></i> Freeze Now</button>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="ai-card-header">
          <span class="ai-card-title">${tip.itemName}</span>
          <span class="ai-card-badge medium">${tip.daysLeft} days left</span>
        </div>
        <div class="ai-card-tip spoilage">
          <i class="fas fa-triangle-exclamation"></i> ${tip.tip}
        </div>
        ${actionBtnHTML}
      `;
      preserveList.appendChild(card);
    });
  }

  // Panel D: Shopping Forecast
  const forecastList = document.getElementById("ai-forecast-list");
  forecastList.innerHTML = "";
  if (data.shoppingForecast.length === 0) {
    forecastList.innerHTML = `<p style="text-align:center; font-size:12px; color:var(--text-secondary); padding:20px;">No restocking forecast predicted.</p>`;
  } else {
    data.shoppingForecast.forEach(item => {
      const card = document.createElement("div");
      card.className = "ai-card";
      card.innerHTML = `
        <div class="ai-card-header">
          <span class="ai-card-title">${item.name}</span>
          <span class="ai-card-badge high" style="font-size: 9px; font-family: monospace;">${item.qtyNeeded} ${item.unit}</span>
        </div>
        <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
          <span>Category: ${item.category}</span>
          <br>
          <span style="font-weight:600; color:var(--primary-green); font-size:10px;"><i class="fas fa-bolt"></i> Reason: ${item.reason}</span>
        </div>
      `;
      forecastList.appendChild(card);
    });
  }
}

function executeAICook(recipeId) {
  const recipe = State.recipes.find(r => r.id === recipeId);
  if (recipe) {
    deductRecipeIngredients(recipe);
    document.getElementById("modal-ai-assistant").classList.remove("active");
  }
}

function triggerAIFreeze(itemId) {
  const item = State.inventory.find(i => i.id === itemId);
  if (item) {
    item.storageLoc = "Freezer";
    const expiry = new Date(item.expiryDate);
    expiry.setDate(expiry.getDate() + 180); // +6 months
    item.expiryDate = expiry.toISOString().split("T")[0];
    
    // Clear expiring notifications if match
    State.notifications = State.notifications.filter(n => n.actionTarget !== itemId);
    
    saveStateToStorage();
    refreshDashboard();
    refreshInventoryList();
    
    // Re-trigger AI Hub Modal refresh
    openAIHubModal();
    alert(`Moved ${item.name} to the Freezer and extended freshness by 6 months.`);
  }
}

function importForecastedShoppingTrip() {
  if (!aiCachedIntelligence || aiCachedIntelligence.shoppingForecast.length === 0) return;
  
  let importedCount = 0;
  let totalCost = 0;
  const itemsList = [];
  
  aiCachedIntelligence.shoppingForecast.forEach((forecast, idx) => {
    // Generate simulated details
    const price = Math.random() * 8 + 2;
    totalCost += price;
    
    const pDate = new Date();
    const expiry = new Date();
    const limitDays = USDA_SHELF_LIFE[forecast.category] ? USDA_SHELF_LIFE[forecast.category].fridge : 7;
    expiry.setDate(pDate.getDate() + limitDays);

    const newItem = {
      id: `inv_${Date.now()}_ai_import_${idx}`,
      name: forecast.name,
      category: forecast.category === "General" ? "Pantry" : forecast.category,
      originalQty: forecast.qtyNeeded,
      currentQty: forecast.qtyNeeded,
      unit: forecast.unit,
      price: price,
      store: "Smart Restock Hub",
      purchaseDate: pDate.toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
      storageLoc: forecast.category === "Pantry" ? "Pantry" : "Fridge",
      timesUsed: 0,
      costPerUnit: price / forecast.qtyNeeded,
      notes: "Imported via Grocerly AI Restock Hub"
    };

    State.inventory.unshift(newItem);
    itemsList.push(forecast.name);
    importedCount++;
  });

  // Log Trip
  State.trips.unshift({
    id: "trip_" + Date.now(),
    store: "AI Restock Hub",
    date: new Date().toISOString().split("T")[0],
    cost: totalCost,
    items: itemsList,
    wasted: 0,
    mealsMade: 0
  });

  saveStateToStorage();
  refreshDashboard();
  refreshInventoryList();
  
  document.getElementById("modal-ai-assistant").classList.remove("active");
  alert(`Imported ${importedCount} forecasted ingredients into inventory! logged trip for $${totalCost.toFixed(2)}.`);
}

function computeLocalAIIntelligence() {
  // A. What Can I Cook?
  const whatCanICook = [];
  State.recipes.forEach(recipe => {
    let missing = [];
    recipe.ingredients.forEach(reqIng => {
      const match = State.inventory.filter(inv => inv.name.toLowerCase().includes(reqIng.name.toLowerCase()));
      const stocked = match.reduce((sum, curr) => sum + curr.currentQty, 0);
      if (stocked < reqIng.qty) {
        missing.push({
          name: reqIng.name,
          needed: reqIng.qty,
          have: stocked,
          unit: reqIng.unit
        });
      }
    });

    const matchPercent = Math.max(0, Math.floor(((recipe.ingredients.length - missing.length) / recipe.ingredients.length) * 100));
    whatCanICook.push({
      id: recipe.id,
      name: recipe.name,
      matchPercent: matchPercent,
      missing: missing,
      isCookable: missing.length === 0
    });
  });
  whatCanICook.sort((a, b) => b.matchPercent - a.matchPercent);

  // B. Suggestions
  const suggestions = [];
  const healthyGoals = State.user.healthyEatingFoods || [];
  if (healthyGoals.includes("Vegetables") || healthyGoals.includes("Fruit")) {
    suggestions.push({
      name: "Crispy Sesame Tofu & Broccoli",
      description: "High-fiber vegetable stir-fry with plant protein and toasted sesame sauce.",
      nutrition: { calories: 340, protein: 16, fat: 14, carbs: 38 },
      reason: "Matches your goal to eat more Vegetables"
    });
  }
  suggestions.push({
    name: "Spinach Avocado Berry Salad",
    description: "Packed with antioxidants, fresh greens, and rich healthy monounsaturated fats.",
    nutrition: { calories: 290, protein: 5, fat: 18, carbs: 24 },
    reason: "Matches your goal to eat more Produce & Healthy Fats"
  });

  // C. Preservation
  const preservationTips = [];
  const today = new Date();
  State.inventory.forEach(item => {
    const daysLeft = Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3 && item.storageLoc === "Fridge") {
      preservationTips.push({
        itemName: item.name,
        daysLeft: daysLeft,
        tip: item.category === "Meat & Poultry" ? "High risk of spoilage. Move directly to the Freezer to lock in freshness." : "Sauté or prepare immediately to prevent food waste.",
        actionType: item.category === "Meat & Poultry" || item.category === "Dairy & Eggs" ? "freeze" : "cook",
        itemId: item.id
      });
    }
  });

  // D. Forecast
  const shoppingForecast = [];
  State.inventory.forEach(item => {
    const daysLeft = Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 1 || item.currentQty <= item.originalQty * 0.25) {
      shoppingForecast.push({
        name: item.name,
        category: item.category,
        qtyNeeded: Math.max(1, item.originalQty - item.currentQty),
        unit: item.unit,
        reason: "Quantity running low"
      });
    }
  });

  const eggs = State.inventory.find(i => i.name.toLowerCase().includes("egg"));
  if (!eggs) {
    shoppingForecast.push({
      name: "Organic Eggs 24ct",
      category: "Dairy & Eggs",
      qtyNeeded: 1,
      unit: "pcs",
      reason: "10-day replenishment model"
    });
  }

  return {
    whatCanICook,
    suggestions,
    preservationTips,
    shoppingForecast
  };
}

function refreshAnalyticsTimeline() {
  const timeline = document.getElementById("analytics-lifespan-timeline");
  if (!timeline) return;
  timeline.innerHTML = "";
  
  // Active items timeline
  const activeItems = State.inventory.slice(0, 3);
  activeItems.forEach(item => {
    const pDate = new Date(item.purchaseDate);
    const eDate = new Date(item.expiryDate);
    const today = new Date();
    const totalDays = Math.max(1, Math.ceil((eDate - pDate) / (1000 * 60 * 60 * 24)));
    const elapsedDays = Math.max(0, Math.ceil((today - pDate) / (1000 * 60 * 60 * 24)));
    const pct = Math.min(100, Math.floor((elapsedDays / totalDays) * 100));
    
    const itemDiv = document.createElement("div");
    itemDiv.className = "timeline-item";
    itemDiv.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-item-title">
          <span>${item.name}</span>
          <span style="color: var(--primary-green); font-size: 11px;">Active (${pct}% used)</span>
        </div>
        <div class="timeline-item-dates">
          Purchased: ${item.purchaseDate} • Expires: ${item.expiryDate}
        </div>
        <div class="timeline-progress-track">
          <div class="timeline-progress-bar" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
    timeline.appendChild(itemDiv);
  });
  
  // Mock consumed items for history
  const mockHistory = [
    { name: "Organic Strawberries 1lb", purchaseDate: "2026-06-12", usedDate: "2026-06-18", days: 6 },
    { name: "Wheat Bread", purchaseDate: "2026-06-15", usedDate: "2026-06-22", days: 7 },
    { name: "Ground Beef 2lbs", purchaseDate: "2026-06-15", usedDate: "2026-06-19", days: 4 }
  ];
  
  mockHistory.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "timeline-item";
    itemDiv.innerHTML = `
      <div class="timeline-dot exhausted"></div>
      <div class="timeline-content" style="opacity: 0.8;">
        <div class="timeline-item-title">
          <span>${item.name}</span>
          <span style="color: var(--text-secondary); font-size: 11px;">Finished (${item.days} days)</span>
        </div>
        <div class="timeline-item-dates">
          Purchased: ${item.purchaseDate} • Finished: ${item.usedDate}
        </div>
      </div>
    `;
    timeline.appendChild(itemDiv);
  });
}

function exportForecastedList() {
  if (!aiCachedIntelligence || !aiCachedIntelligence.shoppingForecast || aiCachedIntelligence.shoppingForecast.length === 0) {
    alert("No items in the shopping list to export.");
    return;
  }
  
  // Draw the shopping list to a canvas and download as PNG
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  const headerHeight = 120;
  const itemHeight = 60;
  const footerHeight = 80;
  const listCount = aiCachedIntelligence.shoppingForecast.length;
  canvas.height = headerHeight + (listCount * itemHeight) + footerHeight;
  
  const ctx = canvas.getContext("2d");
  
  // 1. Draw Background
  ctx.fillStyle = "#f7f7f9";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 2. Draw Header
  ctx.fillStyle = "#2eb872"; // Primary Green
  ctx.fillRect(0, 0, canvas.width, headerHeight);
  
  // Header Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px Arial, sans-serif";
  ctx.fillText("GROCERLY SHOPPING LIST", 40, 55);
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.font = "14px Arial, sans-serif";
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  ctx.fillText(`Prepared on: ${todayStr}`, 40, 85);
  
  // 3. Draw Items
  let y = headerHeight;
  aiCachedIntelligence.shoppingForecast.forEach((item, idx) => {
    // Background row alternating colors
    ctx.fillStyle = idx % 2 === 0 ? "#ffffff" : "#fbfbfb";
    ctx.fillRect(0, y, canvas.width, itemHeight);
    
    // Divider
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y + itemHeight);
    ctx.lineTo(canvas.width, y + itemHeight);
    ctx.stroke();
    
    // Draw Checkbox
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, y + 18, 24, 24);
    
    // Draw Item Name
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 15px Arial, sans-serif";
    ctx.fillText(`${item.name} (${item.qtyNeeded} ${item.unit})`, 85, y + 35);
    
    // Draw Category & Reason
    ctx.fillStyle = "#64748b";
    ctx.font = "11px Arial, sans-serif";
    ctx.fillText(`${item.category} • ${item.reason}`, 85, y + 51);
    
    y += itemHeight;
  });
  
  // 4. Draw Footer
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, y, canvas.width, footerHeight);
  
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Arial, sans-serif";
  ctx.fillText("Grocerly", 40, y + 45);
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "12px Arial, sans-serif";
  ctx.fillText("Buy Smarter. Waste Less.", 115, y + 45);
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "12px Arial, sans-serif";
  ctx.fillText("grocerly.app", canvas.width - 120, y + 45);
  
  // 5. Download Image
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `grocerly-shopping-list-${new Date().toISOString().split("T")[0]}.png`;
  link.href = dataUrl;
  link.click();
}

window.toggleMealGenerationSelection = function(e, id) {
  e.stopPropagation();
  if (selectedForMealIdea.includes(id)) {
    selectedForMealIdea = selectedForMealIdea.filter(i => i !== id);
  } else {
    selectedForMealIdea.push(id);
  }
  refreshInventoryList();
  
  const fab = document.getElementById("btn-generate-selected-meal");
  if (fab) {
    if (selectedForMealIdea.length > 0) {
      fab.style.display = "flex";
    } else {
      fab.style.display = "none";
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const fab = document.getElementById("btn-generate-selected-meal");
  if (fab) {
    fab.addEventListener('click', () => {
      generateMealIdea();
    });
  }
});

function generateMealIdea() {
  if (selectedForMealIdea.length === 0) {
    alert("Please select at least one ingredient to generate a meal idea.");
    return;
  }
  
  const selected = State.inventory.filter(i => selectedForMealIdea.includes(i.id));
  
  const names = selected.map(i => i.name.split(" ")[0]);
  const mealName = "Automated " + names.join(" & ") + " Bowl";
  
  document.getElementById("recipe-modal-title").textContent = "Generated Recipe Idea";
  document.getElementById("recipe-name").value = mealName;
  document.getElementById("recipe-time").value = "25";
  document.getElementById("recipe-type").value = "Dinner";
  document.getElementById("recipe-instructions").value = "1. Prepare your ingredients.\n2. Combine and cook until done.\n3. Serve hot!";
  
  recipeIngredients = selected.map(item => ({
    id: Date.now() + Math.random().toString().slice(2,8),
    name: item.name,
    qty: 1,
    unit: item.unit
  }));
  renderRecipeIngredients();
  editingRecipeId = null;
  
  // Turn off generation mode
  isMealGenerationMode = false;
  selectedForMealIdea = [];
  const fab = document.getElementById("btn-generate-selected-meal");
  if(fab) fab.style.display = "none";
  
  // Route back to meals
  document.querySelector("[data-tab='meals']").click();
  document.getElementById("modal-recipe-detail").classList.add("active");
}
  
/* ==================================================== */
/* PURCHASES RECEIPT FOLDERS SYSTEM */
/* ==================================================== */
window.refreshPurchasesFolders = function() {
  const grid = document.getElementById("purchases-folders-grid");
  if (!grid) return;
  grid.innerHTML = "";

  // Group trips by store name
  const storeGroups = {};
  State.trips.forEach(trip => {
    const store = trip.store || "Other Stores";
    if (!storeGroups[store]) {
      storeGroups[store] = [];
    }
    storeGroups[store].push(trip);
  });

  // Folder 1: All Receipts
  const allFolder = document.createElement("div");
  allFolder.className = "receipt-folder-card";
  allFolder.innerHTML = `
    <i class="fas fa-folder-closed receipt-folder-icon"></i>
    <div class="receipt-folder-name">All Receipts</div>
    <div class="receipt-folder-count">${State.trips.length} Record${State.trips.length !== 1 ? 's' : ''}</div>
  `;
  allFolder.onclick = () => showFolderReceipts("All Receipts", State.trips);
  grid.appendChild(allFolder);

  // Grouped Folders by Store
  Object.keys(storeGroups).forEach(storeName => {
    const folder = document.createElement("div");
    folder.className = "receipt-folder-card";
    
    let iconClass = "fa-folder-closed";
    const nameLower = storeName.toLowerCase();
    if (nameLower.includes("costco")) iconClass = "fa-warehouse";
    else if (nameLower.includes("walmart")) iconClass = "fa-store";
    else if (nameLower.includes("trader")) iconClass = "fa-basket-shopping";
    else if (nameLower.includes("aldi")) iconClass = "fa-shop";
    else if (nameLower.includes("target")) iconClass = "fa-bullseye";
    else if (nameLower.includes("whole")) iconClass = "fa-carrot";
    
    folder.innerHTML = `
      <i class="fas ${iconClass} receipt-folder-icon" style="color: var(--primary-green);"></i>
      <div class="receipt-folder-name">${storeName}</div>
      <div class="receipt-folder-count">${storeGroups[storeName].length} Record${storeGroups[storeName].length !== 1 ? 's' : ''}</div>
    `;
    folder.onclick = () => showFolderReceipts(storeName, storeGroups[storeName]);
    grid.appendChild(folder);
  });
};

window.showFolderReceipts = function(folderName, receipts) {
  const container = document.getElementById("folder-receipts-container");
  const title = document.getElementById("folder-receipts-title");
  const list = document.getElementById("folder-receipts-list");
  
  if (!container || !list) return;

  title.textContent = `${folderName} Receipts`;
  list.innerHTML = "";

  if (receipts.length === 0) {
    list.innerHTML = `<p style="font-size:12px; color:var(--text-secondary); text-align:center; padding:10px;">No receipt records in this folder.</p>`;
  } else {
    receipts.forEach(receipt => {
      const row = document.createElement("div");
      row.className = "receipt-list-row";
      row.innerHTML = `
        <div class="receipt-row-meta">
          <span class="receipt-row-store">${receipt.store}</span>
          <span class="receipt-row-date">${receipt.date}</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="receipt-row-cost">$${receipt.cost.toFixed(2)}</span>
          <span class="recipe-tag" style="font-size:9px; border:none; background-color:var(--primary-green-light); color:var(--primary-green); padding:2px 6px;">View Items</span>
          <i class="fas fa-trash receipt-delete-btn" style="color: var(--accent-orange); font-size: 14px; padding: 4px; cursor: pointer;"></i>
        </div>
      `;
      row.onclick = () => {
        alert(`Receipt Details:\nStore: ${receipt.store}\nDate: ${receipt.date}\nTotal Cost: $${receipt.cost.toFixed(2)}\n\nItems Bought:\n${receipt.items.map(item => `- ${item}`).join("\n")}`);
      };
      
      const trashBtn = row.querySelector('.receipt-delete-btn');
      if (trashBtn) {
        trashBtn.onclick = (e) => {
          e.stopPropagation();
          if(confirm("Are you sure you want to delete this receipt? This will permanently remove its record.")) {
            const index = State.trips.indexOf(receipt);
            if(index > -1) {
              State.trips.splice(index, 1);
              saveStateToStorage();
              refreshPurchasesFolders();
              const currentFolderTrips = folderName === "All Receipts" ? State.trips : State.trips.filter(t => (t.store || "Other Stores") === folderName);
              showFolderReceipts(folderName, currentFolderTrips);
              if (typeof updateBudgetStats === 'function') updateBudgetStats();
            }
          }
        };
      }
      
      list.appendChild(row);
    });
  }

  container.style.display = "block";
  container.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

// Bind close folder button
const closeFolderBtn = document.getElementById("btn-close-folder-receipts");
if (closeFolderBtn) {
  closeFolderBtn.onclick = () => {
    document.getElementById("folder-receipts-container").style.display = "none";
  };
}


document.addEventListener('DOMContentLoaded', () => {
  const btnGrocTrigger = document.getElementById('btn-inventory-add-trigger');
  const modalGroc = document.getElementById('modal-add-grocery');
  const btnGrocClose = document.getElementById('btn-add-grocery-close');
  const btnGrocSave = document.getElementById('btn-groc-save');
  
  if (btnGrocTrigger && modalGroc) {
    btnGrocTrigger.addEventListener('click', () => {
      modalGroc.classList.add('active');
      const scrollArrow = document.getElementById('groc-scroll-arrow');
      if (scrollArrow) scrollArrow.style.opacity = '0.8';
      const modalContent = document.querySelector('#modal-add-grocery .modal-content');
      if (modalContent) {
        modalContent.scrollTop = 0;
        setTimeout(() => {
          if (modalContent.scrollHeight <= modalContent.clientHeight) {
            if (scrollArrow) scrollArrow.style.opacity = '0';
          }
        }, 150);
      }
    });
  }
  if (btnGrocClose && modalGroc) {
    btnGrocClose.addEventListener('click', () => modalGroc.classList.remove('active'));
  }
  const btnIdeasGlobal = document.getElementById('btn-meals-ideas-trigger');
  if (btnIdeasGlobal) {
    btnIdeasGlobal.addEventListener('click', () => {
      isMealGenerationMode = true;
      selectedForMealIdea = [];
      document.querySelector("[data-tab='inventory']").click();
      refreshInventoryList();
      alert("Meal Generation Mode activated! Select the ingredients you feel like eating today, then click 'Generate Meal Idea' at the bottom.");
    });
  }

  // Bind option grids in new modal
  if(typeof bindOptionGrid === 'function') {
    bindOptionGrid('#groc-cat-grid');
    bindOptionGrid('#groc-loc-grid');
  }

  if (btnGrocSave) {
    btnGrocSave.addEventListener('click', () => {
      const name = document.getElementById('groc-name').value.trim();
      const price = parseFloat(document.getElementById('groc-price').value) || 0;
      const date = document.getElementById('groc-date-purchase').value || new Date().toISOString().split('T')[0];
      const notes = document.getElementById('groc-notes').value.trim();
      const qty = parseQuantityValue(document.getElementById('groc-qty').value) || 1;
      const unit = document.getElementById('groc-unit').value || 'pcs';
      const manualExp = document.getElementById('groc-date-exp').value;
      let store = document.getElementById('groc-store').value;
      if (store === 'Other') {
        const customStore = document.getElementById('groc-store-other').value.trim();
        if (!customStore) return alert('Please enter the custom store name.');
        store = customStore;
        if (!State.customStores.includes(store)) {
          State.customStores.push(store);
          populateStoreDropdowns();
        }
      }
      
      const catEl = document.querySelector('#groc-cat-grid .grid-option.selected');
      const locEl = document.querySelector('#groc-loc-grid .grid-option.selected');
      const category = catEl ? catEl.dataset.cat : 'Other';
      const location = locEl ? locEl.dataset.cat : 'Fridge';

      if (!name) return alert('Please enter an ingredient name.');

      // Calculate pseudo expiry or use manual
      let finalExpDate = manualExp;
      let isEstimatedDate = false;
      if (!finalExpDate) {
        const purchaseDateObj = new Date(date);
        let expiryDays = 7;
        if (location === 'Freezer') expiryDays = 60;
        if (location === 'Pantry') expiryDays = 30;
        const expiryDateObj = new Date(purchaseDateObj.getTime() + expiryDays * 24 * 60 * 60 * 1000);
        finalExpDate = expiryDateObj.toISOString().split('T')[0];
        isEstimatedDate = true;
      }

      State.inventory.push({
        id: "inv_" + Date.now().toString(),
        name: name,
        category: category,
        storageLoc: location,
        purchaseDate: date,
        expiryDate: finalExpDate,
        isEstimatedDate: isEstimatedDate,
        store: store,
        price: price,
        costPerUnit: price / qty,
        originalQty: qty,
        currentQty: qty,
        unit: unit,
        timesUsed: 0,
        notes: notes
      });

      saveStateToStorage();

      // Reset filters so the new item is guaranteed to show
      activeInventoryFilter = "All";
      document.querySelectorAll(".loc-tabs .loc-tab").forEach(t => t.classList.remove("active"));
      const allLocTab = document.querySelector(".loc-tabs .loc-tab[data-location='All']");
      if (allLocTab) allLocTab.classList.add("active");

      document.querySelectorAll("#inventory-category-chips .filter-chip").forEach(c => {
        c.classList.remove("active");
        c.style.background = "var(--bg-card)";
        c.style.color = "var(--text-secondary)";
        c.style.borderColor = "var(--border-color)";
      });
      const allCatChip = document.querySelector("#inventory-category-chips .filter-chip[data-category='All']");
      if (allCatChip) {
        allCatChip.classList.add("active");
        allCatChip.style.background = "var(--primary-green)";
        allCatChip.style.color = "white";
        allCatChip.style.borderColor = "var(--primary-green)";
      }
      
      const searchInput = document.getElementById("inventory-search-input");
      if (searchInput) searchInput.value = "";

      if (typeof refreshInventoryList === 'function') refreshInventoryList();
      alert(name + " successfully added to inventory!");
      modalGroc.classList.remove('active');
    });
  }
});

window.openEditGroceryModal = function(id) {
  const item = State.inventory.find(i => i.id === id);
  if (!item) return;

  document.getElementById('edit-groc-id').value = item.id;
  document.getElementById('edit-groc-name').value = item.name;
  document.getElementById('edit-groc-price').value = item.price;
  document.getElementById('edit-groc-date-purchase').value = item.purchaseDate;
  document.getElementById('edit-groc-notes').value = item.notes || '';
  const editQtyInput = document.getElementById('edit-groc-qty');
  if (editQtyInput) {
    if (item.unit === 'fraction') {
      editQtyInput.type = 'text';
      editQtyInput.value = formatQuantityValue(item.currentQty, item.unit);
    } else {
      editQtyInput.type = 'number';
      editQtyInput.value = item.currentQty;
    }
  }
  document.getElementById('edit-groc-unit').value = item.unit || 'pcs';
  document.getElementById('edit-groc-date-exp').value = item.expiryDate;
  document.getElementById('edit-groc-store').value = item.store || 'Unknown';

  // Set category
  document.querySelectorAll('#edit-groc-cat-grid .grid-option').forEach(el => el.classList.remove('selected'));
  const catEl = document.querySelector(`#edit-groc-cat-grid .grid-option[data-cat="${item.category}"]`);
  if (catEl) catEl.classList.add('selected');

  // Set location
  document.querySelectorAll('#edit-groc-loc-grid .grid-option').forEach(el => el.classList.remove('selected'));
  const locEl = document.querySelector(`#edit-groc-loc-grid .grid-option[data-cat="${item.storageLoc}"]`);
  if (locEl) locEl.classList.add('selected');

  document.getElementById('modal-edit-grocery').classList.add('active');

  // Reset scroll indicator
  const scrollArrow = document.getElementById('edit-groc-scroll-arrow');
  if (scrollArrow) scrollArrow.style.opacity = '0.8';
  const modalContent = document.querySelector('#modal-edit-grocery .modal-content');
  if (modalContent) {
    modalContent.scrollTop = 0;
    setTimeout(() => {
      if (modalContent.scrollHeight <= modalContent.clientHeight) {
        if (scrollArrow) scrollArrow.style.opacity = '0';
      }
    }, 150);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Bind Option Grids for Edit Modal
  if(typeof bindOptionGrid === 'function') {
    bindOptionGrid('#edit-groc-cat-grid');
    bindOptionGrid('#edit-groc-loc-grid');
  }

  // Bind scroll listener for bouncing scroll indicator arrow
  const modalContent = document.querySelector('#modal-edit-grocery .modal-content');
  const scrollArrow = document.getElementById('edit-groc-scroll-arrow');
  if (modalContent && scrollArrow) {
    modalContent.addEventListener('scroll', () => {
      const scrollHeight = modalContent.scrollHeight;
      const scrollTop = modalContent.scrollTop;
      const clientHeight = modalContent.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 20) {
        scrollArrow.style.opacity = '0';
        scrollArrow.style.transform = 'scale(0.8)';
      } else {
        scrollArrow.style.opacity = '0.8';
        scrollArrow.style.transform = 'scale(1)';
      }
    });
  }

  const btnEditClose = document.getElementById('btn-edit-grocery-close');
  if (btnEditClose) {
    btnEditClose.addEventListener('click', () => {
      document.getElementById('modal-edit-grocery').classList.remove('active');
    });
  }

  const btnEditSave = document.getElementById('btn-edit-groc-save');
  if (btnEditSave) {
    btnEditSave.addEventListener('click', () => {
      const id = document.getElementById('edit-groc-id').value;
      const itemIndex = State.inventory.findIndex(i => i.id === id);
      if (itemIndex === -1) return;

      const item = State.inventory[itemIndex];
      item.name = document.getElementById('edit-groc-name').value.trim();
      item.price = parseFloat(document.getElementById('edit-groc-price').value) || 0;
      item.purchaseDate = document.getElementById('edit-groc-date-purchase').value;
      item.notes = document.getElementById('edit-groc-notes').value.trim();
      const qty = parseQuantityValue(document.getElementById('edit-groc-qty').value) || 1;
      item.currentQty = qty;
      item.originalQty = Math.max(item.originalQty, qty);
      item.unit = document.getElementById('edit-groc-unit').value;
      let store = document.getElementById('edit-groc-store').value;
      if (store === 'Other') {
        const customStore = document.getElementById('edit-groc-store-other').value.trim();
        if (!customStore) return alert('Please enter the custom store name.');
        store = customStore;
        if (!State.customStores.includes(store)) {
          State.customStores.push(store);
          populateStoreDropdowns();
        }
      }
      item.store = store;
      
      const newExpDate = document.getElementById('edit-groc-date-exp').value;
      if (newExpDate && newExpDate !== item.expiryDate) {
        item.expiryDate = newExpDate;
        item.isEstimatedDate = false; // Manually changed, no longer estimated
      }

      const catEl = document.querySelector('#edit-groc-cat-grid .grid-option.selected');
      if (catEl) item.category = catEl.dataset.cat;

      const locEl = document.querySelector('#edit-groc-loc-grid .grid-option.selected');
      if (locEl) item.storageLoc = locEl.dataset.cat;

      item.costPerUnit = item.price / item.currentQty;

      saveStateToStorage();
      refreshInventoryList();
      alert('Grocery item updated!');
      document.getElementById('modal-edit-grocery').classList.remove('active');
    });
  }

  // Done Shopping Logic
  const btnDoneShoppingTrig = document.getElementById('btn-inventory-done-shopping');
  const modalDoneShopping = document.getElementById('modal-done-shopping');
  const btnDoneClose = document.getElementById('btn-done-shopping-close');
  const btnDoneCalc = document.getElementById('btn-done-shopping-calculate');

  if (btnDoneShoppingTrig && modalDoneShopping) {
    btnDoneShoppingTrig.addEventListener('click', () => {
      document.getElementById('done-shopping-result').style.display = 'none';
      modalDoneShopping.classList.add('active');
    });
  }

  if (btnDoneClose) {
    btnDoneClose.addEventListener('click', () => modalDoneShopping.classList.remove('active'));
  }

  if (btnDoneCalc) {
    btnDoneCalc.addEventListener('click', () => {
      const store = document.getElementById('done-shopping-store').value;
      
      // Calculate total for items bought at this store
      let total = 0;
      State.inventory.forEach(item => {
        if (item.store === store) {
          total += item.price;
        }
      });

      const resDiv = document.getElementById('done-shopping-result');
      const resText = document.getElementById('done-shopping-result-text');
      resText.innerText = `Your total at ${store} is $${total.toFixed(2)}`;
      resDiv.style.display = 'block';
    });
  }
});

window.toggleCalendarDayExpand = function(btn) {
  const row = btn.closest('.calendar-day-row');
  if(row) {
    const slots = row.querySelectorAll('.calendar-meal-slot');
    let isExpanded = false;
    slots.forEach(slot => {
      if(slot.classList.contains('expanded')) isExpanded = true;
    });
    
    slots.forEach(slot => {
      if (isExpanded) slot.classList.remove('expanded');
      else slot.classList.add('expanded');
    });

    if (isExpanded) {
      btn.classList.remove('fa-chevron-up');
      btn.classList.add('fa-chevron-down');
    } else {
      btn.classList.remove('fa-chevron-down');
      btn.classList.add('fa-chevron-up');
    }
  }
};

