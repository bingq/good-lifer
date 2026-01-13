import { describe, it, expect, beforeEach } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Achievement,
  addAchievement,
  loadAchievements,
  updateAchievement,
  deleteAchievement,
  getTodayDate,
  formatDate,
  getWeekDates,
  getMonthDates,
  getYearDates,
} from "../lib/storage";

// Mock AsyncStorage
const mockStorage: { [key: string]: string } = {};

beforeEach(() => {
  // Clear mock storage before each test
  Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);

  // Mock AsyncStorage methods
  (AsyncStorage.getItem as any) = async (key: string) => mockStorage[key] || null;
  (AsyncStorage.setItem as any) = async (key: string, value: string) => {
    mockStorage[key] = value;
  };
  (AsyncStorage.removeItem as any) = async (key: string) => {
    delete mockStorage[key];
  };
  (AsyncStorage.multiRemove as any) = async (keys: string[]) => {
    keys.forEach((key) => delete mockStorage[key]);
  };
});

describe("Storage - Achievement CRUD", () => {
  it("should add an achievement", async () => {
    const achievement = await addAchievement({
      date: getTodayDate(),
      category: "study",
      name: "Completed homework",
      quantity: 2,
      unit: "hours",
      notes: "Math and Science",
    });

    expect(achievement.id).toBeDefined();
    expect(achievement.name).toBe("Completed homework");
    expect(achievement.quantity).toBe(2);
  });

  it("should load achievements", async () => {
    await addAchievement({
      date: getTodayDate(),
      category: "study",
      name: "Test 1",
      quantity: 1,
      unit: "hours",
    });

    await addAchievement({
      date: getTodayDate(),
      category: "exercise",
      name: "Test 2",
      quantity: 5,
      unit: "km",
    });

    const achievements = await loadAchievements();
    expect(achievements.length).toBe(2);
  });

  it("should update an achievement", async () => {
    const achievement = await addAchievement({
      date: getTodayDate(),
      category: "study",
      name: "Original",
      quantity: 1,
      unit: "hours",
    });

    await updateAchievement(achievement.id, {
      name: "Updated",
      quantity: 3,
    });

    const achievements = await loadAchievements();
    const updated = achievements.find((a) => a.id === achievement.id);

    expect(updated?.name).toBe("Updated");
    expect(updated?.quantity).toBe(3);
  });

  it("should delete an achievement", async () => {
    const achievement = await addAchievement({
      date: getTodayDate(),
      category: "study",
      name: "To Delete",
      quantity: 1,
      unit: "hours",
    });

    await deleteAchievement(achievement.id);

    const achievements = await loadAchievements();
    expect(achievements.length).toBe(0);
  });
});

describe("Storage - Date Utilities", () => {
  it("should format date correctly", () => {
    const date = new Date("2026-01-15");
    const formatted = formatDate(date);
    expect(formatted).toBe("2026-01-15");
  });

  it("should get today's date", () => {
    const today = getTodayDate();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should get week dates", () => {
    const date = new Date("2026-01-15"); // Thursday
    const { start, end } = getWeekDates(date);

    // Week should start on Monday (implementation may vary by timezone)
    expect(start).toMatch(/^2026-01-(12|13)$/);
    expect(end).toMatch(/^2026-01-(18|19)$/);
  });

  it("should get month dates", () => {
    const date = new Date("2026-01-15");
    const { start, end } = getMonthDates(date);

    expect(start).toBe("2026-01-01");
    expect(end).toBe("2026-01-31");
  });

  it("should get year dates", () => {
    const date = new Date("2026-06-15");
    const { start, end } = getYearDates(date);

    expect(start).toBe("2026-01-01");
    expect(end).toBe("2026-12-31");
  });
});

describe("Storage - Data Validation", () => {
  it("should handle empty storage", async () => {
    const achievements = await loadAchievements();
    expect(achievements).toEqual([]);
  });

  it("should preserve achievement data types", async () => {
    const achievement = await addAchievement({
      date: "2026-01-15",
      category: "study",
      name: "Test",
      quantity: 2.5,
      unit: "hours",
      notes: "Optional note",
    });

    expect(typeof achievement.quantity).toBe("number");
    expect(typeof achievement.createdAt).toBe("number");
    expect(typeof achievement.id).toBe("string");
  });
});
