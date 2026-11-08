import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Avatar from '../../components/Avatar';
import { useAkun } from '../../context/AkunContext';
import { usePesanan } from '../../context/PesananContext';

export default function HalamanProfil() {
  const { pengguna, keluar } = useAkun();
  const { daftarPesanan } = usePesanan();

  const jumlahPesanan = daftarPesanan.filter(
    (item) => item.email === pengguna?.email
  ).length;

  const handleKeluar = async () => {
    await keluar();
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="h-16 px-5 justify-center">
          <Text className="font-jakarta-bold text-on-surface text-xl">
            Profil
          </Text>
        </View>

        <View className="items-center px-5 pt-2">
          <Avatar ukuran={80} />
          <Text className="font-jakarta-bold text-on-surface text-lg mt-4">
            {pengguna?.nama ?? 'Pengguna'}
          </Text>
          <Text className="font-jakarta text-secondary text-xs mt-1">
            {pengguna?.email ?? ''}
          </Text>
        </View>

        <View className="mx-5 mt-6 bg-surface-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
          <View className="px-4 py-3.5 border-b border-outline-variant/30">
            <Text className="font-jakarta-semibold text-[10px] tracking-widest text-secondary">
              NAMA
            </Text>
            <Text className="font-jakarta-medium text-on-surface text-sm mt-1">
              {pengguna?.nama ?? '-'}
            </Text>
          </View>
          <View className="px-4 py-3.5 border-b border-outline-variant/30">
            <Text className="font-jakarta-semibold text-[10px] tracking-widest text-secondary">
              EMAIL
            </Text>
            <Text className="font-jakarta-medium text-on-surface text-sm mt-1">
              {pengguna?.email ?? '-'}
            </Text>
          </View>
          <View className="px-4 py-3.5">
            <Text className="font-jakarta-semibold text-[10px] tracking-widest text-secondary">
              NOMOR HP
            </Text>
            <Text className="font-jakarta-medium text-on-surface text-sm mt-1">
              {pengguna?.telepon ? pengguna.telepon : 'Belum diisi'}
            </Text>
          </View>
        </View>

        <View className="mx-5 mt-3 bg-surface-lowest rounded-2xl border border-outline-variant/40 px-4 py-4 flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-secondary-container items-center justify-center">
            <MaterialIcons name="receipt-long" size={20} color="#1E40AF" />
          </View>
          <View className="flex-1 ml-3">
            <Text className="font-jakarta-semibold text-[10px] tracking-widest text-secondary">
              TOTAL PESANAN
            </Text>
            <Text className="font-jakarta-bold text-on-surface text-base mt-0.5">
              {jumlahPesanan} pesanan
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/profil-edit')}
          className="mx-5 mt-3 h-12 rounded-xl bg-primary-container items-center justify-center flex-row"
        >
          <MaterialIcons name="edit" size={18} color="#FFFFFF" />
          <Text className="font-jakarta-semibold text-white text-sm ml-2">
            Edit Profil
          </Text>
        </Pressable>

        <Pressable
          onPress={handleKeluar}
          className="mx-5 mt-3 h-12 rounded-xl border border-error/30 bg-red-50 items-center justify-center flex-row"
        >
          <MaterialIcons name="logout" size={18} color="#BA1A1A" />
          <Text className="font-jakarta-semibold text-error text-sm ml-2">
            Keluar
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
