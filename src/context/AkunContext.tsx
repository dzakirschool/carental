import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Akun = {
  nama: string;
  email: string;
  sandi: string;
  telepon?: string;
};

type NilaiAkun = {
  siap: boolean;
  pengguna: Akun | null;
  masuk: (email: string, sandi: string) => Promise<string | null>;
  daftar: (nama: string, email: string, sandi: string) => Promise<string | null>;
  perbaruiProfil: (nama: string, telepon: string) => Promise<void>;
  keluar: () => Promise<void>;
};

const KUNCI_AKUN = 'carental:akun';
const KUNCI_SESI = 'carental:sesi';

const AkunContext = createContext<NilaiAkun | null>(null);

export function AkunProvider({ children }: { children: ReactNode }) {
  const [siap, setSiap] = useState(false);
  const [pengguna, setPengguna] = useState<Akun | null>(null);
  const [semuaAkun, setSemuaAkun] = useState<Akun[]>([]);

  useEffect(() => {
    async function muatData() {
      try {
        const dataAkun = await AsyncStorage.getItem(KUNCI_AKUN);
        const sesi = await AsyncStorage.getItem(KUNCI_SESI);
        const akun: Akun[] = dataAkun ? JSON.parse(dataAkun) : [];
        setSemuaAkun(akun);

        if (sesi) {
          const akunAktif = akun.find(
            (item) => item.email.toLowerCase() === sesi.toLowerCase()
          );
          setPengguna(akunAktif ?? null);
        }
      } catch {
        setSemuaAkun([]);
      } finally {
        setSiap(true);
      }
    }

    muatData();
  }, []);

  const masuk = async (email: string, sandi: string) => {
    const emailRapi = email.trim().toLowerCase();
    const akun = semuaAkun.find(
      (item) => item.email.toLowerCase() === emailRapi
    );

    if (!akun) {
      return 'Email belum terdaftar. Silakan daftar dulu.';
    }
    if (akun.sandi !== sandi) {
      return 'Kata sandi salah.';
    }

    setPengguna(akun);
    await AsyncStorage.setItem(KUNCI_SESI, akun.email);
    return null;
  };

  const daftar = async (nama: string, email: string, sandi: string) => {
    const emailRapi = email.trim().toLowerCase();
    const sudahAda = semuaAkun.some(
      (item) => item.email.toLowerCase() === emailRapi
    );

    if (sudahAda) {
      return 'Email sudah terdaftar. Coba masuk saja.';
    }

    const akunBaru: Akun = {
      nama: nama.trim(),
      email: emailRapi,
      sandi,
      telepon: '',
    };
    const akunBaruSemua = [...semuaAkun, akunBaru];

    setSemuaAkun(akunBaruSemua);
    setPengguna(akunBaru);
    await AsyncStorage.multiSet([
      [KUNCI_AKUN, JSON.stringify(akunBaruSemua)],
      [KUNCI_SESI, akunBaru.email],
    ]);
    return null;
  };

  const perbaruiProfil = async (nama: string, telepon: string) => {
    if (!pengguna) {
      return;
    }

    const diperbarui: Akun = {
      ...pengguna,
      nama: nama.trim(),
      telepon: telepon.trim(),
    };
    const semua = semuaAkun.map((item) =>
      item.email === pengguna.email ? diperbarui : item
    );

    setSemuaAkun(semua);
    setPengguna(diperbarui);
    await AsyncStorage.setItem(KUNCI_AKUN, JSON.stringify(semua));
  };

  const keluar = async () => {
    setPengguna(null);
    await AsyncStorage.removeItem(KUNCI_SESI);
  };

  return (
    <AkunContext.Provider
      value={{ siap, pengguna, masuk, daftar, perbaruiProfil, keluar }}
    >
      {children}
    </AkunContext.Provider>
  );
}

export function useAkun() {
  const context = useContext(AkunContext);

  if (!context) {
    throw new Error('useAkun harus dipakai di dalam AkunProvider');
  }

  return context;
}
