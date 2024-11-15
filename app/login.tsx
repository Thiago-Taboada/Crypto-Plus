import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Animated } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import Colors from '@/constants/Colors';
import { TextInputMask } from 'react-native-masked-text';
import { ShowText, HideText } from "@/constants/Icons";

interface Plano {
  id: number;
  graficos_avancados: boolean;
  intervalo_cambio_criptomoedas: string;
  intervalo_cambio_moedas: string;
  nome: string;
  previsao_renda: number;
  qt_tipos_gastos: number;
  valor: number;
}

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    cpf: false,
    password: false,
  });
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
        const response = await fetch('http://3.17.66.110/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cpf: cpf,
            password: password,
          }),
        });

        if (response.ok) {
          const user = await response.json();

          // Guardar los datos del usuario en AsyncStorage
          await AsyncStorage.setItem('userId', user.id);
          await AsyncStorage.setItem('userName', user.name);
          await AsyncStorage.setItem('userCPF', user.cpf);
          await AsyncStorage.setItem('userEmail', user.email);
          await AsyncStorage.setItem('IDplano', user.id_plano.toString());
          await AsyncStorage.setItem('img64', user.image_b64);
          await AsyncStorage.setItem('userPassword', password);  // Guardar la contraseña aquí

          const planosResponse = await fetch('http://3.17.66.110/api/planos');
          if (planosResponse.ok) {
            const planosData: { status: string; data: Plano[] } = await planosResponse.json();
            for (const plano of planosData.data) {
              await AsyncStorage.setItem(`planoID${plano.id}`, JSON.stringify(plano));
            }
            const userPlano = planosData.data.find((plano: Plano) => plano.id === user.id_plano);
            if (userPlano) {
              await AsyncStorage.setItem('userPlanoName', userPlano.nome);
              await AsyncStorage.setItem('userValorPlano', userPlano.valor.toString());
              await AsyncStorage.setItem('userQtGastos', userPlano.qt_tipos_gastos.toString());
              await AsyncStorage.setItem('userQtMoedasFav', userPlano.qt_tipos_gastos.toString());
              await AsyncStorage.setItem('userIntervaloMoedas', userPlano.intervalo_cambio_moedas.toString());
              await AsyncStorage.setItem('userIntervaloCriptos', userPlano.intervalo_cambio_criptomoedas.toString());
              await AsyncStorage.setItem('userPevisaoRenda', userPlano.previsao_renda.toString());
              await AsyncStorage.setItem('userGraficosPlus', userPlano.graficos_avancados ? 'sim' : 'não');
            }
          } else {
            console.error('Erro ao obtener os planos');
            setErrorMessage('Ocorreu um erro. Tente novamente.');
            setModalVisible(true);
            return;
          }

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
      console.error('Error durante el login:', error);
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
          {/* <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#fff"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          /> */}
          <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Senha"
                placeholderTextColor="#fff"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HideText width={24} height={24} color="#fff" /> : <ShowText width={24} height={24} color="#fff" />}
              </TouchableOpacity>
            </View>
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
  passwordContainer: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: 15,
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
  inputError: {
    borderBottomColor: 'red',
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