import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useVaultStore } from "../../store/useVaultStore";

export default function NOKScreen() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const setNextOfKin = useVaultStore((s) => s.setNextOfKin);

  const handleSave = async () => {
    const nok = { username };
    await AsyncStorage.setItem("vault_nextOfKin", JSON.stringify(nok));
    setNextOfKin(nok);
    router.back();
  };

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-text text-xl font-baloo2-Bold mb-4">Add Next of Kin</Text>
      <TextInput
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
        className="bg-card text-text p-4 rounded-lg"
      />
      <TouchableOpacity onPress={handleSave} className="mt-6 bg-primary px-6 py-4 rounded-lg">
        <Text className="text-text text-center font-baloo2-SemiBold">Save</Text>
      </TouchableOpacity>
    </View>
  );
}
  