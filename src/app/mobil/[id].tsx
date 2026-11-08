import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '../../components/Avatar';
import { daftarMobil, formatRupiah } from '../../constants/dataMobil';

type InfoMobilProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  nilai: string;
};

function InfoMobil({ icon, label, nilai }: InfoMobilProps) {
  return (
    <View className="w-[48%] bg-surface-lowest rounded-xl p-3 flex-row items-center border border-outline-variant/40 mb-3">
      <View className="w-10 h-10 rounded-lg bg-surface-low items-center justify-center">
        <MaterialIcons name={icon} size={22} color="#1E40AF" />
      </View>
      <View className="ml-2.5 flex-1">
        <Text className="font-jakarta-semibold text-[9px] tracking-widest text-secondary uppercase">
          {label}
        </Text>
        <Text className="font-jakarta-bold text-on-surface text-[13px] mt-0.5">
          {nilai}
        </Text>
      </View>
    </View>
  );
}

export default function HalamanDetailMobil() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [favorit, setFavorit] = useState(false);
  const [denganSopir, setDenganSopir] = useState(false);
  const [antarLokasi, setAntarLokasi] = useState(false);

  const mobil = daftarMobil.find((item) => item.id === id);

  if (!mobil) {
    return (
      <View className="flex-1 bg-surface items-center justify-center px-8">
        <MaterialIcons name="error-outline" size={48} color="#757684" />
        <Text className="font-jakarta-bold text-on-surface text-lg mt-4">
          Mobil tidak ditemukan
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-5 bg-primary-container px-5 py-3 rounded-xl"
        >
          <Text className="font-jakarta-semibold text-white text-sm">
            Kembali
          </Text>
        </Pressable>
      </View>
    );
  }

  const harga = mobil.harga + (denganSopir ? 300000 : 0);

  return (
    <View className="flex-1 bg-surface">
      <View
        className="px-5 flex-row items-center justify-between border-b border-outline-variant/40 bg-surface"
        style={{ paddingTop: insets.top, height: insets.top + 56 }}
      >
        <View className="flex-row items-center flex-1">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 -ml-2 items-center justify-center"
            hitSlop={6}
          >
            <MaterialIcons name="arrow-back" size={24} color="#191C1E" />
          </Pressable>
          <Text className="font-jakarta-bold text-on-surface text-base ml-1">
            Detail Mobil
          </Text>
        </View>
        <Avatar ukuran={32} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        <View className="bg-surface-low px-5 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center bg-surface-lowest rounded-full px-3 py-1.5 border border-outline-variant/40">
              <View className="w-1.5 h-1.5 rounded-full bg-primary" />
              <Text className="font-jakarta-semibold text-[10px] tracking-widest text-primary ml-1.5">
                UNIT TERSEDIA
              </Text>
            </View>
            <Pressable
              onPress={() => setFavorit(!favorit)}
              className="w-9 h-9 rounded-full bg-surface-lowest items-center justify-center border border-outline-variant/40"
            >
              <MaterialIcons
                name={favorit ? 'favorite' : 'favorite-border'}
                size={20}
                color={favorit ? '#BA1A1A' : '#191C1E'}
              />
            </Pressable>
          </View>

          <Image
            source={mobil.gambarDetail}
            className="w-full h-56"
            resizeMode="contain"
          />

          <View className="flex-row items-center justify-center mt-4">
            <View className="w-6 h-1.5 rounded-full bg-primary" />
            <View className="w-1.5 h-1.5 rounded-full bg-surface-high ml-1.5" />
            <View className="w-1.5 h-1.5 rounded-full bg-surface-high ml-1.5" />
            <View className="w-1.5 h-1.5 rounded-full bg-surface-high ml-1.5" />
            <Text className="font-jakarta text-[11px] text-secondary ml-2">
              1/4
            </Text>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-jakarta-bold text-on-surface text-[26px]">
                {mobil.nama}
              </Text>
              <Text className="font-jakarta text-secondary text-[13px] mt-1">
                {mobil.deskripsi}
              </Text>
            </View>
            <View className="flex-row items-center bg-surface-container rounded-lg px-2.5 py-1.5">
              <MaterialIcons name="star" size={16} color="#872D00" />
              <Text className="font-jakarta-bold text-on-surface text-[13px] ml-1">
                {mobil.rating}
              </Text>
              <Text className="font-jakarta text-secondary text-[10px] ml-1">
                ({mobil.ulasan})
              </Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-5 flex-row flex-wrap justify-between">
          <InfoMobil icon="settings-input-component" label="Transmisi" nilai={mobil.transmisi} />
          <InfoMobil icon="battery-charging-full" label="Jarak Tempuh" nilai={mobil.jarakTempuh} />
          <InfoMobil icon="airline-seat-recline-normal" label="Kapasitas" nilai={`${mobil.kursi} Kursi`} />
          <InfoMobil icon="bolt" label="Tenaga" nilai={mobil.tenaga} />
        </View>

        <View className="px-5 pt-2">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-jakarta-bold text-on-surface text-base">
              Opsi Pengemudi
            </Text>
            <Text className="font-jakarta text-[11px] text-secondary">
              Fleksibel
            </Text>
          </View>
          <View className="bg-surface-container p-1 rounded-xl flex-row">
            <Pressable
              onPress={() => setDenganSopir(false)}
              className={`flex-1 py-2.5 rounded-lg flex-row items-center justify-center ${
                !denganSopir ? 'bg-surface-lowest' : ''
              }`}
            >
              <MaterialIcons
                name="key"
                size={17}
                color={!denganSopir ? '#1E40AF' : '#565E74'}
              />
              <Text
                className={`font-jakarta-semibold text-xs ml-1.5 ${
                  !denganSopir ? 'text-primary-container' : 'text-secondary'
                }`}
              >
                Lepas Kunci
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setDenganSopir(true)}
              className={`flex-1 py-2.5 rounded-lg flex-row items-center justify-center ${
                denganSopir ? 'bg-surface-lowest' : ''
              }`}
            >
              <MaterialIcons
                name="person"
                size={17}
                color={denganSopir ? '#1E40AF' : '#565E74'}
              />
              <Text
                className={`font-jakarta-semibold text-xs ml-1.5 ${
                  denganSopir ? 'text-primary-container' : 'text-secondary'
                }`}
              >
                Dengan Sopir
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="px-5 pt-5">
          <Text className="font-jakarta-bold text-on-surface text-base mb-2">
            Lokasi & Pengambilan
          </Text>
          <View className="bg-surface-lowest rounded-xl p-4 border border-outline-variant/40">
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setAntarLokasi(false)}
                className={`flex-1 py-2 rounded-lg flex-row items-center justify-center ${
                  !antarLokasi ? 'bg-surface-low' : 'border border-outline-variant/50'
                }`}
              >
                <MaterialIcons
                  name="storefront"
                  size={17}
                  color={!antarLokasi ? '#1E40AF' : '#565E74'}
                />
                <Text
                  className={`font-jakarta-semibold text-[11px] ml-1.5 ${
                    !antarLokasi ? 'text-primary-container' : 'text-secondary'
                  }`}
                >
                  Ambil di Pool
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setAntarLokasi(true)}
                className={`flex-1 py-2 rounded-lg flex-row items-center justify-center ${
                  antarLokasi ? 'bg-surface-low' : 'border border-outline-variant/50'
                }`}
              >
                <MaterialIcons
                  name="local-shipping"
                  size={17}
                  color={antarLokasi ? '#1E40AF' : '#565E74'}
                />
                <Text
                  className={`font-jakarta-semibold text-[11px] ml-1.5 ${
                    antarLokasi ? 'text-primary-container' : 'text-secondary'
                  }`}
                >
                  Antar ke Lokasi
                </Text>
              </Pressable>
            </View>

            <View className="flex-row items-start mt-4">
              <View className="w-9 h-9 rounded-full bg-surface-low items-center justify-center">
                <MaterialIcons name="pin-drop" size={20} color="#1E40AF" />
              </View>
              <View className="flex-1 ml-2.5">
                <View className="flex-row items-center justify-between">
                  <Text className="font-jakarta-semibold text-on-surface text-[13px] flex-1">
                    {antarLokasi ? 'Alamat Pengantaran' : 'Pool Carental Soekarno-Hatta'}
                  </Text>
                  <Text className="font-jakarta-bold text-[9px] tracking-wide text-primary uppercase">
                    Buka 24 Jam
                  </Text>
                </View>
                <Text className="font-jakarta text-secondary text-[11px] mt-1">
                  {antarLokasi
                    ? 'Grand Residence Blok C4, BSD'
                    : 'Terminal 3 Domestik, Area Parkir Premium B2'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="bg-surface-low rounded-xl p-4 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <MaterialIcons name="verified-user" size={20} color="#1E40AF" />
              <Text className="font-jakarta-medium text-on-surface text-xs ml-2 flex-1">
                Proteksi Penuh & Asuransi All-Risk
              </Text>
            </View>
            <Text className="font-jakarta-bold text-[9px] tracking-widest text-secondary uppercase">
              Termasuk
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-surface px-5 pt-3 border-t border-outline-variant/40"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-jakarta-semibold text-[9px] tracking-widest text-secondary uppercase">
              Total Sewa
            </Text>
            <View className="flex-row items-baseline mt-0.5">
              <Text className="font-jakarta-bold text-on-surface text-xl">
                {formatRupiah(harga)}
              </Text>
              <Text className="font-jakarta text-[11px] text-secondary ml-1">
                /hari
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/pembayaran',
                params: {
                  id: mobil.id,
                  sopir: denganSopir ? '1' : '0',
                  antar: antarLokasi ? '1' : '0',
                },
              })
            }
            className="h-[52px] px-6 bg-primary rounded-xl flex-row items-center"
          >
            <Text className="font-jakarta-semibold text-white text-sm">
              Lanjut Sewa
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
              style={{ marginLeft: 6 }}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
