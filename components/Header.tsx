import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { ShowText, HideText } from "@/constants/Icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

const Header = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [hideValues, setHideValues] = useState<boolean>(false);
  const router = useRouter();

  const getUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      const image = await AsyncStorage.getItem('img64');

      setUserName(name ?? 'Usuário');
      setUserImage(image);
    } catch (error) {
      console.error('Erro ao recuperar os dados do usuário:', error);
      setUserName('Usuário');
    }
  };

  const listenForImageChange = () => {
    AsyncStorage.getItem('img64').then(image => {
      setUserImage(image);
    });
  };

  const toggleHideValues = async () => {
    const newHideValues = !hideValues;
    setHideValues(newHideValues);
    await AsyncStorage.setItem('hideValues', JSON.stringify(newHideValues));
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const interval = setInterval(listenForImageChange, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.userInfoWrapper}>
          <TouchableOpacity onPress={() => router.push('/sidemenu')}>
            <Image
              source={{ uri: `${userImage}` }}
              style={styles.userImg}
            />
          </TouchableOpacity>
          <View style={styles.userTxtWrapper}>
            <Text style={[styles.userText, { fontSize: 16 }]}>
              Olá, {userName || 'Usuário'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleHideValues} style={styles.btnWrapper}>
          {hideValues ? (
            <ShowText width={26} height={26} color={Colors.white} />
          ) : (
            <HideText width={26} height={26} color={Colors.white} />
          )}
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