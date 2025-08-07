import { Note, useNotesStore } from "@/store/useNotesStore";
import { useUserStore } from "@/store/useUserStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

export default function NotesScreen() {
  const router = useRouter();
  const { username } = useUserStore();
  const { notes, loadNotes, deleteNote } = useNotesStore();
  const [modalVisible, setModalVisible] = useState(false);
const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);


  useEffect(() => {
    loadNotes();
  }, []);

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      className="bg-card p-5 mb-3 rounded-xl shadow-sm border border-border/20"
      onPress={() => router.push({ pathname: "/external/EditNote", params: { note: JSON.stringify(item) } })}
    >
      <View className="flex-row justify-between items-center mb-1">
        <Text className="font-baloo2-SemiBold text-text text-lg">{item.title}</Text>
     {/* <TouchableOpacity
  onPress={() =>
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteNote(item.id) },
      ],
      { cancelable: true }
    )
  }
>
  <FontAwesome name="trash" size={16} color="#EF4444" />
</TouchableOpacity> */}
<TouchableOpacity
  onPress={() => {
    setSelectedNoteId(item.id);
    setModalVisible(true);
  }}
>
  <FontAwesome name="trash" size={16} color="#EF4444" />
</TouchableOpacity>
<Modal
  visible={modalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setModalVisible(false)}
>
  <View className="flex-1 bg-black/50 justify-center items-center px-6">
    <View className="bg-card w-full max-w-md p-6 rounded-xl shadow-lg border border-border">
      <Text className="font-baloo2-Bold text-text text-lg mb-3">Delete Note</Text>
      <Text className="font-baloo2-Regular text-textSecondary text-base mb-6">
        Are you sure you want to delete this note? This action cannot be undone.
      </Text>

      <View className="flex-row justify-end space-x-3 gap-4">
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          className="px-4 py-2 bg-input rounded-lg"
        >
          <Text className="text-text font-baloo2-Medium">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (selectedNoteId) deleteNote(selectedNoteId);
            setSelectedNoteId(null);
            setModalVisible(false);
          }}
          className="px-4 py-2 bg-red-500 rounded-lg"
        >
          <Text className="text-white font-baloo2-Medium">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


      </View>
      <Text className="font-baloo2-Regular text-textSecondary text-sm mb-1">
        {item.details.length > 50 ? item.details.substring(0, 50) + "..." : item.details}
      </Text>
      <Text className="font-baloo2-Regular text-textSecondary text-xs">
        Updated: {new Date(item.updatedAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="font-baloo2-Bold text-text text-2xl mb-4">Hello {username || "Abk"} 👋</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <LinearGradient
        colors={['#6366F1', '#2DD4BF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute bottom-6 right-6 rounded-full shadow-lg"
        style={{ borderRadius: 100 }}
      >
        <TouchableOpacity
          className="p-4 w-16 h-16 items-center justify-center"
          onPress={() => router.push("/external/EditNote")}
        >
          <FontAwesome name="plus" size={24} color="#F9FAFB" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
