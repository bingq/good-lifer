import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  ACHIEVEMENTS: "@good_lifer:achievements",
  TREE_HOLE_ENTRIES: "@good_lifer:tree_hole_entries",
  CATEGORIES: "@good_lifer:categories",
  USER_PROFILE: "@good_lifer:user_profile",
  GREETING_SHOWN: "@good_lifer:greeting_shown",
  PROJECTS: "@good_lifer:projects",
} as const;

export interface Achievement {
  id: string;
  date: string; // ISO string
  category: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  projectId?: string; // Optional link to project
  createdAt: number; // timestamp
}

export interface TreeHoleEntry {
  id: string;
  date: string; // ISO string
  content: string;
  createdAt: number; // timestamp
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  visible?: boolean; // Whether category is visible in selector
  order?: number; // Display order
  isDefault?: boolean; // Whether it's a default category (cannot be deleted)
}

export interface UserProfile {
  name: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  progress: number; // 0-100
  totalTime: number; // in minutes
  target?: string; // optional target description
  status: "active" | "completed";
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  completedAt?: number; // timestamp when completed
}

export interface Project {
  id: string;
  name: string;
  category: string; // Category ID
  progress: number; // 0-100
  totalTime: number; // Total minutes invested
  target?: string; // Optional target description
  status: "active" | "completed";
  createdAt: number;
  updatedAt: number;
  completedAt?: number; // Timestamp when completed
}

// Achievement Storage
export async function saveAchievements(achievements: Achievement[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (error) {
    console.error("Error saving achievements:", error);
    throw error;
  }
}

export async function loadAchievements(): Promise<Achievement[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading achievements:", error);
    return [];
  }
}

export async function addAchievement(achievement: Omit<Achievement, "id" | "createdAt">): Promise<Achievement> {
  const newAchievement: Achievement = {
    ...achievement,
    id: `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };

  const achievements = await loadAchievements();
  achievements.push(newAchievement);
  await saveAchievements(achievements);

  return newAchievement;
}

export async function updateAchievement(id: string, updates: Partial<Achievement>): Promise<void> {
  const achievements = await loadAchievements();
  const index = achievements.findIndex((a) => a.id === id);

  if (index !== -1) {
    achievements[index] = { ...achievements[index], ...updates };
    await saveAchievements(achievements);
  }
}

export async function deleteAchievement(id: string): Promise<void> {
  const achievements = await loadAchievements();
  const filtered = achievements.filter((a) => a.id !== id);
  await saveAchievements(filtered);
}

export async function getAchievementsByDate(date: string): Promise<Achievement[]> {
  const achievements = await loadAchievements();
  return achievements.filter((a) => a.date === date);
}

export async function getAchievementsByDateRange(startDate: string, endDate: string): Promise<Achievement[]> {
  const achievements = await loadAchievements();
  return achievements.filter((a) => a.date >= startDate && a.date <= endDate);
}

// Tree Hole Storage
export async function saveTreeHoleEntries(entries: TreeHoleEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TREE_HOLE_ENTRIES, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving tree hole entries:", error);
    throw error;
  }
}

export async function loadTreeHoleEntries(): Promise<TreeHoleEntry[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TREE_HOLE_ENTRIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading tree hole entries:", error);
    return [];
  }
}

export async function addTreeHoleEntry(content: string, date: string): Promise<TreeHoleEntry> {
  const newEntry: TreeHoleEntry = {
    id: `tree_hole_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date,
    content,
    createdAt: Date.now(),
  };

  const entries = await loadTreeHoleEntries();
  entries.push(newEntry);
  await saveTreeHoleEntries(entries);

  return newEntry;
}

export async function updateTreeHoleEntry(id: string, content: string): Promise<void> {
  const entries = await loadTreeHoleEntries();
  const index = entries.findIndex((e) => e.id === id);

  if (index !== -1) {
    entries[index].content = content;
    await saveTreeHoleEntries(entries);
  }
}

export async function deleteTreeHoleEntry(id: string): Promise<void> {
  const entries = await loadTreeHoleEntries();
  const filtered = entries.filter((e) => e.id !== id);
  await saveTreeHoleEntries(filtered);
}

export async function getTreeHoleEntriesByDate(date: string): Promise<TreeHoleEntry[]> {
  const entries = await loadTreeHoleEntries();
  return entries.filter((e) => e.date === date);
}

