import { AppView } from '@/components/app-view'
import { useAuth } from '@/components/auth/auth-provider'
import { AppConfig } from '@/constants/app-config'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { router } from 'expo-router'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignIn() {


  
 


  const { signIn, isLoading } = useAuth()
  return (
    <AppView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <SafeAreaView
          className='flex-1 bg-background justify-center items-center px-6'
        >
          {/* Dummy view to push the next view to the center. */}
          {/* <View /> */}
          <View style={{ alignItems: 'center', gap: 16 }}>
              <Text className="font-baloo2-Bold text-text text-3xl mb-10 text-center">
        Welcome to {AppConfig.name}
      </Text>
            {/* <Image source={require('../assets/images/icon.png')} style={{ width: 128, height: 128 }} /> */}
          </View>
          <View >
            <TouchableOpacity
              className="bg-card p-4 rounded-xl border border-border/20 shadow-sm flex-row items-center justify-center"
              onPress={async () => {
                await signIn()
                // setModalVisible(true)
                router.replace('/')
              }}
            >
              {/* <FontAwesome name="table" size={18} color="#2DD4BF" /> */}
              <FontAwesome5 name="wallet" size={18} color="#2DD4BF" />
              <Text className="ml-3 font-baloo2-Medium text-text text-lg">Login with MWA</Text>
            </TouchableOpacity>


    
          </View>
        </SafeAreaView>
      )}
    </AppView>
  )
}
