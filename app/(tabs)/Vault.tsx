import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useVaultStore } from "../../store/useVaultStore";

const PIN = "102004";

export default function VaultScreen() {
  const [tab, setTab] = useState<"seedPhrases" | "passwords">("seedPhrases");
  const [authenticated, setAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [visibleIds, setVisibleIds] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  // Vault store
  const seedPhrases = useVaultStore((s) => s.seedPhrases);
  const passwords = useVaultStore((s) => s.passwords);
  const nextOfKin = useVaultStore((s) => s.nextOfKin);
  const setSeedPhrases = useVaultStore((s) => s.setSeedPhrases);
  const setPasswords = useVaultStore((s) => s.setPasswords);
  const setNextOfKin = useVaultStore((s) => s.setNextOfKin);

  // Load vault data from AsyncStorage into store on unlock
  useEffect(() => {
    const loadVault = async () => {
      const phrases = await AsyncStorage.getItem("vault_seedPhrases");
      const passwords = await AsyncStorage.getItem("vault_passwords");
      const nextOfKin = await AsyncStorage.getItem("vault_nextOfKin");
      setSeedPhrases(phrases ? JSON.parse(phrases) : []);
      setPasswords(passwords ? JSON.parse(passwords) : []);
      setNextOfKin(nextOfKin ? JSON.parse(nextOfKin) : null);
    };
    if (authenticated) loadVault();
  }, [authenticated]);

  const handlePinSubmit = () => {
    if (enteredPin === PIN) setAuthenticated(true);
    else alert("Incorrect PIN");
  };

  // --- PIN Screen ---
  if (!authenticated) {
    return (
      <KeyboardAvoidingView
        className="flex-1 bg-background justify-center items-center p-6"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <LinearGradient
          colors={["#6366F1", "#2DD4BF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-2xl w-full px-8 py-10 items-center shadow-lg"
        >
          <Text className="text-white font-baloo2-Bold text-2xl mb-2">
            Enter Vault PIN
          </Text>
          <Text className="text-white/80 font-baloo2-Regular text-base mb-6 text-center">
            Please enter your 6-digit PIN to unlock your vault.
          </Text>
          <View className="flex-row justify-center mb-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  marginHorizontal: 6,
                  backgroundColor:
                    enteredPin.length > i ? "#fff" : "rgba(255,255,255,0.2)",
                  borderWidth: 1,
                  borderColor: "#fff",
                }}
              />
            ))}
          </View>
          <TextInput
            className="bg-white/90 text-black text-xl text-center p-4 rounded-lg w-48 tracking-widest mb-6"
            keyboardType="number-pad"
            maxLength={6}
            secureTextEntry
            value={enteredPin}
            onChangeText={setEnteredPin}
            placeholder="••••••"
            placeholderTextColor="#ccc"
            style={{ letterSpacing: 12 }}
          />
          <TouchableOpacity
            onPress={handlePinSubmit}
            className="bg-white/90 px-8 py-3 rounded-lg"
            style={{ shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6 }}
          >
            <Text className="text-primary font-baloo2-Bold text-base">Unlock Vault</Text>
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }

  // --- Main Vault Screen ---
  const data = tab === "seedPhrases" ? seedPhrases : passwords;

  return (
    <View className="flex-1 bg-background p-4">
            <StatusBar backgroundColor='#111827' barStyle={"light-content"}/>
      
      <View className="flex-row mb-5 bg-card rounded-xl p-1">
        <TouchableOpacity
          className={`flex-1 py-3 px-4 ${tab === "seedPhrases" ? "bg-primary" : "bg-transparent"} rounded-lg`}
          onPress={() => setTab("seedPhrases")}
        >
          <Text
            className={`font-baloo2-Medium text-center text-base ${tab === "seedPhrases" ? "text-text" : "text-textSecondary"}`}
          >
            Seed Phrases
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 px-4 ${tab === "passwords" ? "bg-primary" : "bg-transparent"} rounded-lg`}
          onPress={() => setTab("passwords")}
        >
          <Text
            className={`font-baloo2-Medium text-center text-base ${tab === "passwords" ? "text-text" : "text-textSecondary"}`}
          >
            Passwords
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data as any[]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-card p-5 mb-3 rounded-xl shadow-sm border border-border/20">
            <View className="flex-row items-center justify-between">
              <Text className="font-baloo2-SemiBold text-text text-lg">
                {item.title || item.site}
              </Text>
              <TouchableOpacity
                className="bg-input p-2 rounded-lg ml-2"
                onPress={() => {
                  setVisibleIds((prev) =>
                    prev.includes(item.id)
                      ? prev.filter((id) => id !== item.id)
                      : [...prev, item.id]
                  );
                }}
              >
                <FontAwesome
                  name={visibleIds.includes(item.id) ? "eye-slash" : "eye"}
                  size={16}
                  color="#2DD4BF"
                />
              </TouchableOpacity>
            </View>
            <Text className="font-baloo2-Regular text-textSecondary text-sm mt-1">
              {visibleIds.includes(item.id)
                ? (item.value || `${item.username} • ${item.value}`)
                : (item.value ? "••••••••" : `${item.username} • ••••••••`)}
            </Text>

            <View className="flex-row mt-2">
              <TouchableOpacity
                className="mr-4"
                onPress={() => {
                  setEditingItem(item);
                  setModalVisible(true);
                }}
              >
                <Text className="text-sm text-blue-400">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const updated = data.filter((entry: any) => entry.id !== item.id);
                  if (tab === "seedPhrases") {
                    await AsyncStorage.setItem("vault_seedPhrases", JSON.stringify(updated));
                    setSeedPhrases(updated);
                  } else {
                    await AsyncStorage.setItem("vault_passwords", JSON.stringify(updated));
                    setPasswords(updated);
                  }
                }}
              >
                <Text className="text-sm text-red-400">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-white w-full rounded-xl p-5">
            <Text className="text-lg font-baloo2-SemiBold mb-3 text-black">Edit Entry</Text>
            <TextInput
              placeholder="Title / Site"
              value={editingItem?.title || editingItem?.site || ""}
              onChangeText={(text) =>
                setEditingItem((prev: any) => ({ ...prev, title: text, site: text }))
              }
              className="border border-gray-300 mb-3 rounded-lg p-3 text-black"
            />
            <TextInput
              placeholder="Value / Password / Phrase"
              value={editingItem?.value || ""}
              onChangeText={(text) =>
                setEditingItem((prev: any) => ({ ...prev, value: text }))
              }
              className="border border-gray-300 mb-5 rounded-lg p-3 text-black"
            />
            <View className="flex-row justify-end">
              <TouchableOpacity
                className="mr-4"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-gray-500">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const updated = data.map((entry: any) =>
                    entry.id === editingItem.id ? editingItem : entry
                  );
                  if (tab === "seedPhrases") {
                    await AsyncStorage.setItem("vault_seedPhrases", JSON.stringify(updated));
                    setSeedPhrases(updated);
                  } else {
                    await AsyncStorage.setItem("vault_passwords", JSON.stringify(updated));
                    setPasswords(updated);
                  }
                  setModalVisible(false);
                }}
              >
                <Text className="text-blue-600">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Entry Button */}
      <View className="absolute bottom-6 right-6 flex-row items-center">
        {nextOfKin && (
          <View className="bg-card px-3 py-2 rounded-lg mr-2 border border-border/20">
            <Text className="font-baloo2-Medium text-textSecondary text-sm">
              {nextOfKin?.username || ""}
            </Text>
          </View>
        )}
        <LinearGradient
          colors={["#6366F1", "#2DD4BF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-full shadow-lg"
          style={{ borderRadius: 100 }}
        >
          <TouchableOpacity
            className="p-3 rounded-full"
            onPress={() => router.push("/external/NOK")}
          >
            <FontAwesome name="user-secret" size={20} color="#F9FAFB" />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={["#6366F1", "#2DD4BF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="ml-3 rounded-full shadow-lg"
          style={{ borderRadius: 100 }}
        >
          <TouchableOpacity
            className="p-4 w-16 h-16 items-center justify-center"
            onPress={() => router.push(`/external/AddVault?type=${tab}`)}
          >
            <Text className="font-baloo2-Bold text-text text-3xl">+</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}