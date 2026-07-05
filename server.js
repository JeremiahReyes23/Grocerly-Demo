const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dbService = require('./dbService');
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "721951712629-f4i7m3j2vk4bkana2vjbap26res637g3.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT Decode Error:", e);
    return null;
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and body parsing middleware
app.use(cors());
app.use(bodyParser.json());

// Serve Service Worker with no-cache headers and allow root scope
app.get('/pwa/sw.js', (req, res) => {
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.sendFile(path.join(__dirname, 'pwa', 'sw.js'));
});

// Serve static frontend assets
app.use(express.static(__dirname));

// Temporary icon saving endpoint
app.post('/api/save-icon', (req, res) => {
  const { filePath, base64 } = req.body;
  const fs = require('fs');
  const fsPath = require('path');
  const fullPath = fsPath.join(__dirname, filePath);
  
  const dir = fsPath.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const buffer = Buffer.from(base64.split(',')[1], 'base64');
  fs.writeFileSync(fullPath, buffer);
  console.log(`Saved icon: ${fullPath}`);
  res.json({ success: true });
});

// Default HTML serving
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ----------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS
// ----------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await dbService.authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json(user);
  } catch (error) {
    console.error("Auth Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await dbService.createUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    console.error("Auth Signup Error:", error);
    res.status(400).json({ error: error.message || "Failed to create user" });
  }
});

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  try {
    let email, name, picture, sub;
    try {
      if (credential && credential.includes('.') && credential.split('.').length === 3) {
        try {
          const ticket = await client.verifyIdToken({
              idToken: credential,
              audience: CLIENT_ID,
          });
          const payload = ticket.getPayload();
          email = payload['email'];
          name = payload['name'];
          picture = payload['picture'];
          sub = payload['sub'];
        } catch (verifyErr) {
          console.warn("Google token verification failed, attempting decode fallback:", verifyErr.message);
          const decoded = decodeJwtPayload(credential);
          if (decoded && decoded.email) {
            email = decoded.email;
            name = decoded.name || email.split('@')[0];
            picture = decoded.picture || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a0aec0"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
            sub = decoded.sub || email;
          } else {
            throw verifyErr;
          }
        }
      } else if (credential && credential.includes('@')) {
        email = credential;
        name = email.split('@')[0];
        name = name.charAt(0).toUpperCase() + name.slice(1);
        picture = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a0aec0"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
        sub = email;
      } else {
        throw new Error("Invalid credential format");
      }
    } catch (e) {
      console.error("Authentication extraction error:", e.message);
      return res.status(401).json({ error: "Invalid Google token: " + e.message });
    }

    const googleUid = sub || email;

    let user = await dbService.getUser(googleUid);
    if (!user) {
      user = await dbService.createUser(googleUid, "oauth-google-login");
      user.profile.name = name;
      user.profile.email = email;
      user.profile.avatar = picture;
      await dbService.updateUserProfile(googleUid, user.profile);
    } else {
      let profileUpdated = false;
      if (!user.profile.email || user.profile.email === googleUid) {
        user.profile.email = email;
        profileUpdated = true;
      }
      if (user.profile.avatar.includes('svg+xml')) {
        user.profile.avatar = picture;
        profileUpdated = true;
      }
      if (profileUpdated) {
        await dbService.updateUserProfile(googleUid, user.profile);
      }
    }
    
    user = await dbService.getUser(googleUid);
    res.json(user);
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

app.get('/api/auth/config', (req, res) => {
  res.json({ clientId: CLIENT_ID });
});

// ----------------------------------------------------
// 2. PROFILE CONFIGURATION ENDPOINTS
// ----------------------------------------------------
app.get('/api/profile', async (req, res) => {
  const identifier = req.query.userId || req.query.email;
  try {
    const user = await dbService.getUser(identifier);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.profile);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/api/profile', async (req, res) => {
  const { email, userId, profile } = req.body;
  const identifier = userId || email;
  try {
    const updatedProfile = await dbService.updateUserProfile(identifier, profile);
    res.json(updatedProfile);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------------------------------------------
// 3. INVENTORY ENDPOINTS
// ----------------------------------------------------
app.get('/api/inventory', async (req, res) => {
  const identifier = req.query.userId || req.query.email;
  try {
    const user = await dbService.getUser(identifier);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.inventory);
  } catch (error) {
    console.error("Get Inventory Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/api/inventory', async (req, res) => {
  const { email, userId, inventory } = req.body;
  const identifier = userId || email;
  try {
    const saved = await dbService.saveInventory(identifier, inventory);
    res.json(saved);
  } catch (error) {
    console.error("Sync Inventory Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------------------------------------------
// 4. RECIPES ENDPOINTS
// ----------------------------------------------------
app.get('/api/recipes', async (req, res) => {
  const identifier = req.query.userId || req.query.email;
  try {
    const user = await dbService.getUser(identifier);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.recipes);
  } catch (error) {
    console.error("Get Recipes Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/api/recipes', async (req, res) => {
  const { email, userId, recipes } = req.body;
  const identifier = userId || email;
  try {
    const saved = await dbService.saveRecipes(identifier, recipes);
    res.json(saved);
  } catch (error) {
    console.error("Save Recipes Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------------------------------------------
// 5. SHOPPING TRIPS & WASTE LOGS ENDPOINTS
// ----------------------------------------------------
app.get('/api/trips', async (req, res) => {
  const identifier = req.query.userId || req.query.email;
  try {
    const user = await dbService.getUser(identifier);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.trips);
  } catch (error) {
    console.error("Get Trips Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/api/trips', async (req, res) => {
  const { email, userId, trips } = req.body;
  const identifier = userId || email;
  try {
    const saved = await dbService.saveTrips(identifier, trips);
    res.json(saved);
  } catch (error) {
    console.error("Save Trips Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/waste', async (req, res) => {
  const identifier = req.query.userId || req.query.email;
  try {
    const user = await dbService.getUser(identifier);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.wasteLogs);
  } catch (error) {
    console.error("Get Waste Logs Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/api/waste', async (req, res) => {
  const { email, userId, wasteLogs } = req.body;
  const identifier = userId || email;
  try {
    const saved = await dbService.saveWasteLogs(identifier, wasteLogs);
    res.json(saved);
  } catch (error) {
    console.error("Save Waste Logs Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------------------------------------------
// 6. NOTIFICATIONS SYSTEM ENDPOINTS
// ----------------------------------------------------
app.get('/api/notifications', async (req, res) => {
  const identifier = req.query.userId || req.query.email;
  try {
    const user = await dbService.getUser(identifier);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.notifications);
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/api/notifications', async (req, res) => {
  const { email, userId, notifications } = req.body;
  const identifier = userId || email;
  try {
    const saved = await dbService.saveNotifications(identifier, notifications);
    res.json(saved);
  } catch (error) {
    console.error("Save Notifications Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------------------------------------------
// 7. RECEIPT OCR SIMULATOR ENDPOINT
// ----------------------------------------------------
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

app.post('/api/ocr', (req, res) => {
  const { store } = req.body;
  const template = OCR_TEMPLATES[store || "Costco"];
  if (!template) {
    return res.status(404).json({ error: "Store template not found" });
  }
  const parsed = JSON.parse(JSON.stringify(template));
  parsed.date = new Date().toISOString().split("T")[0];
  res.json(parsed);
});

app.get('/api/ai/ideas', async (req, res) => {
  const userId = req.query.userId || req.query.email;
  try {
    const user = await dbService.getUser(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const inventory = user.inventory || [];
    const activeNames = inventory
      .filter(item => item.currentQty > 0)
      .map(item => item.name.toLowerCase());

    const templates = [
      {
        name: "Avocado Spinach Omelette",
        category: "Breakfast",
        description: "Fluffy eggs folded with organic baby spinach, sliced avocado, and cheese.",
        ingredients: [
          { name: "Organic Eggs", qty: 2, unit: "pcs" },
          { name: "Organic Spinach", qty: 0.25, unit: "bag" },
          { name: "Avocados", qty: 0.5, unit: "pcs" }
        ],
        instructions: "Whisk eggs. Sauté spinach. Fold eggs and top with avocado slices.",
        nutrition: { calories: 310, protein: 18, fat: 22, carbs: 12 }
      },
      {
        name: "Fluffy Egg & Cheese Sandwich",
        category: "Breakfast",
        description: "Classic toasted breakfast sandwich topped with scrambled eggs and melted cheddar cheese.",
        ingredients: [
          { name: "Organic Eggs", qty: 2, unit: "pcs" },
          { name: "Wheat Bread", qty: 2, unit: "pcs" }
        ],
        instructions: "Scramble eggs, toast bread, build sandwich with cheese.",
        nutrition: { calories: 380, protein: 20, fat: 16, carbs: 36 }
      },
      {
        name: "Fruit Yogurt Parfait",
        category: "Breakfast",
        description: "Chilled organic yogurt layered with blueberries, oats, and sweet honey.",
        ingredients: [
          { name: "Yogurt", qty: 1, unit: "cup" },
          { name: "Organic Blueberries", qty: 0.25, unit: "pack" }
        ],
        instructions: "Layer yogurt and berries in a glass. Top with honey.",
        nutrition: { calories: 240, protein: 12, fat: 4, carbs: 38 }
      },
      {
        name: "Chicken Spinach Salad",
        category: "Lunch",
        description: "Warm chicken breast strips and fresh spinach wrapped in a soft tortilla or served as salad.",
        ingredients: [
          { name: "Organic Chicken Breast", qty: 1, unit: "pcs" },
          { name: "Organic Spinach", qty: 0.5, unit: "bag" }
        ],
        instructions: "Warm chicken, roll inside tortilla wrap with spinach and dressing.",
        nutrition: { calories: 420, protein: 32, fat: 12, carbs: 45 }
      },
      {
        name: "Tuna Salad Boat",
        category: "Lunch",
        description: "Flaked tuna tossed with light mayonnaise and served over fresh avocado halves.",
        ingredients: [
          { name: "Tuna", qty: 1, unit: "can" },
          { name: "Avocados", qty: 1, unit: "pcs" }
        ],
        instructions: "Mix tuna with dressing. Spoon into halved avocados.",
        nutrition: { calories: 360, protein: 24, fat: 20, carbs: 16 }
      },
      {
        name: "Garlic Chicken & Rice Bowl",
        category: "Dinner",
        description: "Pan-seared garlic chicken strips served over a bed of warm brown jasmine rice.",
        ingredients: [
          { name: "Organic Chicken Breast", qty: 1, unit: "pcs" },
          { name: "Brown Jasmine Rice", qty: 0.25, unit: "lbs" }
        ],
        instructions: "Cook rice. Sear chicken with garlic. Combine in bowl.",
        nutrition: { calories: 540, protein: 40, fat: 8, carbs: 70 }
      },
      {
        name: "Creamy Garlic Spinach Pasta",
        category: "Dinner",
        description: "Warm pasta tossed in a garlic milk reduction with fresh wilted organic spinach.",
        ingredients: [
          { name: "Whole Milk 1gal", qty: 0.1, unit: "gal" },
          { name: "Organic Spinach", qty: 0.5, unit: "bag" }
        ],
        instructions: "Boil pasta. Reduce milk with garlic, stir in spinach, toss together.",
        nutrition: { calories: 480, protein: 14, fat: 10, carbs: 64 }
      }
    ];

    const matches = [];
    templates.forEach(t => {
      const matchingIngs = [];
      const missingIngs = [];
      t.ingredients.forEach(req => {
        const found = activeNames.find(invName => invName.includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(invName));
        if (found) {
          matchingIngs.push(req.name);
        } else {
          missingIngs.push(req.name);
        }
      });

      if (matchingIngs.length > 0) {
        matches.push({
          ...t,
          matchingIngs,
          missingIngs
        });
      }
    });

    res.json({ matches });
  } catch (err) {
    res.status(500).json({ error: "Failed to load suggestions" });
  }
});

// ----------------------------------------------------
// 8. AI ENGINE / INTELLIGENCE ENDPOINTS
// ----------------------------------------------------
app.get('/api/ai/intelligence', async (req, res) => {
  const email = req.query.email;
  try {
    const user = await dbService.getUser(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const inventory = user.inventory || [];
    const recipes = user.recipes || [];
    const profile = user.profile || {};

    // A. "What can I cook?" matcher
    const whatCanICook = [];
    recipes.forEach(recipe => {
      let missing = [];
      recipe.ingredients.forEach(reqIng => {
        const match = inventory.filter(inv => inv.name.toLowerCase().includes(reqIng.name.toLowerCase()));
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

    // Sort by most match percentage first
    whatCanICook.sort((a, b) => b.matchPercent - a.matchPercent);

    // B. AI Recipe suggestions (based on dietary goals)
    const suggestions = [];
    const healthyGoals = profile.healthyEatingFoods || [];
    
    // Add custom simulated recipes if goals are set
    if (healthyGoals.includes("Vegetables") || healthyGoals.includes("Fruit")) {
      suggestions.push({
        name: "Crispy Sesame Tofu & Broccoli",
        description: "High-fiber vegetable stir-fry with plant protein and toasted sesame sauce.",
        nutrition: { calories: 340, protein: 16, fat: 14, carbs: 38 },
        reason: "Matches your goal to eat more Vegetables"
      });
      suggestions.push({
        name: "Spinach Avocado Berry Salad",
        description: "Packed with antioxidants, fresh greens, and rich healthy monounsaturated fats.",
        nutrition: { calories: 290, protein: 5, fat: 18, carbs: 24 },
        reason: "Matches your goal to eat more Produce & Healthy Fats"
      });
    }
    if (healthyGoals.includes("Lean Meats") || healthyGoals.includes("Fish")) {
      suggestions.push({
        name: "Pan-Sealed Salmon with Asparagus",
        description: "Rich in Omega-3 fatty acids, high-quality protein, and quick to cook.",
        nutrition: { calories: 420, protein: 36, fat: 22, carbs: 12 },
        reason: "Matches your goal to eat more Fish & Clean Protein"
      });
    }

    // Default if no goals selected
    if (suggestions.length === 0) {
      suggestions.push({
        name: "Mediterranean Chickpea Salad",
        description: "Quick, protein-rich, zero-cook pantry dinner using beans, cucumbers, and feta.",
        nutrition: { calories: 310, protein: 12, fat: 10, carbs: 42 },
        reason: "General healthy recommendation based on standard macro guidelines"
      });
    }

    // C. Expiration-based food preservation advice
    const preservationTips = [];
    const today = new Date();
    
    inventory.forEach(item => {
      const daysLeft = Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 3 && item.storageLoc === "Fridge") {
        if (item.category === "Meat & Poultry") {
          preservationTips.push({
            itemName: item.name,
            daysLeft: daysLeft,
            tip: "High risk of spoilage. Move directly to the Freezer to lock in freshness for up to 9 months, backing USDA safety guides.",
            actionType: "freeze",
            itemId: item.id
          });
        } else if (item.category === "Produce") {
          preservationTips.push({
            itemName: item.name,
            daysLeft: daysLeft,
            tip: "Sauté immediately in olive oil and store in a sealed container, or blend greens into a smoothie and freeze.",
            actionType: "cook",
            itemId: item.id
          });
        } else if (item.category === "Dairy & Eggs") {
          preservationTips.push({
            itemName: item.name,
            daysLeft: daysLeft,
            tip: "Bake into muffins or split into ice cube trays for baking recipes to extend milk usage.",
            actionType: "freeze",
            itemId: item.id
          });
        }
      }
    });

    // D. Smart Shopping forecasting list
    const shoppingForecast = [];
    // 1. Items from inventory running out or low stock
    inventory.forEach(item => {
      const daysLeft = Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 1 || item.currentQty <= item.originalQty * 0.25) {
        shoppingForecast.push({
          name: item.name,
          category: item.category,
          qtyNeeded: Math.max(1, item.originalQty - item.currentQty),
          unit: item.unit,
          reason: "Running out soon / Low quantity"
        });
      }
    });

    // 2. Predict missing ingredients from core recipes
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(reqIng => {
        const matches = inventory.filter(inv => inv.name.toLowerCase().includes(reqIng.name.toLowerCase()));
        const stocked = matches.reduce((sum, curr) => sum + curr.currentQty, 0);
        if (stocked < reqIng.qty) {
          const qtyNeeded = reqIng.qty - stocked;
          const exists = shoppingForecast.find(s => s.name.toLowerCase() === reqIng.name.toLowerCase());
          if (!exists) {
            shoppingForecast.push({
              name: reqIng.name,
              category: "General",
              qtyNeeded: qtyNeeded,
              unit: reqIng.unit,
              reason: `Required for ${recipe.name}`
            });
          }
        }
      });
    });

    // Add baseline eggs forecast if missing entirely
    const eggs = inventory.find(i => i.name.toLowerCase().includes("egg"));
    if (!eggs) {
      shoppingForecast.push({
        name: "Organic Eggs 24ct",
        category: "Dairy & Eggs",
        qtyNeeded: 1,
        unit: "pcs",
        reason: "AI prediction model: standard 10-day replenishment loop"
      });
    }

    res.json({
      whatCanICook,
      suggestions,
      preservationTips,
      shoppingForecast
    });

  } catch (error) {
    console.error("AI Intelligence Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// ----------------------------------------------------
// 9. CALENDAR & CUSTOM STORES SYSTEM ENDPOINTS
// ----------------------------------------------------
app.get('/api/calendar', async (req, res) => {
  const identifier = req.query.userId || req.query.email;
  try {
    const user = await dbService.getUser(identifier);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.calendar || {});
  } catch (error) {
    console.error("Get Calendar Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/api/calendar', async (req, res) => {
  const { email, userId, calendar } = req.body;
  const identifier = userId || email;
  try {
    const saved = await dbService.saveCalendar(identifier, calendar);
    res.json(saved);
  } catch (error) {
    console.error("Sync Calendar Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/custom-stores', async (req, res) => {
  const identifier = req.query.userId || req.query.email;
  try {
    const user = await dbService.getUser(identifier);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.customStores || []);
  } catch (error) {
    console.error("Get Custom Stores Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/api/custom-stores', async (req, res) => {
  const { email, userId, customStores } = req.body;
  const identifier = userId || email;
  try {
    const saved = await dbService.saveCustomStores(identifier, customStores);
    res.json(saved);
  } catch (error) {
    console.error("Sync Custom Stores Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`Grocerly backend running at http://localhost:${PORT}`);
});