// Category Storage
export const DEFAULT_CATEGORIES: Category[] = [
  { id: "learning", name: "Learning", color: "#2196F3", icon: "book", visible: true, order: 0, isDefault: true },
  { id: "sports_exercise", name: "Sports & Exercise", color: "#F44336", icon: "fitness", visible: true, order: 1, isDefault: true },
  { id: "business", name: "Business", color: "#FF9800", icon: "work", visible: true, order: 2, isDefault: true },
  // Keep old category IDs for backward compatibility
  { id: "study", name: "Study", color: "#2196F3", icon: "book", visible: false, order: 10, isDefault: true },
  { id: "exercise", name: "Exercise", color: "#F44336", icon: "fitness", visible: false, order: 11, isDefault: true },
  { id: "reading", name: "Reading", color: "#9C27B0", icon: "library-books", visible: false, order: 12, isDefault: true },
  { id: "work", name: "Work", color: "#FF9800", icon: "work", visible: false, order: 13, isDefault: true },
  { id: "meditation", name: "Meditation", color: "#4CAF50", icon: "self-improvement", visible: false, order: 14, isDefault: true },
  { id: "other", name: "Other", color: "#9E9E9E", icon: "more-horiz", visible: false, order: 15, isDefault: true },
];

export async function saveCategories(categories: Category[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving categories:", error);
    throw error;
  }
}

async function loadAllCategoriesRaw(): Promise<Category[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (data) {
      const categories = JSON.parse(data);
      // Ensure all categories have default values for new fields
      return categories.map((cat: Category) => ({
        ...cat,
        visible: cat.visible !== undefined ? cat.visible : true,
        order: cat.order !== undefined ? cat.order : 999,
        isDefault: cat.isDefault !== undefined ? cat.isDefault : false,
      })).sort((a: Category, b: Category) => (a.order || 999) - (b.order || 999));
    } else {
      // Initialize with default categories
      await saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    return DEFAULT_CATEGORIES;
  }
}

export async function loadCategories(): Promise<Category[]> {
  // Returns all categories (for management screens)
  return loadAllCategoriesRaw();
}

export async function getVisibleCategories(): Promise<Category[]> {
  // Returns only visible categories (for selectors)
  const categories = await loadAllCategoriesRaw();
  return categories.filter(c => c.visible !== false);
}

