import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Pesanan = {
  id: string;
  email: string;
  mobilId: string;
  mulai: string;
  selesai: string;
  hari: number;
  denganSopir: boolean;
  antarLokasi: boolean;
  metode: string;
  total: number;
  pin: string;
  status: string;
};

export type PesananBaru = Omit<Pesanan, 'id' | 'pin' | 'status'>;

type NilaiPesanan = {
  siap: boolean;
  daftarPesanan: Pesanan[];
  tambahPesanan: (pesanan: PesananBaru) => Promise<Pesanan>;
};

const KUNCI_PESANAN = 'carental:pesanan';

const PesananContext = createContext<NilaiPesanan | null>(null);

function buatKode(prefix: string, panjang: number) {
  let kode = '';
  for (let i = 0; i < panjang; i++) {
    kode += Math.floor(Math.random() * 10);
  }
  return prefix + kode;
}

export function PesananProvider({ children }: { children: ReactNode }) {
  const [siap, setSiap] = useState(false);
  const [daftarPesanan, setDaftarPesanan] = useState<Pesanan[]>([]);

  useEffect(() => {
    async function muatData() {
      try {
        const data = await AsyncStorage.getItem(KUNCI_PESANAN);
        setDaftarPesanan(data ? JSON.parse(data) : []);
      } catch {
        setDaftarPesanan([]);
      } finally {
        setSiap(true);
      }
    }

    muatData();
  }, []);

  const tambahPesanan = async (pesanan: PesananBaru) => {
    const baru: Pesanan = {
      ...pesanan,
      id: buatKode('CR-', 7),
      pin: buatKode('', 4),
      status: 'Siap Dijemput',
    };
    const semua = [baru, ...daftarPesanan];

    setDaftarPesanan(semua);
    await AsyncStorage.setItem(KUNCI_PESANAN, JSON.stringify(semua));
    return baru;
  };

  return (
    <PesananContext.Provider value={{ siap, daftarPesanan, tambahPesanan }}>
      {children}
    </PesananContext.Provider>
  );
}

export function usePesanan() {
  const context = useContext(PesananContext);

  if (!context) {
    throw new Error('usePesanan harus dipakai di dalam PesananProvider');
  }

  return context;
}
