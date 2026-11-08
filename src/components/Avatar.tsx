import { Text, View } from 'react-native';

import { useAkun } from '../context/AkunContext';

type Props = {
  ukuran?: number;
};

export default function Avatar({ ukuran = 32 }: Props) {
  const { pengguna } = useAkun();
  const inisial = (pengguna?.nama?.trim().charAt(0) || 'C').toUpperCase();

  return (
    <View
      style={{ width: ukuran, height: ukuran, borderRadius: ukuran / 2 }}
      className="bg-primary-container items-center justify-center"
    >
      <Text
        style={{ fontSize: ukuran * 0.42 }}
        className="font-jakarta-bold text-white"
      >
        {inisial}
      </Text>
    </View>
  );
}
