import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ChevronLeft } from '@/constants/Icons';

const Page = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userCPF, setUserCPF] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        const name = await AsyncStorage.getItem('userName');
        const cpf = await AsyncStorage.getItem('userCPF');
        const email = await AsyncStorage.getItem('userEmail');

        setUserId(id);
        setUserName(name);
        setUserCPF(cpf);
        setUserEmail(email);
      } catch (error) {
        console.error('Erro ao recuperar os dados do usuário:', error);
      }
    };
    getUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userCPF');
    await AsyncStorage.removeItem('userEmail');
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
            <ChevronLeft width={40} height={40} color={Colors.white} />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>Profile</Text>
      {userName && <Text style={styles.text}>Name: {userName}</Text>}
      {userCPF && <Text style={styles.text}>CPF: {userCPF}</Text>}
      {userEmail && <Text style={styles.text}>Email: {userEmail}</Text>}
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    color: Colors.white,
    marginBottom: 10,
  },
});

export default Page;
