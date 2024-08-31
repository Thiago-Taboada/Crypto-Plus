import { View, Text, Button, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Colors from '@/constants/Colors';

const Index = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (isMounted) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [isMounted]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem vindo!</Text>
      <Button title="Fazer Login" onPress={() => router.push('/login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.black,
  },
  text: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Index;
