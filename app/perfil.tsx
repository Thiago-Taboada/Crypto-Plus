import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { ChevronLeft } from '@/constants/Icons';

const Page = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userCPF, setUserCPF] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const cpf = await AsyncStorage.getItem('userCPF');
        const email = await AsyncStorage.getItem('userEmail');
        const image = await AsyncStorage.getItem('img64');
        const plan = await AsyncStorage.getItem('IDplano');

        setUserName(name);
        setUserCPF(cpf);
        setUserEmail(email);
        setUserImage(image);
        setUserPlan(plan);
      } catch (error) {
        console.error('Erro ao recuperar os dados do usuário:', error);
      }
    };
    getUserData();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <ChevronLeft width={40} height={40} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          {userImage && <Image source={{ uri: `data:image/jpeg;base64,${userImage}` }} style={styles.image} />}
          <View style={styles.textContainer}>
            {userName && <Text style={styles.name}>{userName}</Text>}
            {userPlan && <Text style={styles.plan}>Membro {userPlan}</Text>}
          </View>
        </View>
      </View>
      <Text style={styles.configTitle}>Configurações</Text>
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('/')}>
        <Text style={styles.optionText}>Dados pessoais</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('/')}>
        <Text style={styles.optionText}>Email</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('/')}>
        <Text style={styles.optionText}>Moeda Favorita</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('/')}>
        <Text style={styles.optionText}>Gerenciar assinatura</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('/')}>
        <Text style={styles.optionText}>Exportar/Importar dados</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('/')}>
        <Text style={styles.optionText}>Termos de uso</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={async () => {
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userName');
        await AsyncStorage.removeItem('userCPF');
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('img64');
        await AsyncStorage.removeItem('IDplano');
        router.push('/login');
      }}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.black,
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    marginLeft: 20,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  plan: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
  },
  configTitle: {
    color: Colors.white,
    fontSize: 24,
    marginBottom: 10,
    backgroundColor: Colors.gray,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  optionText: {
    color: Colors.white,
    fontSize: 20,
  },
  logoutButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: Colors.red,
    fontSize: 20,
  },
});

export default Page;
