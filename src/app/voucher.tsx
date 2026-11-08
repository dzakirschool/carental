import { MaterialIcons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { daftarMobil, formatRupiah } from '../constants/dataMobil';
import { useAkun } from '../context/AkunContext';
import { usePesanan } from '../context/PesananContext';

export default function HalamanVoucher() {
  const { siap, pengguna } = useAkun();
  const { daftarPesanan, statusPesanan } = usePesanan();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const pesanan = daftarPesanan.find((item) => item.id === id);
  const mobil = daftarMobil.find((item) => item.id === pesanan?.mobilId);

  if (!siap) {
    return null;
  }

  if (!pengguna) {
    return <Redirect href="/" />;
  }

  if (!pesanan || !mobil) {
    return (
      <View className="flex-1 bg-surface items-center justify-center px-8">
        <MaterialIcons name="error-outline" size={48} color="#757684" />
        <Text className="font-jakarta-bold text-on-surface text-lg mt-4">
          Voucher tidak ditemukan
        </Text>
        <Pressable
          onPress={() => router.replace('/beranda')}
          className="mt-5 bg-primary-container px-5 py-3 rounded-xl"
        >
          <Text className="font-jakarta-semibold text-white text-sm">
            Kembali
          </Text>
        </Pressable>
      </View>
    );
  }

  const bagikan = async () => {
    await Share.share({
      message: `E-Voucher Carental #${pesanan.id}\n${mobil.nama}\n${pesanan.mulai} - ${pesanan.selesai}\nKode ambil unit: ${pesanan.pin}`,
    });
  };

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
          E-Voucher
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-5 pt-5">
          <View className="bg-primary rounded-2xl p-5">
            <View className="flex-row items-center justify-between">
              <Text className="font-jakarta-semibold text-[10px] tracking-widest text-white/70 uppercase">
                Carental E-Voucher
              </Text>
              <View className="bg-white/15 rounded-full px-2.5 py-1">
                <Text className="font-jakarta-semibold text-[10px] text-white">
                  {statusPesanan(pesanan)}
                </Text>
              </View>
            </View>
            <Text className="font-jakarta-bold text-white text-xl mt-3">
              {mobil.nama}
            </Text>
            <Text className="font-jakarta text-white/70 text-[11px] mt-1">
              #{pesanan.id} • {mobil.plat}
            </Text>

            <View className="flex-row items-center justify-between mt-4">
              <View>
                <Text className="font-jakarta-semibold text-[9px] tracking-widest text-white/60">
                  MULAI
                </Text>
                <Text className="font-jakarta-semibold text-white text-xs mt-0.5">
                  {pesanan.mulai}
                </Text>
              </View>
              <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
              <View>
                <Text className="font-jakarta-semibold text-[9px] tracking-widest text-white/60">
                  SELESAI
                </Text>
                <Text className="font-jakarta-semibold text-white text-xs mt-0.5">
                  {pesanan.selesai}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="bg-surface-lowest rounded-2xl p-5 border border-outline-variant/40 items-center">
            <View className="w-48 h-48 rounded-2xl bg-white border-2 border-dashed border-outline-variant items-center justify-center">
              <MaterialIcons name="qr-code-2" size={150} color="#00288E" />
            </View>
            <Text className="font-jakarta text-secondary text-[11px] text-center mt-4">
              Tunjukkan QR ini ke staf Hub saat pengambilan unit.
            </Text>

            <View className="w-full bg-surface-low rounded-xl p-3 flex-row items-center justify-between mt-4">
              <View>
                <Text className="font-jakarta-semibold text-[9px] tracking-widest text-on-surface-variant">
                  KODE AMBIL UNIT
                </Text>
                <Text className="font-jakarta-bold text-primary text-lg tracking-widest mt-0.5">
                  {pesanan.pin}
                </Text>
              </View>
              <View>
                <Text className="font-jakarta-semibold text-[9px] tracking-widest text-on-surface-variant">
                  TOTAL
                </Text>
                <Text className="font-jakarta-bold text-on-surface text-sm mt-0.5">
                  {formatRupiah(pesanan.total)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <Pressable
            onPress={bagikan}
            className="w-full h-[52px] rounded-xl bg-primary flex-row items-center justify-center"
          >
            <MaterialIcons name="share" size={19} color="#FFFFFF" />
            <Text className="font-jakarta-semibold text-white text-sm ml-2">
              Bagikan Voucher
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert('Simpan Voucher', 'Voucher tersimpan di menu Pesanan.')
            }
            className="w-full h-12 rounded-xl bg-surface-low items-center justify-center mt-3 flex-row"
          >
            <MaterialIcons name="download" size={19} color="#191C1E" />
            <Text className="font-jakarta-medium text-on-surface text-sm ml-2">
              Simpan
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
