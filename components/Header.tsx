import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { BellNotificationIcon } from "@/constants/Icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

const Header = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const router = useRouter();

  const getUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      const image = await AsyncStorage.getItem('img64');

      if (name !== null) {
        setUserName(name);
      } else {
        console.log('Nome do usuário não encontrado.');
        setUserName('Usuário');
      }

      if (image !== null) {
        setUserImage(image);
      } else {
        console.log('Imagem do usuário não encontrada.');
      }
    } catch (error) {
      console.error('Erro ao recuperar os dados do usuário:', error);
      setUserName('Usuário');
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.userInfoWrapper}>
          <TouchableOpacity onPress={() => router.push('/perfil')}>
          <Image
              source={{ uri: `data:image/jpeg;base64,${userImage}` }}
              style={styles.userImg}
            />
          </TouchableOpacity>
          <View style={styles.userTxtWrapper}>
            <Text style={[styles.userText, { fontSize: 16 }]}>
              Olá, {userName || 'Usuário'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {}} style={styles.btnWrapper}>
          <Text style={styles.btnText}>
            <BellNotificationIcon width={22} height={22} color={Colors.white} />
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: Colors.black,
  },
  userInfoWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  userTxtWrapper: {
    marginLeft: 10,
  },
  userText: {
    color: Colors.white,
  },
  boldText: {
    fontWeight: '700',
  },
  btnWrapper: {
    padding: 8,
    borderRadius: 10,
  },
  btnText: {
    marginTop: 5,
    color: Colors.white,
    fontSize: 14,
  },
});
