import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { daftarMobil, formatRupiah } from '../../constants/dataMobil';
import { useAkun } from '../../context/AkunContext';
import { usePesanan } from '../../context/PesananContext';

export default function HalamanPesanan() {
  const { pengguna } = useAkun();
  const { daftarPesanan } = usePesanan();

  const pesananSaya = daftarPesanan.filter(
    (item) => item.email === pengguna?.email
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="h-16 px-5 justify-center">
        <Text className="font-jakarta-bold text-on-surface text-xl">Pesanan</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        {pesananSaya.length === 0 ? (
          <View className="items-center justify-center pt-24">
            <View className="w-20 h-20 rounded-full bg-surface-low items-center justify-center">
              <MaterialIcons name="receipt-long" size={36} color="#757684" />
            </View>
            <Text className="font-jakarta-bold text-on-surface text-lg mt-5">
              Belum ada pesanan
            </Text>
            <Text className="font-jakarta text-secondary text-xs text-center mt-2">
              Riwayat rental kamu akan muncul di halaman ini.
            </Text>
          </View>
        ) : (
          pesananSaya.map((item) => {
            const mobil = daftarMobil.find((m) => m.id === item.mobilId);

            return (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/penjemputan?id=${item.id}`)}
                className="bg-surface-lowest rounded-2xl p-4 border border-outline-variant/40 mb-3"
              >
                <View className="flex-row">
                  <View className="w-20 h-16 rounded-xl bg-surface-low items-center justify-center overflow-hidden">
                    {mobil && (
                      <Image
                        source={mobil.gambar}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    )}
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="font-jakarta-semibold text-[9px] tracking-widest text-secondary uppercase">
                      #{item.id}
                    </Text>
                    <Text className="font-jakarta-bold text-on-surface text-sm mt-0.5">
                      {mobil?.nama ?? 'Mobil'}
                    </Text>
                    <Text className="font-jakarta text-secondary text-[10px] mt-0.5">
                      {item.mulai} - {item.selesai}
                    </Text>
                  </View>
                  <View className="bg-secondary-container rounded-full px-2 py-1 self-start">
                    <Text className="font-jakarta-semibold text-[9px] text-primary">
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-outline-variant/30">
                  <Text className="font-jakarta text-secondary text-[11px]">
                    {item.hari} hari •{' '}
                    {item.denganSopir ? 'Dengan Sopir' : 'Lepas Kunci'}
                  </Text>
                  <Text className="font-jakarta-bold text-on-surface text-xs">
                    {formatRupiah(item.total)}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
