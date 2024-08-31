// app/cadastro.tsx
import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Colors from '@/constants/Colors';

const Cadastro = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <Text style={styles.text}>Aqui você pode se cadastrar.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.black,
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Cadastro;
