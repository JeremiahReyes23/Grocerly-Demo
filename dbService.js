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

  // Get user profile data or initialize default user state
  async getUser(email) {
    const data = await this._readData();
    const user = data.users[email];
    if (!user) return null;
    return {
      email: user.profile.email,
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
    const user = data.users[email];
    if (!user) return null;
    if (user.password === password) {
      return this.getUser(email);
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
    if (!data.users[email]) throw new Error("User not found");
    
    data.users[email].profile = {
      ...data.users[email].profile,
      ...profileUpdate
    };
    
    await this._writeData(data);
    return data.users[email].profile;
  }

  // Update entire inventory
  async saveInventory(email, inventory) {
    const data = await this._readData();
    if (!data.users[email]) throw new Error("User not found");
    
    data.users[email].inventory = inventory;
    await this._writeData(data);
    return inventory;
  }

  // Update recipes
  async saveRecipes(email, recipes) {
    const data = await this._readData();
    if (!data.users[email]) throw new Error("User not found");
    
    data.users[email].recipes = recipes;
    await this._writeData(data);
    return recipes;
  }

  // Update trips list
  async saveTrips(email, trips) {
    const data = await this._readData();
    if (!data.users[email]) throw new Error("User not found");
    
    data.users[email].trips = trips;
    await this._writeData(data);
    return trips;
  }

  // Update notifications list
  async saveNotifications(email, notifications) {
    const data = await this._readData();
    if (!data.users[email]) throw new Error("User not found");
    
    data.users[email].notifications = notifications;
    await this._writeData(data);
    return notifications;
  }

  // Update food waste logs
  async saveWasteLogs(email, wasteLogs) {
    const data = await this._readData();
    if (!data.users[email]) throw new Error("User not found");
    
    data.users[email].wasteLogs = wasteLogs;
    await this._writeData(data);
    return wasteLogs;
  }

  // Update calendar
  async saveCalendar(email, calendar) {
    const data = await this._readData();
    if (!data.users[email]) throw new Error("User not found");
    
    data.users[email].calendar = calendar;
    await this._writeData(data);
    return calendar;
  }

  // Update custom stores
  async saveCustomStores(email, customStores) {
    const data = await this._readData();
    if (!data.users[email]) throw new Error("User not found");
    
    data.users[email].customStores = customStores;
    await this._writeData(data);
    return customStores;
  }
}

module.exports = new DatabaseService();
