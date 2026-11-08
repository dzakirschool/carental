import { MaterialIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAkun } from '../context/AkunContext';

const daftarNotifikasi = [
  {
    id: '1',
    ikon: 'local-offer',
    judul: 'Diskon 20% Armada Listrik',
    isi: 'Berlaku sampai akhir bulan untuk semua mobil EV.',
    waktu: 'Hari ini',
  },
  {
    id: '2',
    ikon: 'verified',
    judul: 'Akun Terverifikasi',
    isi: 'Sekarang kamu bisa langsung menyewa tanpa verifikasi tambahan.',
    waktu: 'Kemarin',
  },
  {
    id: '3',
    ikon: 'support-agent',
    judul: 'Layanan Pelanggan 24 Jam',
    isi: 'Hubungi kami kapan saja lewat menu Bantuan.',
    waktu: '3 hari lalu',
  },
];

export default function HalamanNotifikasi() {
  const { siap, pengguna } = useAkun();
  const insets = useSafeAreaInsets();

  if (!siap) {
    return null;
  }

  if (!pengguna) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 bg-surface">
      <View
        className="px-5 flex-row items-center bg-surface border-b border-outline-variant/40"
        style={{ paddingTop: insets.top, height: insets.top + 56 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 -ml-2 items-center justify-center"
          hitSlop={6}
        >
          <MaterialIcons name="arrow-back" size={24} color="#191C1E" />
        </Pressable>
        <Text className="font-jakarta-bold text-on-surface text-base ml-1">
          Notifikasi
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {daftarNotifikasi.map((item) => (
          <View
            key={item.id}
            className="bg-surface-lowest rounded-2xl p-4 border border-outline-variant/40 mb-3 flex-row"
          >
            <View className="w-10 h-10 rounded-full bg-secondary-container items-center justify-center">
              <MaterialIcons name={item.ikon as any} size={20} color="#1E40AF" />
            </View>
            <View className="flex-1 ml-3">
              <View className="flex-row items-center justify-between">
                <Text className="font-jakarta-bold text-on-surface text-sm flex-1">
                  {item.judul}
                </Text>
                <Text className="font-jakarta text-outline text-[10px]">
                  {item.waktu}
                </Text>
              </View>
              <Text className="font-jakarta text-secondary text-[11px] mt-1">
                {item.isi}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
