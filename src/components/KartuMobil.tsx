import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { formatRupiah, Mobil } from '../constants/dataMobil';

type Props = {
  mobil: Mobil;
};

export default function KartuMobil({ mobil }: Props) {
  const [favorit, setFavorit] = useState(false);

  return (
    <View className="bg-surface-lowest rounded-2xl p-4 border border-outline-variant/50 mb-4 hover:border-primary/40 active:border-primary/60">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="font-jakarta-semibold text-[10px] tracking-widest text-outline uppercase">
            {mobil.merek}
          </Text>
          <Text className="font-jakarta-bold text-on-surface text-lg mt-0.5">
            {mobil.nama}
          </Text>
        </View>
        <Pressable
          onPress={() => setFavorit(!favorit)}
          className="w-9 h-9 rounded-full bg-surface-low items-center justify-center"
          hitSlop={6}
        >
          <MaterialIcons
            name={favorit ? 'favorite' : 'favorite-border'}
            size={20}
            color={favorit ? '#BA1A1A' : '#757684'}
          />
        </Pressable>
      </View>

      <Image
        source={mobil.gambar}
        className="w-full h-36 my-3"
        resizeMode="contain"
      />

      <View className="flex-row flex-wrap gap-2 mb-4">
        <View className="flex-row items-center bg-surface-low rounded-md px-2.5 py-1">
          <MaterialIcons
            name={mobil.bahanBakar === 'Listrik' ? 'bolt' : 'local-gas-station'}
            size={14}
            color="#565E74"
          />
          <Text className="font-jakarta-medium text-[11px] text-on-surface-variant ml-1">
            {mobil.bahanBakar}
          </Text>
        </View>
        <View className="flex-row items-center bg-surface-low rounded-md px-2.5 py-1">
          <MaterialIcons name="airline-seat-recline-normal" size={14} color="#565E74" />
          <Text className="font-jakarta-medium text-[11px] text-on-surface-variant ml-1">
            {mobil.kursi} Kursi
          </Text>
        </View>
        <View className="bg-surface-low rounded-md px-2.5 py-1">
          <Text className="font-jakarta-medium text-[11px] text-on-surface-variant">
            {mobil.transmisi}
          </Text>
        </View>
      </View>

      <View className="flex-row items-end justify-between">
        <View>
          <Text className="font-jakarta-semibold text-[10px] tracking-widest text-outline uppercase">
            Tarif Sewa
          </Text>
          <View className="flex-row items-baseline mt-0.5">
            <Text className="font-jakarta-bold text-on-surface text-lg">
              {formatRupiah(mobil.harga)}
            </Text>
            <Text className="font-jakarta text-xs text-outline ml-1">/hari</Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push(`/mobil/${mobil.id}`)}
          className="h-11 px-5 rounded-lg bg-primary flex-row items-center active:opacity-90"
        >
          <Text className="font-jakarta-semibold text-white text-xs">Sewa</Text>
          <MaterialIcons
            name="arrow-forward"
            size={16}
            color="#FFFFFF"
            style={{ marginLeft: 6 }}
          />
        </Pressable>
      </View>
    </View>
  );
}
