import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Animated } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import Colors from '@/constants/Colors';
import { TextInputMask } from 'react-native-masked-text';
import users from '@/data/user.json'; 

interface User {
  id: string;
  nome: string;
  CPF: string;
  email: string;
}

const usersTyped: User[] = users as User[];

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: modalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [modalVisible]);

  const handleLogin = async () => {
    try {
      if (cpf.length === 14 && password.length > 0) {
        const user = usersTyped.find(user => user.CPF === cpf);

        if (user) {
          await AsyncStorage.setItem('userId', user.id);
          await AsyncStorage.setItem('userName', user.nome);
          await AsyncStorage.setItem('userCPF', user.CPF);
          await AsyncStorage.setItem('userEmail', user.email);

          router.push('/');
        } else {
          setErrorMessage('CPF ou senha inválidos.');
          setModalVisible(true);
        }
      } else {
        setErrorMessage('CPF ou senha inválidos.');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error durante o login:', error);
      setErrorMessage('Ocorreu um erro. Tente novamente.');
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Bem-vindo!</Text>
          <Text style={styles.subtitle}>Entre na sua conta</Text>
        </View>
        <View style={styles.formContainer}>
          <TextInputMask
            type={'cpf'}
            style={styles.input}
            placeholder="CPF"
            placeholderTextColor="#fff"
            keyboardType="numeric"
            value={cpf}
            onChangeText={setCpf}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#fff"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => router.push('/cadastro')}>
            <Text style={styles.infoText}>Ainda não possui uma conta? <Text style={styles.infoTextBold}>Cadastre-se</Text></Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.black,
    paddingHorizontal: '10%',
  },
  innerContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  title: {
    color: "#fff",
    fontSize: 48,
    marginBottom: 10,
  },
  subtitle: {
    color: "#fff",
    fontSize: 24,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    width: '100%',
    borderBottomColor: '#fff',
    borderBottomWidth: 0.5,
    marginBottom: 15,
    color: "#fff",
    paddingHorizontal: 10,
  },
  button: {
    height: 50,
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#242424',
    borderColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 15,
    textAlign: 'left',
  },
  infoTextBold: {
    color: '#fff',
    fontSize: 14,
    marginTop: 15,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 500,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#242424',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;
