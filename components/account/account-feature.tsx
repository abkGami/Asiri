import { AccountUiBalance } from '@/components/account/account-ui-balance'
import { useGetBalanceInvalidate } from '@/components/account/use-get-balance'
import { useGetTokenAccountsInvalidate } from '@/components/account/use-get-token-accounts'
import { AppPage } from '@/components/app-page'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { WalletUiConnectButton } from '@/components/solana/wallet-ui-dropdown'
import { ellipsify } from '@/utils/ellipsify'
import { Connection, PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, ScrollView, Text, View } from 'react-native'
import { useAppTheme } from '../app-theme'
import { AccountUiButtons } from './account-ui-buttons'

export function AccountFeature() {
  const { account } = useWalletUi()
  const { spacing } = useAppTheme()
  const [refreshing, setRefreshing] = useState(false)
  const invalidateBalance = useGetBalanceInvalidate({ address: account?.publicKey as PublicKey })
  const invalidateTokenAccounts = useGetTokenAccountsInvalidate({ address: account?.publicKey as PublicKey })
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([invalidateBalance(), invalidateTokenAccounts()])
    setRefreshing(false)
  }, [invalidateBalance, invalidateTokenAccounts])
  const [transactions, setTransactions] = useState<any[]>([])
  const [transactionAddresses, setTransactionAddresses] = useState<string[]>([])

   useEffect(() => {
    const fetchTransactions = async () => {
      if (!account?.publicKey) return
      try {
        const connection = new Connection('https://devnet.helius-rpc.com/?api-key=e9488b8a-51f8-40d8-97ac-b63c7f563ae1')
        // const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=e9488b8a-51f8-40d8-97ac-b63c7f563ae1')
        const signatures = await connection.getSignaturesForAddress(account.publicKey, { limit: 10 })
        const txs = await Promise.all(
          signatures.map(async (sig) => {
            try {
              return await connection.getTransaction(sig.signature)
            } catch (e) {
              return null
            }
          })
        )
        const filteredTxs = txs.filter(Boolean)
        setTransactions(filteredTxs)

        // Extract and save unique wallet addresses from transactions
        const addresses = new Set<string>()
        filteredTxs.forEach((tx: any) => {
          tx.transaction.message.accountKeys.forEach((key: any) => {
            addresses.add(key.toString())
          })
        })
        setTransactionAddresses(Array.from(addresses))
      } catch (error) {
        console.warn('Error fetching transactions:', error)
      }
    }
    fetchTransactions()
  }, [account?.publicKey])

  return (
    <AppPage>
      {account ? (
        <ScrollView
          contentContainerStyle={{}}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
        >
          <View>
            {/* <Text className='text-white'>{account.publicKey.toString()}</Text> */}
          </View>
          <AppView style={{ alignItems: 'center', gap: 4 }}>
            <AccountUiBalance address={account.publicKey} />
            <AppText style={{ opacity: 0.7 }}>{ellipsify(account.publicKey.toString(), 8)}</AppText>
          </AppView>
          <AppView style={{ marginTop: spacing.md, alignItems: 'center' }}>
            <AccountUiButtons />
          </AppView>
          {/* <AppView style={{ marginTop: spacing.md, alignItems: 'center' }}>
            <AccountUiTokenAccounts address={account.publicKey} />
          </AppView> */}

          {/* /for viewing transactions  */}
                   <AppView style={{ marginTop: spacing.md }}>
            <AppText variant="titleMedium">Recent Transactions</AppText>
            {transactions.length === 0 ? (
              <AppText>No transactions found.</AppText>
            ) : (
              transactions.map((tx, idx) => (
                <AppText key={idx} style={{ fontSize: 12, marginVertical: 2 }}>
                  Signature: {tx.transaction.signatures[0]}
                </AppText>
              ))
            )}
          </AppView>
            <Text className='font-baloo2-Bold text-red-500 bg-red-200'>Wallet Addresses</Text>
          <AppView style={{ marginTop: spacing.md }}>
            <AppText variant="titleMedium">Wallet Addresses in Recent Transactions</AppText>
            {transactionAddresses.length === 0 ? (
              <AppText>No addresses found.</AppText>
            ) : (
              transactionAddresses.map((address, idx) => (
                <AppText key={idx} style={{ fontSize: 12, marginVertical: 2 }}>
                  {address}
                </AppText>
              ))
            )}
          </AppView>
        </ScrollView>
      ) : (
        <AppView style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
          <AppText variant="titleMedium">Connect your wallet.</AppText>
          <WalletUiConnectButton />
        </AppView>
      )}
    </AppPage>
  )
}
