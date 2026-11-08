import { MaterialIcons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAkun } from '../context/AkunContext';

type ModeAuth = 'masuk' | 'daftar';

export default function HalamanMasuk() {
  const { siap, pengguna, masuk, daftar } = useAkun();
  const [mode, setMode] = useState<ModeAuth>('masuk');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [sandi, setSandi] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [lihatSandi, setLihatSandi] = useState(false);
  const [pesanError, setPesanError] = useState('');
  const [sedangProses, setSedangProses] = useState(false);

  const gantiMode = (pilihan: ModeAuth) => {
    setMode(pilihan);
    setPesanError('');
  };

  const lanjut = async () => {
    setPesanError('');

    if (!email.trim() || !sandi) {
      setPesanError('Email dan kata sandi wajib diisi.');
      return;
    }

    if (mode === 'daftar') {
      if (!nama.trim()) {
        setPesanError('Nama lengkap masih kosong.');
        return;
      }
      if (!email.includes('@')) {
        setPesanError('Format email belum benar.');
        return;
      }
      if (sandi.length < 8) {
        setPesanError('Kata sandi minimal 8 karakter.');
        return;
      }
      if (sandi !== konfirmasi) {
        setPesanError('Ulangi kata sandi dengan benar.');
        return;
      }
    }

    setSedangProses(true);
    const error =
      mode === 'masuk'
        ? await masuk(email, sandi)
        : await daftar(nama, email, sandi);
    setSedangProses(false);

    if (error) {
      setPesanError(error);
    }
  };

  if (!siap) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  if (pengguna) {
    return <Redirect href="/beranda" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mt-6 mb-8">
            <View className="w-16 h-16 rounded-2xl bg-surface-lowest items-center justify-center border border-outline-variant">
              <MaterialIcons name="directions-car" size={34} color="#1E40AF" />
              <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary-container items-center justify-center">
                <View className="w-1.5 h-1.5 rounded-full bg-white" />
              </View>
            </View>
            <Text className="font-jakarta-bold text-primary-container text-xs tracking-widest mt-4 mb-1">
              CARENTAL
            </Text>
            <Text className="font-jakarta-bold text-on-surface text-[26px]">
              {mode === 'masuk' ? 'Masuk ke akunmu' : 'Buat akun baru'}
            </Text>
            <Text className="font-jakarta text-secondary text-sm text-center mt-1 max-w-[280px]">
              {mode === 'masuk'
                ? 'Masuk untuk lanjut sewa mobil.'
                : 'Isi data di bawah untuk mulai menyewa.'}
            </Text>
          </View>

          <View className="w-full bg-surface-low p-1.5 rounded-full flex-row mb-7 border border-outline-variant/40">
            <Pressable
              onPress={() => gantiMode('masuk')}
              className={`flex-1 py-2.5 rounded-full flex-row items-center justify-center ${
                mode === 'masuk' ? 'bg-surface-lowest' : ''
              }`}
            >
              <MaterialIcons
                name="login"
                size={16}
                color={mode === 'masuk' ? '#1E40AF' : '#565E74'}
              />
              <Text
                className={`font-jakarta-semibold text-xs ml-1.5 ${
                  mode === 'masuk' ? 'text-on-surface' : 'text-secondary'
                }`}
              >
                Masuk
              </Text>
            </Pressable>
            <Pressable
              onPress={() => gantiMode('daftar')}
              className={`flex-1 py-2.5 rounded-full flex-row items-center justify-center ${
                mode === 'daftar' ? 'bg-surface-lowest' : ''
              }`}
            >
              <MaterialIcons
                name="person-add"
                size={16}
                color={mode === 'daftar' ? '#1E40AF' : '#565E74'}
              />
              <Text
                className={`font-jakarta-semibold text-xs ml-1.5 ${
                  mode === 'daftar' ? 'text-on-surface' : 'text-secondary'
                }`}
              >
                Daftar
              </Text>
            </Pressable>
          </View>

          {mode === 'daftar' && (
            <View className="mb-4">
              <Text className="font-jakarta-semibold text-[11px] tracking-widest text-secondary mb-1.5 ml-1">
                NAMA LENGKAP
              </Text>
              <View className="flex-row items-center bg-surface-lowest rounded-xl border border-outline-variant/60 px-4 h-[54px]">
                <MaterialIcons name="badge" size={20} color="#565E74" />
                <TextInput
                  className="flex-1 font-jakarta text-on-surface text-sm ml-3 h-full"
                  placeholder="cth. Arya Pradana"
                  placeholderTextColor="#757684"
                  value={nama}
                  onChangeText={setNama}
                />
              </View>
            </View>
          )}

          <View className="mb-4">
            <Text className="font-jakarta-semibold text-[11px] tracking-widest text-secondary mb-1.5 ml-1">
              EMAIL
            </Text>
            <View className="flex-row items-center bg-surface-lowest rounded-xl border border-outline-variant/60 px-4 h-[54px]">
              <MaterialIcons name="alternate-email" size={20} color="#565E74" />
              <TextInput
                className="flex-1 font-jakarta text-on-surface text-sm ml-3 h-full"
                placeholder="nama@email.com"
                placeholderTextColor="#757684"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-1.5 px-1">
              <Text className="font-jakarta-semibold text-[11px] tracking-widest text-secondary">
                KATA SANDI
              </Text>
              {mode === 'masuk' && (
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      'Lupa kata sandi',
                      'Not Found'
                    )
                  }
                >
                  <Text className="font-jakarta-semibold text-[11px] text-primary-container">
                    Lupa kata sandi?
                  </Text>
                </Pressable>
              )}
            </View>
            <View className="flex-row items-center bg-surface-lowest rounded-xl border border-outline-variant/60 px-4 h-[54px]">
              <MaterialIcons name="lock" size={20} color="#565E74" />
              <TextInput
                className="flex-1 font-jakarta text-on-surface text-sm ml-3 h-full"
                placeholder="Minimal 8 karakter"
                placeholderTextColor="#757684"
                value={sandi}
                onChangeText={setSandi}
                secureTextEntry={!lihatSandi}
              />
              <Pressable onPress={() => setLihatSandi(!lihatSandi)} hitSlop={8}>
                <MaterialIcons
                  name={lihatSandi ? 'visibility-off' : 'visibility'}
                  size={20}
                  color="#565E74"
                />
              </Pressable>
            </View>
          </View>

          {mode === 'daftar' && (
            <View className="mb-4">
              <Text className="font-jakarta-semibold text-[11px] tracking-widest text-secondary mb-1.5 ml-1">
                ULANGI KATA SANDI
              </Text>
              <View className="flex-row items-center bg-surface-lowest rounded-xl border border-outline-variant/60 px-4 h-[54px]">
                <MaterialIcons name="check-circle" size={20} color="#565E74" />
                <TextInput
                  className="flex-1 font-jakarta text-on-surface text-sm ml-3 h-full"
                  placeholder="Ketik ulang kata sandi"
                  placeholderTextColor="#757684"
                  value={konfirmasi}
                  onChangeText={setKonfirmasi}
                  secureTextEntry
                />
              </View>
            </View>
          )}

          {pesanError ? (
            <View className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-3 flex-row items-start">
              <MaterialIcons name="error-outline" size={18} color="#BA1A1A" />
              <Text className="font-jakarta text-error text-xs ml-2 flex-1">
                {pesanError}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={lanjut}
            disabled={sedangProses}
            className={`w-full h-[52px] bg-primary-container rounded-xl flex-row items-center justify-center mt-1 active:opacity-90 ${
              sedangProses ? 'opacity-70' : ''
            }`}
          >
            {sedangProses ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text className="font-jakarta-semibold text-white text-sm">
                  {mode === 'masuk' ? 'Masuk' : 'Daftar'}
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

          <Text className="font-jakarta text-secondary text-xs text-center leading-5 mt-8 px-3">
            Dengan melanjutkan, kamu menyetujui Syarat Layanan dan Kebijakan
            Privasi Carental.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
