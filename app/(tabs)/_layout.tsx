import { useWalletUi } from "@/components/solana/use-wallet-ui";
import { ellipsify } from '@/utils/ellipsify';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs, useRouter } from "expo-router";
import React, { useState } from "react";
import { Clipboard, Platform, Pressable, Text, TouchableOpacity, View } from "react-native";

// import Colors from '@/constants/Colors';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={25} style={{ marginBottom: -3 }} {...props} />;
}

// HeaderRight component for wallet connect/status
function HeaderRight() {
  const { account, connect, disconnect } = useWalletUi();
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  React.useEffect(() => {
    // If not connected, redirect to home
    if (!account?.publicKey) {
      router.replace("/");
    }
  }, [account?.publicKey]);

  const handleCopy = async () => {
    if (!account?.publicKey) return;
    if (Platform.OS === "web") {
      await navigator.clipboard.writeText(account.publicKey.toString());
    } else {
      await Clipboard.setString(account.publicKey.toString());
    }
    setDropdownVisible(false);
  };

  if (account?.publicKey) {
    return (
      <View>
        <Pressable
          onPress={() => setDropdownVisible((v) => !v)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#2DD4BF",
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 6,
            marginRight: 12,
          }}
        >
          <FontAwesome5 name="wallet" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={{ color: "#fff", fontFamily: "Baloo2-Bold", fontSize: 14 }}>
            {ellipsify(account.publicKey.toString(), 6)}
          </Text>
        </Pressable>
        {dropdownVisible && (
          <View
            style={{
              position: "absolute",
              top: 44,
              right: 0,
              backgroundColor: "#fff",
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
              minWidth: 120,
              zIndex: 100,
            }}
          >
            <TouchableOpacity
              onPress={handleCopy}
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesome name="copy" size={16} color="#2DD4BF" style={{ marginRight: 8 }} />
              <Text style={{ color: "#222", fontFamily: "Baloo2-Medium", fontSize: 14 }}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDropdownVisible(false);
                disconnect();
              }}
              style={{
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesome name="sign-out" size={16} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={{ color: "#EF4444", fontFamily: "Baloo2-Medium", fontSize: 14 }}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  return (
    <Pressable
      onPress={connect}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2DD4BF",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 12,
      }}
    >
      <FontAwesome name="plug" size={16} color="#fff" style={{ marginRight: 6 }} />
      <Text style={{ color: "#fff", fontFamily: "Baloo2-Bold", fontSize: 14 }}>
        Connect Wallet
      </Text>
    </Pressable>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#111827",
          paddingBottom: 10,
          height: 57,
          borderTopWidth: 1,
          borderTopColor: "#374151",
        },
        tabBarLabelStyle: {
          fontFamily: "Baloo2-Medium",
          color: "#F9FAFB",
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarActiveTintColor: "#2DD4BF",
        tabBarInactiveTintColor: "#9CA3AF",
        headerStyle: { backgroundColor: "#111827" },
        headerTitleStyle: { fontFamily: "Baloo2-Bold", color: "#F9FAFB", fontSize: 20 },
        headerShadowVisible: false,
        headerRight: () => <HeaderRight />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Notes",
          tabBarIcon: ({ color }) => <TabBarIcon name="sticky-note-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Contacts"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color }) => <TabBarIcon name="address-book-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Vault"
        options={{
          title: "Vault",
          tabBarIcon: ({ color }) => <TabBarIcon name="lock" color={color} />,
        }}
      />
    </Tabs>
  );
}