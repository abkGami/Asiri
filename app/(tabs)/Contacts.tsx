import { useWalletUi } from "@/components/solana/use-wallet-ui";
import { useContactsStore } from "@/store/useContactsStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Contacts() {
  const router = useRouter();
  const { contacts, loadContacts, deleteContact, addContact } = useContactsStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [nicknameModal, setNicknameModal] = useState<{ visible: boolean; address: string | null }>({ visible: false, address: null });
  const [nickname, setNickname] = useState("");
  const [savedTxAddresses, setSavedTxAddresses] = useState<string[]>([]);
  const [sendModal, setSendModal] = useState<{ visible: boolean; address: string | null }>({ visible: false, address: null });
  const [sendAmount, setSendAmount] = useState("");
  const [sending, setSending] = useState(false);

  
  // Solana wallet and transactions
  const { account, sendTransaction } = useWalletUi();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionAddresses, setTransactionAddresses] = useState<string[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);
  
  // Filtered contacts
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load contacts on mount
  useEffect(() => {
    loadContacts();
  }, []);

  // Fetch recent transactions for connected wallet
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!account?.publicKey) return;
      setLoadingTx(true);
      try {
        const connection = new Connection('https://devnet.helius-rpc.com/?api-key=e9488b8a-51f8-40d8-97ac-b63c7f563ae1');
        const signatures = await connection.getSignaturesForAddress(account.publicKey, { limit: 10 });
        const txs = await Promise.all(
          signatures.map(async (sig) => {
            try {
              return await connection.getTransaction(sig.signature);
            } catch (e) {
              return null;
            }
          })
        );
        const filteredTxs = txs.filter(Boolean);
        setTransactions(filteredTxs);

        // Extract unique addresses from transactions
        const addresses = new Set<string>();
        filteredTxs.forEach((tx: any) => {
          tx.transaction.message.accountKeys.forEach((key: any) => {
            addresses.add(key.toString());
          });
        });
        setTransactionAddresses(Array.from(addresses));
      } catch (error) {
        console.warn("Error fetching transactions:", error);
      }
      setLoadingTx(false);
    };
    fetchTransactions();
  }, [account?.publicKey]);

  // Save address with nickname
  const handleSaveNickname = () => {
    if (!nickname || !nicknameModal.address) return;
    addContact({
      name: nickname,
      address: nicknameModal.address,
      network: "Solana",
    });
    setSavedTxAddresses((prev) => [...prev, nicknameModal.address!]);
    setNickname("");
    setNicknameModal({ visible: false, address: null });
  };

   // Send crypto
  const handleSend = async () => {
    if (!sendModal.address || !account?.publicKey) return;

    // Validate amount
    if (!sendAmount || isNaN(Number(sendAmount)) || Number(sendAmount) <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount of SOL.");
      return;
    }

    setSending(true);
    try {
      let recipient;
      try {
        recipient = new PublicKey(sendModal.address);
      } catch (e) {
        Alert.alert("Invalid address", "The recipient address is not valid.");
        setSending(false);
        return;
      }
      const lamports = Math.floor(Number(sendAmount) * 1e9);
      const connection = new Connection('https://devnet.helius-rpc.com/?api-key=e9488b8a-51f8-40d8-97ac-b63c7f563ae1');
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: account.publicKey,
          toPubkey: recipient,
          lamports,
        })
      );
      await sendTransaction(tx, connection);
      const signature = await sendTransaction(tx, connection);
      if (!signature) throw new Error("No signature returned");
      // Optionally, confirm the transaction:
      // await connection.confirmTransaction(signature, "confirmed");
      Alert.alert("Success", "Transaction sent!");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to send transaction.");
    }
    setSending(false);
    setSendModal({ visible: false, address: null });
    setSendAmount("");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          padding: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Half: Saved Contacts */}
        <View style={{ flex: 1 }}>
          <Text className="font-baloo2-Bold text-text text-xl mb-2">Saved Contacts</Text>
          <TextInput
            placeholder="Search contacts by name"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-input text-text p-4 rounded-lg mb-4 font-baloo2-Regular text-base"
          />
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.address}
            renderItem={({ item }) => (
              <View className="flex-row items-center p-4 mb-2 bg-card rounded-xl shadow-sm border border-border/20">
                <View className="h-10 w-10 rounded-full bg-primary/20 items-center justify-center mr-3">
                  <Text className="font-baloo2-Bold text-primary text-lg">
                    {item.name.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-baloo2-SemiBold text-text text-lg">
                    {item.name}
                  </Text>
                  <Text className="font-baloo2-Regular text-textSecondary text-sm">
                    {item.network} • {item.address.substring(0, 4)}...{item.address.slice(-4)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedContact(item.address);
                    setModalVisible(true);
                  }}
                  className="bg-input p-2 rounded-lg mr-2"
                >
                  <FontAwesome name="trash" size={16} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-input p-2 rounded-lg mr-2"
                  // onPress={() => Clipboard.setStringAsync(item.address)}
                >
                  <FontAwesome name="copy" size={16} color="#2DD4BF" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-input p-2 rounded-lg mr-2"
                  onPress={() =>
                    router.push({
                      pathname: "/external/AddContact",
                      params: { contact: JSON.stringify(item) },
                    })
                  }
                >
                  <FontAwesome name="edit" size={16} color="#FACC15" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-input p-2 rounded-lg">
                  <FontAwesome name="paper-plane" size={16} color="#2DD4BF" />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 16 }}
            style={{ maxHeight: 320 }}
          />
        </View>

        {/* Bottom Half: Recent Transactions */}
        <View style={{ flex: 1, marginTop: 16 }}>
          <Text className="font-baloo2-Bold text-text text-xl mb-2">Recent Transactions</Text>
          {loadingTx ? (
            <Text className="text-textSecondary text-center my-8">Loading transactions...</Text>
          ) : transactions.length === 0 ? (
            <Text className="text-textSecondary text-center my-8">No transactions found.</Text>
          ) : (
            <FlatList
              data={transactions}
              // scrollEnabled={false}
              keyExtractor={(tx, idx) => tx.transaction.signatures[0] + idx}
              renderItem={({ item }) => {
                // Find all unique addresses in this transaction except self
                const addresses = item.transaction.message.accountKeys
                  .map((k: any) => k.toString())
                  .filter((addr: string) => addr !== account?.publicKey?.toString());
                return (
                  <View className="flex-row items-center p-4 mb-2 bg-card rounded-xl shadow-sm border border-border/20">
                    <View className="flex-1">
                      <Text className="font-baloo2-SemiBold text-text text-base">
                        Signature: {item.transaction.signatures[0].slice(0, 8)}...{item.transaction.signatures[0].slice(-8)}
                      </Text>
                      <Text className="font-baloo2-Regular text-textSecondary text-xs mt-1">
                        {addresses.length > 0 ? addresses[0].substring(0, 6) + "..." + addresses[0].slice(-4) : "No address"}
                      </Text>
                    </View>
                    {/* Save nickname button */}
                    {addresses[0] && !savedTxAddresses.includes(addresses[0]) && (
                      <TouchableOpacity
                        className="bg-primary/80 p-2 rounded-lg mr-2"
                        onPress={() => setNicknameModal({ visible: true, address: addresses[0] })}
                      >
                        <FontAwesome name="plus" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                    {/* Send button */}
                    {addresses[0] && (
                      <TouchableOpacity
                        className="bg-green-500 p-2 rounded-lg"
                        onPress={() => setSendModal({ visible: true, address: addresses[0] })}
                      >
                        <FontAwesome name="paper-plane" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
              contentContainerStyle={{ paddingBottom: 100 }}
              style={{ maxHeight: 320 }}
            />
          )}
        </View>
      </ScrollView>

      {/* Delete Contact Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-card w-full max-w-md p-6 rounded-xl shadow-lg border border-border">
            <Text className="font-baloo2-Bold text-text text-lg mb-3">
              Delete Saved Wallet
            </Text>
            <Text className="font-baloo2-Regular text-textSecondary text-base mb-6">
              Are you sure you want to delete this Saved Address? This action cannot be undone.
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
                  if (selectedContact) deleteContact(selectedContact);
                  setSelectedContact(null);
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

   {/* Nickname Modal */}
      <Modal
        visible={nicknameModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setNicknameModal({ visible: false, address: null })}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-card w-full max-w-md p-6 rounded-xl shadow-lg border border-border">
            <Text className="font-baloo2-Bold text-text text-lg mb-3">
              Save Wallet Address
            </Text>
            <TextInput
              placeholder="Enter nickname"
              value={nickname}
              onChangeText={setNickname}
              className="bg-input text-text p-4 rounded-lg mb-4 font-baloo2-Regular text-base"
            />
            <View className="flex-row justify-end space-x-3 gap-4">
              <TouchableOpacity
                onPress={() => setNicknameModal({ visible: false, address: null })}
                className="px-4 py-2 bg-input rounded-lg"
              >
                <Text className="text-text font-baloo2-Medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveNickname}
                className="px-4 py-2 bg-primary rounded-lg"
              >
                <Text className="text-white font-baloo2-Medium">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Send Modal */}
      <Modal
        visible={sendModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setSendModal({ visible: false, address: null })}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-card w-full max-w-md p-6 rounded-xl shadow-lg border border-border">
            <Text className="font-baloo2-Bold text-text text-lg mb-3">
              Send Crypto
            </Text>
            <Text className="font-baloo2-Regular text-textSecondary text-base mb-4">
              Enter amount (SOL) to send to this address.
            </Text>
            <TextInput
              placeholder="Amount in SOL"
              value={sendAmount}
              onChangeText={setSendAmount}
              keyboardType="decimal-pad"
              className="bg-input text-text p-4 rounded-lg mb-4 font-baloo2-Regular text-base"
            />
            <View className="flex-row justify-end space-x-3 gap-4">
              <TouchableOpacity
                onPress={() => setSendModal({ visible: false, address: null })}
                className="px-4 py-2 bg-input rounded-lg"
                disabled={sending}
              >
                <Text className="text-text font-baloo2-Medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSend}
                className="px-4 py-2 bg-green-500 rounded-lg"
                disabled={sending}
              >
                <Text className="text-white font-baloo2-Medium">{sending ? "Sending..." : "Send"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Contact Button */}
      <LinearGradient
        colors={["#6366F1", "#2DD4BF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute bottom-6 right-6 rounded-full shadow-lg"
        style={{ borderRadius: 100 }}
      >
        <TouchableOpacity
          className="p-4 w-16 h-16 items-center justify-center"
          onPress={() => router.push("/external/AddContact")}
        >
          <Text className="font-baloo2-Bold text-text text-3xl">+</Text>
        </TouchableOpacity>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}