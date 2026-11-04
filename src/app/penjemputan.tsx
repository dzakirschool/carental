import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { daftarMobil, formatRupiah } from '../constants/dataMobil';
import { useAkun } from '../context/AkunContext';
import { usePesanan } from '../context/PesananContext';

export default function HalamanPenjemputan() {
  const { siap, pengguna } = useAkun();
  const { daftarPesanan } = usePesanan();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [tersalin, setTersalin] = useState(false);

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
          Pesanan tidak ditemukan
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

  const salinPin = async () => {
    await Clipboard.setStringAsync(pesanan.pin);
    setTersalin(true);
    setTimeout(() => setTersalin(false), 1500);
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
          Konfirmasi Penjemputan
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 pt-6 items-center">
          <View className="w-16 h-16 rounded-full bg-secondary-container/60 items-center justify-center">
            <MaterialIcons name="check-circle" size={32} color="#1E40AF" />
          </View>
          <View className="bg-secondary-container rounded-full px-3 py-1 mt-3">
            <Text className="font-jakarta-semibold text-[10px] text-on-surface">
              {pesanan.status}
            </Text>
          </View>
          <Text className="font-jakarta-bold text-on-surface text-[22px] mt-2">
            Pembayaran Berhasil!
          </Text>
          <Text className="font-jakarta text-secondary text-[11px] mt-1">
            ID Pesanan: #{pesanan.id} • {pesanan.mulai}
          </Text>
        </View>

        <View className="px-5 pt-5">
          <View className="bg-surface-lowest rounded-2xl p-4 border border-outline-variant/40">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="font-jakarta-semibold text-[10px] tracking-widest text-primary uppercase">
                  {mobil.bahanBakar}
                </Text>
                <Text className="font-jakarta-bold text-on-surface text-base mt-0.5">
                  {mobil.nama}
                </Text>
                <Text className="font-jakarta text-secondary text-[11px] mt-0.5">
                  Plat No: {mobil.plat} • {mobil.warna}
                </Text>
              </View>
              <View className="bg-surface-low rounded-lg px-2.5 py-1">
                <Text className="font-jakarta-medium text-on-surface text-[10px]">
                  {mobil.transmisi}
                </Text>
              </View>
            </View>

            <View className="w-full h-36 rounded-xl bg-surface-low mt-3 items-center justify-center overflow-hidden">
              <Image
                source={mobil.gambarDetail}
                className="w-full h-full"
                resizeMode="contain"
              />
              <View className="absolute bottom-2 left-2 bg-surface-lowest/90 rounded-md px-2.5 py-1">
                <Text className="font-jakarta-medium text-on-surface text-[10px]">
                  {mobil.kategori === 'EV'
                    ? 'Sisa Baterai: 98% (420 km)'
                    : 'Bahan Bakar Penuh'}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2 mt-3">
              <View className="flex-1 bg-surface-low rounded-xl p-3">
                <Text className="font-jakarta-semibold text-[9px] tracking-widest text-on-surface-variant">
                  MULAI SEWA
                </Text>
                <Text className="font-jakarta-bold text-on-surface text-xs mt-1">
                  {pesanan.mulai}
                </Text>
                <Text className="font-jakarta text-secondary text-[10px] mt-0.5">
                  10:00 WIB
                </Text>
              </View>
              <View className="flex-1 bg-surface-low rounded-xl p-3">
                <Text className="font-jakarta-semibold text-[9px] tracking-widest text-on-surface-variant">
                  SELESAI SEWA
                </Text>
                <Text className="font-jakarta-bold text-on-surface text-xs mt-1">
                  {pesanan.selesai}
                </Text>
                <Text className="font-jakarta text-secondary text-[10px] mt-0.5">
                  10:00 WIB ({pesanan.hari} Hari)
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between bg-surface-low rounded-xl p-3 mt-3">
              <Text className="font-jakarta text-secondary text-xs">
                Total dibayar
              </Text>
              <Text className="font-jakarta-bold text-primary text-sm">
                {formatRupiah(pesanan.total)}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="bg-surface-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
            <View className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-secondary-container items-center justify-center">
                  <MaterialIcons name="location-on" size={18} color="#1E40AF" />
                </View>
                <View className="ml-2">
                  <Text className="font-jakarta-bold text-on-surface text-sm">
                    {pesanan.antarLokasi
                      ? 'Lokasi Pengantaran'
                      : 'Lokasi Pengambilan'}
                  </Text>
                  <Text className="font-jakarta text-secondary text-[10px] mt-0.5">
                    {pesanan.antarLokasi
                      ? 'Grand Residence Blok C4, BSD'
                      : 'BSD City, Tangerang Selatan'}
                  </Text>
                </View>
              </View>
              <View className="bg-surface-low rounded-full px-2.5 py-1">
                <Text className="font-jakarta-medium text-on-surface text-[10px]">
                  24 Jam
                </Text>
              </View>
            </View>

            <View className="px-4">
              <View className="w-full h-40 rounded-xl overflow-hidden">
                <Image
                  source={require('../../assets/images/map-bsd.png')}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute bottom-3 left-3 bg-surface-lowest/95 rounded-lg px-3 py-1.5 flex-row items-center">
                  <MaterialIcons name="near-me" size={16} color="#1E40AF" />
                  <Text className="font-jakarta-medium text-on-surface text-[10px] ml-1.5">
                    3.8 km dari posisi Anda
                  </Text>
                </View>
              </View>
            </View>

            <View className="p-4">
              <Text className="font-jakarta-bold text-on-surface text-sm">
                Carental Hub BSD City
              </Text>
              <Text className="font-jakarta text-secondary text-xs mt-1">
                Jl. BSD Grand Boulevard Kav. 12, Pagedangan, Tangerang
              </Text>

              <View className="bg-surface-low rounded-xl p-3 flex-row items-center justify-between mt-3">
                <View className="flex-row items-center">
                  <MaterialIcons name="pin" size={20} color="#444653" />
                  <View className="ml-2">
                    <Text className="font-jakarta-semibold text-[9px] tracking-widest text-on-surface-variant">
                      KODE AMBIL UNIT
                    </Text>
                    <Text className="font-jakarta-bold text-primary text-base tracking-widest mt-0.5">
                      {pesanan.pin}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={salinPin}
                  className="bg-surface-lowest rounded-lg px-3 py-1.5 flex-row items-center"
                >
                  <MaterialIcons
                    name={tersalin ? 'check' : 'content-copy'}
                    size={15}
                    color="#191C1E"
                  />
                  <Text className="font-jakarta-medium text-on-surface text-[10px] ml-1.5">
                    {tersalin ? 'Tersalin' : 'Salin'}
                  </Text>
                </Pressable>
              </View>

              <View className="flex-row gap-2 mt-3">
                <Pressable
                  onPress={() =>
                    Alert.alert('Petunjuk Arah', 'Membuka navigasi ke Carental Hub BSD City.')
                  }
                  className="flex-1 h-11 rounded-xl bg-surface-low flex-row items-center justify-center"
                >
                  <MaterialIcons name="directions" size={17} color="#1E40AF" />
                  <Text className="font-jakarta-medium text-on-surface text-[11px] ml-1.5">
                    Petunjuk Arah
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    Alert.alert('Hubungi Staf', 'Menghubungi staf Carental Hub BSD City.')
                  }
                  className="flex-1 h-11 rounded-xl bg-surface-low flex-row items-center justify-center"
                >
                  <MaterialIcons name="support-agent" size={17} color="#1E40AF" />
                  <Text className="font-jakarta-medium text-on-surface text-[11px] ml-1.5">
                    Hubungi Staf Hub
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="bg-surface-lowest rounded-2xl p-4 border border-outline-variant/40">
            <View className="flex-row items-center justify-between">
              <Text className="font-jakarta-bold text-on-surface text-sm">
                3 Langkah Pengambilan Unit
              </Text>
              <Text className="font-jakarta-semibold text-[9px] tracking-widest text-primary uppercase">
                Panduan Cepat
              </Text>
            </View>

            <View className="mt-3">
              <View className="flex-row items-start">
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Text className="font-jakarta-bold text-white text-[10px]">
                    1
                  </Text>
                </View>
                <View className="flex-1 ml-3">
                  <Text className="font-jakarta-semibold text-on-surface text-xs">
                    Verifikasi Dokumen
                  </Text>
                  <Text className="font-jakarta text-secondary text-[11px] mt-0.5">
                    Tunjukkan e-voucher di aplikasi beserta KTP & SIM A asli
                    kepada staf Hub.
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start mt-3">
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Text className="font-jakarta-bold text-white text-[10px]">
                    2
                  </Text>
                </View>
                <View className="flex-1 ml-3">
                  <Text className="font-jakarta-semibold text-on-surface text-xs">
                    Inspeksi & Serah Terima
                  </Text>
                  <Text className="font-jakarta text-secondary text-[11px] mt-0.5">
                    Cek fisik kendaraan bersama staf dan terima kunci pintar.
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start mt-3">
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Text className="font-jakarta-bold text-white text-[10px]">
                    3
                  </Text>
                </View>
                <View className="flex-1 ml-3">
                  <Text className="font-jakarta-semibold text-on-surface text-xs">
                    Mulai Berkendara
                  </Text>
                  <Text className="font-jakarta text-secondary text-[11px] mt-0.5">
                    Nikmati perjalananmu dengan {mobil.nama}.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <Pressable
            onPress={() => router.push('/pesanan')}
            className="w-full h-[52px] rounded-xl bg-primary flex-row items-center justify-center"
          >
            <MaterialIcons name="confirmation-number" size={19} color="#FFFFFF" />
            <Text className="font-jakarta-semibold text-white text-sm ml-2">
              Lihat E-Voucher / Tiket
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace('/beranda')}
            className="w-full h-12 rounded-xl bg-surface-low items-center justify-center mt-3"
          >
            <Text className="font-jakarta-medium text-on-surface text-sm">
              Kembali ke Beranda
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
