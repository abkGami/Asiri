import { AccountFeature } from '@/components/account/account-feature';
import { useUserStore } from '@/store/useUserStore';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function Account() {
  
        const [modalVisible, setModalVisible] = useState(false);
          const { username, setUsername, loadUsername } = useUserStore();
    
           const handleSetUsername = () => {
        if (username) {
          setUsername(username)
                setModalVisible(false);
          router.replace("/");
          console.log('Username set:', username);
        }
      };

  useEffect(() => {
  //  setModalVisible(true);
   setModalVisible(false);
  }, [])
  

  return (
    <>
     {/* <AccountFeature />  */}
     
                  {/* Modal for mock onboarding */}
                 <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/70 justify-center items-center px-6">
          <View className="bg-card w-full max-w-md p-6 rounded-2xl shadow-2xl border border-border/20">
            <View className="w-full max-w-md">
                 <TextInput
            className="bg-input text-text p-4 rounded-xl mb-4 font-baloo2-Regular text-base border border-border/20"
            placeholder="Enter unique username"
            placeholderTextColor="#9CA3AF"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity
            className="bg-primary p-4 rounded-xl shadow-lg"
            onPress={handleSetUsername}
          >
            <Text className="font-baloo2-Medium text-text text-center text-lg">
              Set Username
            </Text>
          </TouchableOpacity>
        </View>
          </View>
        </View>
      </Modal>
    </>
    ) 
}
