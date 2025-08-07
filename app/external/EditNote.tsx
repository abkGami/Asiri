import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotesStore } from "@/store/useNotesStore";


export default function EditNote() {
  const { note } = useLocalSearchParams();
  const parsedNote =
    typeof note === "string"
      ? JSON.parse(note)
      : { id: Date.now().toString(), title: "", details: "" };

  const [title, setTitle] = useState(parsedNote.title);
  const [details, setDetails] = useState(parsedNote.details);
  const router = useRouter();

 const { addOrUpdateNote } = useNotesStore();

const handleSave = () => {
  addOrUpdateNote({
    id: parsedNote.id,
    title,
    details,
  });
  router.back();
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
          <Text className="font-baloo2-Bold text-text text-2xl mb-6">
            {parsedNote.title ? "Edit Note" : "New Note"}
          </Text>

          <View className="bg-card p-5 rounded-xl shadow-sm border border-border/20 flex-1">
            {/* Title */}
            <Text className="font-baloo2-Medium text-textSecondary text-sm mb-2">
              Title
            </Text>
            <TextInput
              className="bg-input text-text p-4 rounded-lg mb-6 font-baloo2-Regular text-base"
              placeholder="Enter note title"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
            />

            {/* Details */}
            <Text className="font-baloo2-Medium text-textSecondary text-sm mb-2">
              Details
            </Text>
            <TextInput
              className="bg-input text-text p-4 rounded-lg font-baloo2-Regular text-base"
              placeholder="Write your note here..."
              placeholderTextColor="#9CA3AF"
              value={details}
              onChangeText={setDetails}
              multiline
              textAlignVertical="top"
              style={{ minHeight: 200 }}
            />

            {/* Save Button */}
            <LinearGradient
              colors={["#6366F1", "#2DD4BF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-xl mt-6"
            >
              <TouchableOpacity className="p-4 rounded-xl" onPress={handleSave}>
                <Text className="font-baloo2-Medium text-text text-center text-base">
                  Save Note
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
