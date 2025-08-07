
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { useVaultStore } from "../../store/useVaultStore";

export default function AddVault() {
  const { type } = useLocalSearchParams<{ type: "seedPhrases" | "passwords" }>();
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [seedPhraseCount, setSeedPhraseCount] = useState<12 | 24>(12);
  const [seedWords, setSeedWords] = useState<string[]>(Array(12).fill(""));
  const router = useRouter();
  const setSeedPhrases = useVaultStore((s) => s.setSeedPhrases);
  const setPasswords = useVaultStore((s) => s.setPasswords);

  // Handle switching between 12 and 24 seed phrase
  const handleSeedPhraseCount = (count: 12 | 24) => {
    setSeedPhraseCount(count);
    setSeedWords((prev) => {
      const arr = Array(count).fill("");
      for (let i = 0; i < Math.min(prev.length, count); i++) arr[i] = prev[i];
      return arr;
    });
  };

  const handleSeedWordChange = (idx: number, word: string) => {
    setSeedWords((prev) => {
      const arr = [...prev];
      arr[idx] = word;
      return arr;
    });
  };

  const handleSave = async () => {
    let newItem;
    if (type === "passwords") {
      newItem = { id: uuidv4(), site: title, username: title, value };
    } else {
      const phrase = seedWords.join(" ").trim();
      newItem = { id: uuidv4(), title, value: phrase };
    }

    const key = `vault_${type}`;
    const existingData = await AsyncStorage.getItem(key);
    const parsed = existingData ? JSON.parse(existingData) : [];

    const updated = [newItem, ...parsed];
    await AsyncStorage.setItem(key, JSON.stringify(updated));

    if (type === "seedPhrases") setSeedPhrases(updated);
    else setPasswords(updated);

    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-background p-6" contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}>
      <Text className="font-baloo2-Bold text-xl mb-4 text-text">
        Add {type === "seedPhrases" ? "Seed Phrase" : "Password"}
      </Text>
      <TextInput
        placeholder={type === "seedPhrases" ? "Enter phrase title" : "Site or App Name"}
        value={title}
        onChangeText={setTitle}
        className="bg-card p-4 rounded-lg text-text mb-4"
      />

      {type === "seedPhrases" ? (
        <>
          <View className="flex-row mb-4">
            <TouchableOpacity
              className={`px-4 py-2 rounded-l-lg ${seedPhraseCount === 12 ? "bg-primary" : "bg-card"}`}
              onPress={() => handleSeedPhraseCount(12)}
            >
              <Text className={`font-baloo2-Medium ${seedPhraseCount === 12 ? "text-white" : "text-text"}`}>12 Words</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-r-lg ml-2 ${seedPhraseCount === 24 ? "bg-primary" : "bg-card"}`}
              onPress={() => handleSeedPhraseCount(24)}
            >
              <Text className={`font-baloo2-Medium ${seedPhraseCount === 24 ? "text-white" : "text-text"}`}>24 Words</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {seedWords.map((word, idx) => (
              <TextInput
                key={idx}
                value={word}
                onChangeText={(text) => handleSeedWordChange(idx, text)}
                placeholder={`${idx + 1}`}
                className="bg-card p-2 rounded-md text-text mb-2"
                style={{
                  width: "22%",
                  marginRight: (idx + 1) % 4 === 0 ? 0 : 8,
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
            ))}
          </View>
        </>
      ) : (
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder="Enter password"
            value={value}
            onChangeText={setValue}
            secureTextEntry={!showPassword}
            className="bg-card p-4 rounded-lg text-text pr-12"
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: 12,
              top: 0,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              padding: 8,
            }}
          >
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={handleSave} className="mt-6 bg-primary px-6 py-4 rounded-lg">
        <Text className="text-text text-center font-baloo2-SemiBold">Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}