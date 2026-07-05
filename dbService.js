const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Interface-like service layer for Grocerly database operations.
// Swapping this to Supabase, Firebase, or PostgreSQL would only require changing the implementations inside these methods.
class DatabaseService {
  constructor() {
    this.cachedData = null;
    this.dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'db.json');
    this._initializePath();
  }

  _initializePath() {
    try {
      const dir = path.dirname(this.dbPath);
      const fsSync = require('fs');
      
      // Seed default db if not existing and directory is writable
      if (!fsSync.existsSync(this.dbPath)) {
        fsSync.writeFileSync(this.dbPath, JSON.stringify({ users: {} }, null, 2), 'utf-8');
      } else {
        // Try opening it for writing
        fsSync.appendFileSync(this.dbPath, '');
      }
    } catch (e) {
      console.warn("DB directory or file is read-only. Falling back database storage path to system tmpdir:", e.message);
      this.dbPath = path.join(os.tmpdir(), 'grocerly-db.json');
      
      const fsSync = require('fs');
      if (!fsSync.existsSync(this.dbPath)) {
        try {
          fsSync.writeFileSync(this.dbPath, JSON.stringify({ users: {} }, null, 2), 'utf-8');
        } catch (err) {
          console.error("Critical: Could not initialize database in system tmpdir:", err.message);
        }
      }
    }
  }

  // Helper: Read db file
  async _readData() {
    try {
      const raw = await fs.readFile(this.dbPath, 'utf-8');
      return JSON.parse(raw);
    } catch (error) {
      console.error("DB Service Error [ReadData]:", error);
      return { users: {} };
    }
  }

  // Helper: Save db file
  async _writeData(data) {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error("DB Service Error [WriteData]:", error);
      return false;
    }
  }

  _getUserKey(data, identifier) {
    if (!identifier) return null;
    if (data.users[identifier]) return identifier;
    // Scan users for email matching identifier
    const foundKey = Object.keys(data.users).find(k => data.users[k].profile && data.users[k].profile.email === identifier);
    if (foundKey) return foundKey;
    return identifier;
  }

  // Get user profile data or initialize default user state
  async getUser(identifier) {
    const data = await this._readData();
    const userKey = this._getUserKey(data, identifier);
    const user = data.users[userKey];
    if (!user) return null;
    return {
      email: user.profile.email,
      googleUid: user.googleUid || (userKey.includes('@') ? null : userKey),
      profile: user.profile,
      inventory: user.inventory || [],
      recipes: user.recipes || [],
      trips: user.trips || [],
      notifications: user.notifications || [],
      wasteLogs: user.wasteLogs || [],
      calendar: user.calendar || {},
      customStores: user.customStores || []
    };
  }

  // Authenticate user
  async authenticateUser(email, password) {
    const data = await this._readData();
    const userKey = this._getUserKey(data, email);
    const user = data.users[userKey];
    if (!user) return null;
    if (user.password === password) {
      return this.getUser(userKey);
    }
    return null;
  }

  // Register / create a new user profile
  async createUser(email, password) {
    const data = await this._readData();
    if (data.users[email]) {
      throw new Error("User already exists");
    }

    // Default structure for new users
    data.users[email] = {
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
        macroGoals: { calories: 2000, protein: 100, carbs: 250, fat: 65 },
        isPremium: false,
        lastAiUseDate: null
      },
      inventory: [],
      recipes: [],
      trips: [],
      notifications: [],
      wasteLogs: [],
      calendar: {},
      customStores: []
    };

    await this._writeData(data);
    return this.getUser(email);
  }

  // Update profile goals & answers
  async updateUserProfile(email, profileUpdate) {
    const data = await this._readData();
    const userKey = this._getUserKey(data, email);
    if (!data.users[userKey]) throw new Error("User not found");
    
    data.users[userKey].profile = {
      ...data.users[userKey].profile,
      ...profileUpdate
    };
    
    await this._writeData(data);
    return data.users[userKey].profile;
  }

  // Update entire inventory
  async saveInventory(email, inventory) {
    const data = await this._readData();
    const userKey = this._getUserKey(data, email);
    if (!data.users[userKey]) throw new Error("User not found");
    
    data.users[userKey].inventory = inventory;
    await this._writeData(data);
    return inventory;
  }

  // Update recipes
  async saveRecipes(email, recipes) {
    const data = await this._readData();
    const userKey = this._getUserKey(data, email);
    if (!data.users[userKey]) throw new Error("User not found");
    
    data.users[userKey].recipes = recipes;
    await this._writeData(data);
    return recipes;
  }

  // Update trips list
  async saveTrips(email, trips) {
    const data = await this._readData();
    const userKey = this._getUserKey(data, email);
    if (!data.users[userKey]) throw new Error("User not found");
    
    data.users[userKey].trips = trips;
    await this._writeData(data);
    return trips;
  }

  // Update notifications list
  async saveNotifications(email, notifications) {
    const data = await this._readData();
    const userKey = this._getUserKey(data, email);
    if (!data.users[userKey]) throw new Error("User not found");
    
    data.users[userKey].notifications = notifications;
    await this._writeData(data);
    return notifications;
  }

  // Update food waste logs
  async saveWasteLogs(email, wasteLogs) {
    const data = await this._readData();
    const userKey = this._getUserKey(data, email);
    if (!data.users[userKey]) throw new Error("User not found");
    
    data.users[userKey].wasteLogs = wasteLogs;
    await this._writeData(data);
    return wasteLogs;
  }

  // Update calendar
  async saveCalendar(email, calendar) {
    const data = await this._readData();
    const userKey = this._getUserKey(data, email);
    if (!data.users[userKey]) throw new Error("User not found");
    
    data.users[userKey].calendar = calendar;
    await this._writeData(data);
    return calendar;
  }

  // Update custom stores
  async saveCustomStores(email, customStores) {
    const data = await this._readData();
    const userKey = this._getUserKey(data, email);
    if (!data.users[userKey]) throw new Error("User not found");
    
    data.users[userKey].customStores = customStores;
    await this._writeData(data);
    return customStores;
  }

  // Admin panel database methods
  async getAllUsers() {
    const data = await this._readData();
    const list = [];
    for (const k in data.users) {
      const user = data.users[k];
      const profile = user.profile || {};
      
      // Determine online/active vs offline status
      const now = new Date();
      let isActive = false;
      if (profile.lastSync) {
        const syncDate = new Date(profile.lastSync);
        const diffHrs = Math.abs(now - syncDate) / 36e5;
        isActive = diffHrs <= 48; // active if synced in last 48 hours
      }

      list.push({
        email: profile.email || k,
        name: profile.name || "Unknown",
        householdSize: profile.householdSize || 1,
        age: profile.age || null,
        location: profile.location || "Unknown",
        budgetAmount: profile.budgetAmount || 200,
        avatar: profile.avatar || "",
        inventoryCount: user.inventory ? user.inventory.length : 0,
        recipesCount: user.recipes ? user.recipes.length : 0,
        tripsCount: user.trips ? user.trips.length : 0,
        lastSync: profile.lastSync || "No Sync Yet",
        isActive: isActive
      });
    }
    return list;
  }

  async getFeedback() {
    const data = await this._readData();
    return data.feedback || [
      { id: "fb_1", email: "guest@grocerly.app", name: "Guest Chef", message: "Love the OCR receipt scanner, it reads characters beautifully!", date: "2026-07-04" },
      { id: "fb_2", email: "jane.doe@gmail.com", name: "Jane Doe", message: "It would be great to have barcode scanning in the future too.", date: "2026-07-05" }
    ];
  }

  async submitFeedback(email, name, message) {
    const data = await this._readData();
    if (!data.feedback) data.feedback = [];
    const f = {
      id: `fb_${Date.now()}`,
      email,
      name: name || "Anonymous",
      message,
      date: new Date().toISOString().split("T")[0]
    };
    data.feedback.push(f);
    await this._writeData(data);
    return f;
  }
}

module.exports = new DatabaseService();
