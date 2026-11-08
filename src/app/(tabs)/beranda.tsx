import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import KartuMobil from '../../components/KartuMobil';
import { daftarMobil } from '../../constants/dataMobil';

const kategoriList = ['Semua', 'SUV', 'Sedan', 'EV', 'MPV'];

export default function HalamanBeranda() {
  const [cari, setCari] = useState('');
  const [kategori, setKategori] = useState('Semua');

  const mobilTampil = daftarMobil.filter((mobil) => {
    const cocokKategori = kategori === 'Semua' || mobil.kategori === kategori;
    const kataKunci = cari.toLowerCase();
    const cocokCari =
      mobil.nama.toLowerCase().includes(kataKunci) ||
      mobil.merek.toLowerCase().includes(kataKunci);
    return cocokKategori && cocokCari;
  });

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="h-16 px-5 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-8 h-8 rounded-lg bg-primary items-center justify-center">
            <MaterialIcons name="directions-car" size={20} color="#FFFFFF" />
          </View>
          <Pressable className="flex-row items-center bg-surface-container rounded-full px-2.5 py-1 ml-3">
            <MaterialIcons name="near-me" size={14} color="#1E40AF" />
            <Text className="font-jakarta-medium text-[11px] text-on-surface mx-1.5">
              Jakarta, ID
            </Text>
            <MaterialIcons name="expand-more" size={16} color="#444653" />
          </Pressable>
        </View>
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.push('/notifikasi')}
            className="w-9 h-9 items-center justify-center"
          >
            <MaterialIcons name="notifications-none" size={22} color="#444653" />
          </Pressable>
          <Image
            source={require('../../../assets/images/avatar.png')}
            className="w-8 h-8 rounded-full ml-1"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-5 pt-1">
          <View className="w-full flex-row items-center bg-surface-low rounded-full px-4 py-2.5 border border-outline-variant/40">
            <MaterialIcons name="search" size={20} color="#757684" />
            <TextInput
              className="flex-1 font-jakarta text-on-surface text-sm mx-2"
              placeholder="Cari mobil impian..."
              placeholderTextColor="#757684"
              value={cari}
              onChangeText={setCari}
            />
            <View className="w-8 h-8 rounded-full bg-surface-lowest items-center justify-center">
              <MaterialIcons name="tune" size={18} color="#191C1E" />
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 6 }}
        >
          {kategoriList.map((item) => {
            const aktif = kategori === item;
            return (
              <Pressable
                key={item}
                onPress={() => setKategori(item)}
                className={`px-4 py-1.5 rounded-full ${
                  aktif
                    ? 'bg-primary'
                    : 'bg-surface-lowest border border-outline-variant/50'
                }`}
              >
                <Text
                  className={`font-jakarta-semibold text-[11px] tracking-wide ${
                    aktif ? 'text-white' : 'text-on-surface-variant'
                  }`}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View className="mx-5 mt-2 rounded-2xl bg-surface-lowest border border-outline-variant/50 p-4 overflow-hidden">
          <View className="flex-row items-start justify-between">
            <View>
              <View className="self-start bg-secondary-container rounded-full px-2 py-0.5 mb-1">
                <Text className="font-jakarta-bold text-[10px] tracking-wide text-primary-container">
                  DISKON 20%
                </Text>
              </View>
              <Text className="font-jakarta-bold text-on-surface text-lg">
                Eksplorasi Akhir Pekan
              </Text>
            </View>
            <View className="w-8 h-8 rounded-full bg-surface-low items-center justify-center">
              <MaterialIcons name="bolt" size={18} color="#1E40AF" />
            </View>
          </View>
          <Image
            source={require('../../../assets/images/banner-ev.png')}
            className="w-full h-28 my-1"
            resizeMode="contain"
          />
          <View className="flex-row items-center justify-between">
            <Text className="font-jakarta text-[11px] text-on-surface-variant">
              Khusus armada listrik pilihan
            </Text>
            <Pressable className="flex-row items-center">
              <Text className="font-jakarta-semibold text-[11px] text-primary-container">
                Klaim
              </Text>
              <MaterialIcons name="arrow-forward" size={14} color="#1E40AF" />
            </Pressable>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-jakarta-bold text-on-surface text-lg">
              Armada Pilihan
            </Text>
            <Text className="font-jakarta-bold text-[10px] tracking-widest text-outline uppercase">
              Jakarta Area
            </Text>
          </View>

          {mobilTampil.length === 0 ? (
            <View className="items-center py-14">
              <MaterialIcons name="search-off" size={40} color="#757684" />
              <Text className="font-jakarta-semibold text-on-surface mt-3">
                Mobil tidak ditemukan
              </Text>
              <Text className="font-jakarta text-secondary text-xs mt-1">
                Coba kata kunci atau kategori lain.
              </Text>
            </View>
          ) : (
            mobilTampil.map((mobil) => <KartuMobil key={mobil.id} mobil={mobil} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
