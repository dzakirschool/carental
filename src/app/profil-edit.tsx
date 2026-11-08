import { MaterialIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAkun } from '../context/AkunContext';

export default function HalamanEditProfil() {
  const { siap, pengguna, perbaruiProfil } = useAkun();
  const insets = useSafeAreaInsets();
  const [nama, setNama] = useState(pengguna?.nama ?? '');
  const [telepon, setTelepon] = useState(pengguna?.telepon ?? '');
  const [pesanError, setPesanError] = useState('');
  const [sedangSimpan, setSedangSimpan] = useState(false);

  useEffect(() => {
    if (pengguna) {
      setNama(pengguna.nama);
      setTelepon(pengguna.telepon ?? '');
    }
  }, [pengguna]);

  if (!siap) {
    return null;
  }

  if (!pengguna) {
    return <Redirect href="/" />;
  }

  const simpan = async () => {
    setPesanError('');

    if (!nama.trim()) {
      setPesanError('Nama tidak boleh kosong.');
      return;
    }

    setSedangSimpan(true);
    await perbaruiProfil(nama, telepon);
    setSedangSimpan(false);
    router.back();
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
          Edit Profil
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="font-jakarta-semibold text-[11px] tracking-widest text-secondary mb-1.5 ml-1">
            NAMA LENGKAP
          </Text>
          <View className="flex-row items-center bg-surface-lowest rounded-xl border border-outline-variant/60 px-4 h-[54px]">
            <MaterialIcons name="badge" size={20} color="#565E74" />
            <TextInput
              className="flex-1 font-jakarta text-on-surface text-sm ml-3 h-full"
              placeholder="Nama lengkap"
              placeholderTextColor="#757684"
              value={nama}
              onChangeText={setNama}
            />
          </View>

          <Text className="font-jakarta-semibold text-[11px] tracking-widest text-secondary mb-1.5 ml-1 mt-4">
            NOMOR HP
          </Text>
          <View className="flex-row items-center bg-surface-lowest rounded-xl border border-outline-variant/60 px-4 h-[54px]">
            <MaterialIcons name="phone" size={20} color="#565E74" />
            <TextInput
              className="flex-1 font-jakarta text-on-surface text-sm ml-3 h-full"
              placeholder="+62..."
              placeholderTextColor="#757684"
              value={telepon}
              onChangeText={setTelepon}
              keyboardType="phone-pad"
            />
          </View>

          <Text className="font-jakarta-semibold text-[11px] tracking-widest text-secondary mb-1.5 ml-1 mt-4">
            EMAIL
          </Text>
          <View className="flex-row items-center bg-surface-low rounded-xl border border-outline-variant/40 px-4 h-[54px]">
            <MaterialIcons name="alternate-email" size={20} color="#757684" />
            <Text className="flex-1 font-jakarta text-secondary text-sm ml-3">
              {pengguna.email}
            </Text>
          </View>

          {pesanError ? (
            <View className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mt-4 flex-row items-start">
              <MaterialIcons name="error-outline" size={18} color="#BA1A1A" />
              <Text className="font-jakarta text-error text-xs ml-2 flex-1">
                {pesanError}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={simpan}
            disabled={sedangSimpan}
            className={`w-full h-[52px] bg-primary-container rounded-xl items-center justify-center mt-6 flex-row ${
              sedangSimpan ? 'opacity-70' : ''
            }`}
          >
            {sedangSimpan ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-jakarta-semibold text-white text-sm">
                Simpan Perubahan
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