export async function addCategory(category: Omit<Category, "id">): Promise<Category> {
  const newCategory: Category = {
    ...category,
    id: `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };

  const categories = await loadAllCategoriesRaw();
  categories.push(newCategory);
  await saveCategories(categories);

  return newCategory;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  const categories = await loadAllCategoriesRaw();
  const index = categories.findIndex((c) => c.id === id);

  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    // Sort by order after update
    categories.sort((a, b) => (a.order || 999) - (b.order || 999));
    await saveCategories(categories);
  }
}

export async function reorderCategories(categoryIds: string[]): Promise<void> {
  const categories = await loadAllCategoriesRaw();
  const reordered = categoryIds.map((id, index) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      return { ...category, order: index };
    }
    return null;
  }).filter((c): c is Category => c !== null);

  // Add any categories not in the reorder list at the end
  const existingIds = new Set(categoryIds);
  categories.forEach(cat => {
    if (!existingIds.has(cat.id)) {
      reordered.push({ ...cat, order: reordered.length });
    }
  });

  reordered.sort((a, b) => (a.order || 999) - (b.order || 999));
  await saveCategories(reordered);
}

export async function deleteCategory(id: string): Promise<void> {
  const categories = await loadAllCategoriesRaw();
  const filtered = categories.filter((c) => c.id !== id);
  await saveCategories(filtered);
}

// User Profile Storage
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
}

export async function loadUserProfile(): Promise<UserProfile | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading user profile:", error);
    return null;
  }
}

// Utility functions
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getTodayDate(): string {
  return formatDate(new Date());
}

export function getWeekDates(date: Date): { start: string; end: string } {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(date.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: formatDate(monday),
    end: formatDate(sunday),
  };
}

export function getMonthDates(date: Date): { start: string; end: string } {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  return {
    start: formatDate(firstDay),
    end: formatDate(lastDay),
  };
}

export function getYearDates(date: Date): { start: string; end: string } {
  const year = date.getFullYear();
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);

  return {
    start: formatDate(firstDay),
    end: formatDate(lastDay),
  };
}

// Helper functions for home screen stats
export async function getTodayStats(): Promise<{ count: number; totalTime: number }> {
  const today = getTodayDate();
  const achievements = await getAchievementsByDate(today);
  
  let totalTime = 0;
  achievements.forEach((achievement) => {
    // Convert quantity to minutes based on unit
    let minutes = 0;
    if (achievement.unit === "hours") {
      minutes = achievement.quantity * 60;
    } else if (achievement.unit === "minutes") {
      minutes = achievement.quantity;
    } else {
      // For other units, estimate as 30 minutes per achievement
      minutes = 30;
    }
    totalTime += minutes;
  });

  return {
    count: achievements.length,
    totalTime,
  };
}

export async function getWeekStats(): Promise<{ count: number; totalTime: number }> {
  const { start, end } = getWeekDates(new Date());
  const achievements = await getAchievementsByDateRange(start, end);
  
  let totalTime = 0;
  achievements.forEach((achievement) => {
    let minutes = 0;
    if (achievement.unit === "hours") {
      minutes = achievement.quantity * 60;
    } else if (achievement.unit === "minutes") {
      minutes = achievement.quantity;
    } else {
      minutes = 30;
    }
    totalTime += minutes;
  });

  return {
    count: achievements.length,
    totalTime,
  };
}

export async function getStreak(): Promise<number> {
  const achievements = await loadAchievements();
  if (achievements.length === 0) return 0;

  // Get all unique dates with achievements, sorted descending
  const dates = Array.from(new Set(achievements.map((a) => a.date))).sort().reverse();
  
  let streak = 0;
  const today = getTodayDate();
  let currentDate = new Date(today);

  // Check if today has achievements
  if (!dates.includes(today)) {
    // If today doesn't have achievements, start from yesterday
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Count consecutive days going backwards
  for (const date of dates) {
    const dateStr = formatDate(currentDate);
    if (date === dateStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // Break if there's a gap
      break;
    }
  }

  return streak;
}

// Project Storage
export async function saveProjects(projects: Project[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (error) {
    console.error("Error saving projects:", error);
    throw error;
  }
}

export async function loadProjects(): Promise<Project[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

export async function addProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
  const newProject: Project = {
    ...project,
    id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const projects = await loadProjects();
  projects.push(newProject);
  await saveProjects(projects);

  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const projects = await loadProjects();
  const index = projects.findIndex((p) => p.id === id);

  if (index !== -1) {
    const updatedProject: Project = {
      ...projects[index],
      ...updates,
      updatedAt: Date.now(),
    };
    
    // Auto-complete if progress reaches 100%
    if (updatedProject.progress >= 100 && updatedProject.status === "active") {
      updatedProject.status = "completed";
      updatedProject.completedAt = Date.now();
    }
    
    projects[index] = updatedProject;
    await saveProjects(projects);
    return updatedProject;
  }
  
  return null;
}

export async function deleteProject(id: string): Promise<void> {
  const projects = await loadProjects();
  const filtered = projects.filter((p) => p.id !== id);
  await saveProjects(filtered);
}

export async function getActiveProjects(): Promise<Project[]> {
  const projects = await loadProjects();
  return projects.filter((p) => p.status === "active");
}

export async function getCompletedProjects(): Promise<Project[]> {
  const projects = await loadProjects();
  return projects.filter((p) => p.status === "completed");
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await loadProjects();
  return projects.find((p) => p.id === id) || null;
}

// Greeting logic - show once per day
export async function shouldShowGreeting(): Promise<boolean> {
  try {
    const lastShown = await AsyncStorage.getItem(STORAGE_KEYS.GREETING_SHOWN);
    if (!lastShown) return true;
    
    const lastDate = new Date(lastShown);
    const today = new Date();
    
    // Show if different day
    return (
      lastDate.getFullYear() !== today.getFullYear() ||
      lastDate.getMonth() !== today.getMonth() ||
      lastDate.getDate() !== today.getDate()
    );
  } catch (error) {
    return true;
  }
}

export async function markGreetingShown(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GREETING_SHOWN, new Date().toISOString());
  } catch (error) {
    console.error("Error marking greeting as shown:", error);
  }
}
