import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Alert, TextInput, Modal } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import {
  loadCategories,
  saveCategories,
  updateCategory,
  deleteCategory,
  reorderCategories,
  addCategory,
  Category,
  DEFAULT_CATEGORIES,
} from "@/lib/storage";

export default function ManageCategoriesScreen() {
  const colors = useColors();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const cats = await loadCategories();
    setCategories(cats);
  }

  const defaultCategories = categories.filter(c => c.isDefault);
  const customCategories = categories.filter(c => !c.isDefault);

  function handleToggleVisibility(category: Category) {
    updateCategory(category.id, { visible: !category.visible });
    loadData();
  }

  function handleEditCategory(category: Category) {
    setEditingCategory(category);
    setEditName(category.name);
    setEditColor(category.color);
    setShowEditModal(true);
  }

  function handleSaveEdit() {
    if (!editingCategory || !editName.trim()) {
      Alert.alert("Error", "Category name is required");
      return;
    }

    updateCategory(editingCategory.id, {
      name: editName.trim(),
      color: editColor || editingCategory.color,
    });
    setShowEditModal(false);
    setEditingCategory(null);
    loadData();
  }

  function handleDeleteCategory(category: Category) {
    if (category.isDefault) {
      Alert.alert("Cannot Delete", "Default categories cannot be deleted. You can hide them instead.");
      return;
    }

    Alert.alert("Delete Category", `Delete "${category.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteCategory(category.id);
          loadData();
        },
      },
    ]);
  }

  function handleAddCategory() {
    if (!editName.trim()) {
      Alert.alert("Error", "Category name is required");
      return;
    }

    addCategory({
      name: editName.trim(),
      color: editColor || "#9E9E9E",
      icon: "more-horiz",
      visible: true,
      order: categories.length,
      isDefault: false,
    });
    setShowAddModal(false);
    setEditName("");
    setEditColor("");
    loadData();
  }

  const predefinedColors = [
    "#2196F3", // Blue
    "#F44336", // Red
    "#FF9800", // Orange
    "#4CAF50", // Green
    "#9C27B0", // Purple
    "#E91E63", // Pink
    "#00BCD4", // Cyan
    "#795548", // Brown
    "#607D8B", // Blue Grey
    "#9E9E9E", // Grey
  ];

  const categoryEmoji = (id: string) => {
    if (id === "learning" || id === "study" || id === "reading") return "📚";
    if (id === "sports_exercise" || id === "exercise") return "💪";
    if (id === "business" || id === "work") return "💼";
    if (id === "meditation") return "🧘";
    return "📝";
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                className="w-10 h-10 items-center justify-center"
              >
                <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
              </Pressable>
              <Text className="text-3xl font-bold text-foreground">Manage Categories</Text>
            </View>
            <Pressable
              onPress={() => {
                setEditName("");
                setEditColor("");
                setShowAddModal(true);
              }}
              className="w-12 h-12 rounded-full items-center justify-center"
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-2xl text-white font-bold">+</Text>
            </Pressable>
          </View>

          {/* Instructions */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm text-muted text-center">
              Tap ✓ to show/hide • Tap category to edit • Drag ☰ to reorder (coming soon)
            </Text>
          </View>

          {/* Default Categories */}
          {defaultCategories.length > 0 && (
            <View className="gap-3">
              <Text className="text-base font-semibold text-foreground">Default Categories</Text>
              {defaultCategories.map((category) => (
                <View
                  key={category.id}
                  className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <Text className="text-2xl">{categoryEmoji(category.id)}</Text>
                    <Text className="text-base font-semibold text-foreground flex-1">
                      {category.name}
                    </Text>
                    <Pressable
                      onPress={() => handleToggleVisibility(category)}
                      className="w-10 h-10 items-center justify-center"
                      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    >
                      <IconSymbol
                        name={category.visible !== false ? "checkmark.circle.fill" : "circle"}
                        size={24}
                        color={category.visible !== false ? colors.primary : colors.muted}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => handleEditCategory(category)}
                      className="w-10 h-10 items-center justify-center"
                      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    >
                      <Text className="text-xl">☰</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Custom Categories */}
          {customCategories.length > 0 && (
            <View className="gap-3">
              <Text className="text-base font-semibold text-foreground">Custom Categories</Text>
              {customCategories.map((category) => (
                <View
                  key={category.id}
                  className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <Text className="text-base font-semibold text-foreground flex-1">
                      {category.name}
                    </Text>
                    <Pressable
                      onPress={() => handleToggleVisibility(category)}
                      className="w-10 h-10 items-center justify-center"
                      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    >
                      <IconSymbol
                        name={category.visible !== false ? "checkmark.circle.fill" : "circle"}
                        size={24}
                        color={category.visible !== false ? colors.primary : colors.muted}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => handleEditCategory(category)}
                      className="w-10 h-10 items-center justify-center"
                      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    >
                      <IconSymbol name="pencil" size={20} color={colors.muted} />
                    </Pressable>
                    <Pressable
                      onPress={() => handleDeleteCategory(category)}
                      className="w-10 h-10 items-center justify-center"
                      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    >
                      <IconSymbol name="trash" size={20} color={colors.error} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Empty State for Custom */}
          {customCategories.length === 0 && (
            <View className="bg-surface rounded-2xl p-6 items-center border border-border">
              <Text className="text-4xl mb-2">🎨</Text>
              <Text className="text-sm text-muted text-center">
                No custom categories yet. Tap + to create one.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Category Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface rounded-t-3xl p-6 pb-8" style={{ maxHeight: "90%" }}>
            <View className="gap-6">
              <View className="flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-foreground">Edit Category</Text>
                <Pressable
                  onPress={() => setShowEditModal(false)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text className="text-2xl text-muted">✕</Text>
                </Pressable>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">Category Name</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Category name"
                  className="border rounded-xl p-4 text-base"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                    minHeight: 52,
                  }}
                  autoFocus
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">Color</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                  {predefinedColors.map((color) => (
                    <Pressable
                      key={color}
                      onPress={() => setEditColor(color)}
                      className="w-12 h-12 rounded-full border-2"
                      style={{
                        backgroundColor: color,
                        borderColor: editColor === color ? colors.primary : colors.border,
                      }}
                    />
                  ))}
                </ScrollView>
              </View>

              <Pressable
                onPress={handleSaveEdit}
                className="rounded-xl items-center justify-center py-4"
                style={{
                  backgroundColor: colors.primary,
                  minHeight: 52,
                }}
              >
                <Text className="text-base font-semibold text-white">Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Category Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface rounded-t-3xl p-6 pb-8" style={{ maxHeight: "90%" }}>
            <View className="gap-6">
              <View className="flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-foreground">Add Custom Category</Text>
                <Pressable
                  onPress={() => setShowAddModal(false)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text className="text-2xl text-muted">✕</Text>
                </Pressable>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">Category Name</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="e.g., Creative"
                  className="border rounded-xl p-4 text-base"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                    minHeight: 52,
                  }}
                  autoFocus
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">Color</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                  {predefinedColors.map((color) => (
                    <Pressable
                      key={color}
                      onPress={() => setEditColor(color)}
                      className="w-12 h-12 rounded-full border-2"
                      style={{
                        backgroundColor: color,
                        borderColor: editColor === color ? colors.primary : colors.border,
                      }}
                    />
                  ))}
                </ScrollView>
              </View>

              <Pressable
                onPress={handleAddCategory}
                className="rounded-xl items-center justify-center py-4"
                style={{
                  backgroundColor: colors.primary,
                  minHeight: 52,
                }}
              >
                <Text className="text-base font-semibold text-white">Create Category</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

