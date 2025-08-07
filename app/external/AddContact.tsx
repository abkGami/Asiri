import { useContactsStore } from "@/store/useContactsStore";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import { BarCodeScanner } from 'expo-barcode-scanner';


export default function AddContact() {
const { contact } = useLocalSearchParams();
const parsed = contact ? JSON.parse(contact as string) : null;

const [name, setName] = useState(parsed?.name || "");
const [address, setAddress] = useState(parsed?.address || "");
const [network, setNetwork] = useState(parsed?.network || "Solana");
const [showScanner, setShowScanner] = useState(false);


const isEditing = !!parsed;
  const { addContact, deleteContact, contacts } = useContactsStore();
  const router = useRouter();

  const handleSave = () => {
    if (!name || !address || !network) {
      Alert.alert("Incomplete", "Please fill all fields.");
      return;
    }
    if (isEditing) {
  deleteContact(parsed.address); // remove old entry
}

const nameExists = contacts.some(
  (c) => c.name.toLowerCase() === name.toLowerCase() && (!isEditing || c.address !== parsed?.address)
);

if (nameExists) {
  Alert.alert("Duplicate Name", "A contact with this name already exists.");
  return;
}
    addContact({ name, address, network });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar backgroundColor='#111827' barStyle={"light-content"}/>
      <View className="flex-1 bg-background p-4">
        <Text className="font-baloo2-Bold text-text text-2xl mb-4">
          Add Contact
        </Text>
        <View className="bg-card p-5 rounded-xl mb-4 shadow-sm border border-border/20">
        {/* <TouchableOpacity
  className="mb-4 self-end bg-input px-4 py-2 rounded-lg"
  onPress={() => setShowScanner(true)}
>
  <Text className="text-primary font-baloo2-Medium">Scan QR</Text>
</TouchableOpacity> */}
          <Text className="font-baloo2-Medium text-textSecondary text-sm mb-2">
            Contact Name
          </Text>
          <TextInput
            className="bg-input text-text p-4 rounded-lg mb-4 font-baloo2-Regular text-base"
            placeholder="Enter contact name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

          <Text className="font-baloo2-Medium text-textSecondary text-sm mb-2">
            Wallet Address
          </Text>
          <TextInput
            className="bg-input text-text p-4 rounded-lg mb-4 font-baloo2-Regular text-base"
            placeholder="Enter wallet address"
            placeholderTextColor="#9CA3AF"
            value={address}
            onChangeText={setAddress}
          />

          <Text className="font-baloo2-Medium text-textSecondary text-sm mb-2">
            Network
          </Text>
          <TextInput
            className="bg-input text-text p-4 rounded-lg mb-4 font-baloo2-Regular text-base"
            placeholder="e.g., Solana, Ethereum"
            placeholderTextColor="#9CA3AF"
            value={network}
            onChangeText={setNetwork}
          />

          <LinearGradient
            colors={["#6366F1", "#2DD4BF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-lg"
          >
          <TouchableOpacity
  className="p-4 rounded-lg"
  onPress={handleSave}
>
  <Text className="font-baloo2-Medium text-text text-center">
    Save Contact
  </Text>
</TouchableOpacity>
          </LinearGradient>
        </View>
        {/* {showScanner && (
  <Modal visible transparent>
    <View className="flex-1 justify-center items-center bg-black/80">
      <BarCodeScanner
        onBarCodeScanned={({ data }) => {
          setAddress(data);
          setShowScanner(false);
        }}
        style={{ width: '100%', height: '100%' }}
      />
      <TouchableOpacity
        onPress={() => setShowScanner(false)}
        className="absolute top-10 right-6 bg-red-500 p-3 rounded-full"
      >
        <FontAwesome name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  </Modal>
)} */}

      </View>
    </SafeAreaView>
    
  );
}
