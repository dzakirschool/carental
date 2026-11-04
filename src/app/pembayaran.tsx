import { MaterialIcons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  daftarMobil,
  formatRupiah,
  formatTanggal,
  tambahHari,
} from '../constants/dataMobil';
import { useAkun } from '../context/AkunContext';
import { usePesanan } from '../context/PesananContext';

const metodeBayar = [
  {
    kode: 'bca',
    label: 'BCA Virtual Account',
    ket: 'Konfirmasi otomatis tanpa upload struk',
    ikon: 'account-balance',
  },
  {
    kode: 'mandiri',
    label: 'Mandiri Virtual Account',
    ket: "Transfer Livin' by Mandiri",
    ikon: 'account-balance',
  },
  {
    kode: 'qris',
    label: 'QRIS Universal',
    ket: 'BCA, Dana, OVO, ShopeePay',
    ikon: 'qr-code-2',
  },
  {
    kode: 'gopay',
    label: 'GoPay Wallet',
    ket: 'Langsung tersambung ke GoPay app',
    ikon: 'account-balance-wallet',
  },
];

export default function HalamanPembayaran() {
  const { siap, pengguna } = useAkun();
  const { tambahPesanan } = usePesanan();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    sopir?: string;
    antar?: string;
  }>();

  const [hari, setHari] = useState(2);
  const [metode, setMetode] = useState('bca');
  const [antarLokasi, setAntarLokasi] = useState(params.antar === '1');
  const [denganSopir] = useState(params.sopir === '1');
  const [sedangBayar, setSedangBayar] = useState(false);

  const mobil = daftarMobil.find((item) => item.id === params.id);

  if (!siap) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  if (!pengguna) {
    return <Redirect href="/" />;
  }

  if (!mobil) {
    return (
      <View className="flex-1 bg-surface items-center justify-center px-8">
        <MaterialIcons name="error-outline" size={48} color="#757684" />
        <Text className="font-jakarta-bold text-on-surface text-lg mt-4">
          Mobil tidak ditemukan
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

  const biayaSewa = (mobil.harga + (denganSopir ? 300000 : 0)) * hari;
  const asuransi = 100000;
  const deposit = 500000;
  const total = biayaSewa + asuransi + deposit;
  const tanggalMulai = formatTanggal(tambahHari(0));
  const tanggalSelesai = formatTanggal(tambahHari(hari));

  const bayar = async () => {
    if (sedangBayar) {
      return;
    }

    setSedangBayar(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const pesanan = await tambahPesanan({
      email: pengguna.email,
      mobilId: mobil.id,
      mulai: tanggalMulai,
      selesai: tanggalSelesai,
      hari,
      denganSopir,
      antarLokasi,
      metode,
      total,
    });

    router.replace({ pathname: '/penjemputan', params: { id: pesanan.id } });
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
          Konfirmasi Pembayaran
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View className="px-5 pt-4">
          <View className="bg-surface-low rounded-full p-1.5 flex-row items-center justify-between">
            <View className="flex-row items-center pl-3">
              <View className="w-5 h-5 rounded-full bg-primary-container items-center justify-center">
                <MaterialIcons name="check" size={12} color="#FFFFFF" />
              </View>
              <Text className="font-jakarta-medium text-[11px] text-on-surface ml-1.5">
                Pilih Unit
              </Text>
            </View>
            <View className="w-6 h-0.5 bg-surface-high rounded-full" />
            <View className="flex-row items-center bg-surface-lowest rounded-full px-3 py-1">
              <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
                <Text className="font-jakarta-bold text-white text-[10px]">
                  2
                </Text>
              </View>
              <Text className="font-jakarta-semibold text-[11px] text-primary ml-1.5">
                Konfirmasi
              </Text>
            </View>
            <View className="w-6 h-0.5 bg-surface-high rounded-full" />
            <View className="flex-row items-center pr-3 opacity-40">
              <View className="w-5 h-5 rounded-full bg-surface-high items-center justify-center">
                <Text className="font-jakarta-bold text-on-surface-variant text-[10px]">
                  3
                </Text>
              </View>
              <Text className="font-jakarta-medium text-[11px] text-on-surface-variant ml-1.5">
                Selesai
              </Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="bg-surface-lowest rounded-2xl p-4 border border-outline-variant/40">
            <View className="flex-row">
              <View className="w-24 h-20 rounded-xl bg-surface-low items-center justify-center overflow-hidden">
                <Image
                  source={mobil.gambar}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
              <View className="flex-1 ml-3">
                <Text className="font-jakarta-semibold text-[10px] tracking-widest text-secondary uppercase">
                  {mobil.merek} Motor
                </Text>
                <Text className="font-jakarta-bold text-on-surface text-base mt-0.5">
                  {mobil.nama}
                </Text>
                <Text className="font-jakarta text-secondary text-[11px] mt-0.5">
                  {mobil.transmisi} • {denganSopir ? 'Dengan Sopir' : 'Lepas Kunci'}
                </Text>
                <View className="flex-row items-center mt-2">
                  <MaterialIcons name="verified" size={15} color="#1E40AF" />
                  <Text className="font-jakarta-medium text-[10px] text-primary ml-1">
                    Garansi Unit Bersih & Prima
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-surface-low rounded-xl p-3 flex-row items-center justify-between mt-3">
              <View className="flex-row items-center">
                <MaterialIcons name="calendar-month" size={20} color="#565E74" />
                <View className="ml-2">
                  <Text className="font-jakarta-semibold text-[9px] tracking-widest text-on-surface-variant">
                    PERIODE RENTAL
                  </Text>
                  <Text className="font-jakarta-semibold text-on-surface text-xs mt-0.5">
                    {tanggalMulai} - {tanggalSelesai}
                  </Text>
                </View>
              </View>
              <View className="bg-surface-lowest rounded-full px-2.5 py-1">
                <Text className="font-jakarta-semibold text-[10px] text-primary">
                  {hari} Hari
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <Text className="font-jakarta-bold text-on-surface text-sm mb-2">
            Durasi Sewa
          </Text>
          <View className="flex-row gap-2">
            {[1, 2, 3].map((jumlah) => {
              const aktif = hari === jumlah;
              return (
                <Pressable
                  key={jumlah}
                  onPress={() => setHari(jumlah)}
                  className={`flex-1 py-2.5 rounded-xl items-center border ${
                    aktif
                      ? 'bg-primary border-primary'
                      : 'bg-surface-lowest border-outline-variant/50'
                  }`}
                >
                  <Text
                    className={`font-jakarta-semibold text-xs ${
                      aktif ? 'text-white' : 'text-on-surface-variant'
                    }`}
                  >
                    {jumlah} Hari
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="bg-surface-lowest rounded-2xl p-4 border border-outline-variant/40">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-jakarta-bold text-on-surface text-sm">
                Metode Pengambilan
              </Text>
              <View className="bg-primary rounded-full px-2 py-0.5">
                <Text className="font-jakarta-semibold text-white text-[9px]">
                  Gratis Antar Cabang
                </Text>
              </View>
            </View>
            <View className="bg-surface-low p-1 rounded-xl flex-row">
              <Pressable
                onPress={() => setAntarLokasi(false)}
                className={`flex-1 py-2.5 rounded-lg flex-row items-center justify-center ${
                  !antarLokasi ? 'bg-surface-lowest' : ''
                }`}
              >
                <MaterialIcons
                  name="store"
                  size={17}
                  color={!antarLokasi ? '#191C1E' : '#565E74'}
                />
                <Text
                  className={`font-jakarta-semibold text-[11px] ml-1.5 ${
                    !antarLokasi ? 'text-on-surface' : 'text-secondary'
                  }`}
                >
                  Ambil Sendiri
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setAntarLokasi(true)}
                className={`flex-1 py-2.5 rounded-lg flex-row items-center justify-center ${
                  antarLokasi ? 'bg-surface-lowest' : ''
                }`}
              >
                <MaterialIcons
                  name="local-shipping"
                  size={17}
                  color={antarLokasi ? '#191C1E' : '#565E74'}
                />
                <Text
                  className={`font-jakarta-semibold text-[11px] ml-1.5 ${
                    antarLokasi ? 'text-on-surface' : 'text-secondary'
                  }`}
                >
                  Antar ke Lokasi
                </Text>
              </Pressable>
            </View>
            <View className="bg-surface-low rounded-xl p-3 flex-row items-start mt-3">
              <MaterialIcons
                name={antarLokasi ? 'home' : 'location-on'}
                size={20}
                color="#1E40AF"
              />
              <View className="flex-1 ml-2">
                <Text className="font-jakarta-semibold text-on-surface text-xs">
                  {antarLokasi
                    ? 'Alamat Pengantaran'
                    : 'Carental Hub BSD City'}
                </Text>
                <Text className="font-jakarta text-secondary text-[11px] mt-0.5">
                  {antarLokasi
                    ? 'Alamat tersimpan: Grand Residence Blok C4, BSD'
                    : 'Jl. BSD Grand Boulevard Kav. 12, Tangerang'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="bg-surface-lowest rounded-2xl p-4 border border-outline-variant/40">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-jakarta-bold text-on-surface text-sm">
                Metode Pembayaran
              </Text>
              <Text className="font-jakarta-semibold text-[9px] tracking-widest text-secondary uppercase">
                Instan Verifikasi
              </Text>
            </View>

            <View className="gap-2">
              {metodeBayar.map((item) => {
                const aktif = metode === item.kode;
                return (
                  <Pressable
                    key={item.kode}
                    onPress={() => setMetode(item.kode)}
                    className={`p-3.5 rounded-xl flex-row items-center justify-between border ${
                      aktif
                        ? 'bg-secondary-container/40 border-primary/30'
                        : 'bg-surface-low border-transparent'
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-7 rounded bg-surface-lowest items-center justify-center">
                        <MaterialIcons
                          name={item.ikon as any}
                          size={18}
                          color="#1E40AF"
                        />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="font-jakarta-semibold text-on-surface text-xs">
                          {item.label}
                        </Text>
                        <Text className="font-jakarta text-secondary text-[10px] mt-0.5">
                          {item.ket}
                        </Text>
                      </View>
                    </View>
                    <View
                      className={`w-5 h-5 rounded-full items-center justify-center ${
                        aktif ? 'bg-primary' : 'bg-surface-high'
                      }`}
                    >
                      {aktif && (
                        <MaterialIcons name="check" size={13} color="#FFFFFF" />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="bg-surface-lowest rounded-2xl p-4 border border-outline-variant/40">
            <View className="flex-row items-center justify-between pb-2">
              <Text className="font-jakarta-bold text-on-surface text-sm">
                Rincian Pembayaran
              </Text>
              <View className="bg-surface-low rounded px-2 py-0.5">
                <Text className="font-jakarta-semibold text-[9px] tracking-wide text-secondary">
                  IDR
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between py-1.5">
              <Text className="font-jakarta text-secondary text-xs">
                Biaya Sewa ({hari} hari)
              </Text>
              <Text className="font-jakarta-medium text-on-surface text-xs">
                {formatRupiah(biayaSewa)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between py-1.5">
              <Text className="font-jakarta text-secondary text-xs">
                Asuransi Dasar
              </Text>
              <Text className="font-jakarta-medium text-on-surface text-xs">
                {formatRupiah(asuransi)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between py-1.5">
              <View className="flex-row items-center">
                <Text className="font-jakarta text-secondary text-xs">
                  Deposit Keamanan
                </Text>
                <View className="bg-secondary-container rounded px-1.5 py-0.5 ml-1.5">
                  <Text className="font-jakarta-semibold text-[8px] text-primary">
                    REFUNDABLE
                  </Text>
                </View>
              </View>
              <Text className="font-jakarta-medium text-on-surface text-xs">
                {formatRupiah(deposit)}
              </Text>
            </View>
            <View className="bg-surface-low rounded-xl p-3 flex-row items-center justify-between mt-3">
              <View>
                <Text className="font-jakarta-semibold text-[9px] tracking-widest text-on-surface-variant uppercase">
                  Total Pembayaran
                </Text>
                <Text className="font-jakarta text-secondary text-[10px] mt-0.5">
                  Termasuk pajak & asuransi
                </Text>
              </View>
              <Text className="font-jakarta-bold text-primary text-lg">
                {formatRupiah(total)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-surface px-5 pt-3 border-t border-outline-variant/40"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-jakarta-semibold text-[9px] tracking-widest text-on-surface-variant uppercase">
              Total Tagihan
            </Text>
            <Text className="font-jakarta-bold text-on-surface text-lg mt-0.5">
              {formatRupiah(total)}
            </Text>
          </View>
          <Pressable
            onPress={bayar}
            disabled={sedangBayar}
            className={`h-[52px] px-6 bg-primary rounded-xl flex-row items-center ${
              sedangBayar ? 'opacity-70' : ''
            }`}
          >
            {sedangBayar ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text className="font-jakarta-semibold text-white text-sm">
                  Bayar Sekarang
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                  style={{ marginLeft: 6 }}
                />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
