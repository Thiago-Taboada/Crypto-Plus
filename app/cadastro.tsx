import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Animated, Alert } from "react-native";
import Colors from '@/constants/Colors';
import { TextInputMask } from 'react-native-masked-text';
import { ShowText, HideText } from "@/constants/Icons";
import { useRouter } from "expo-router";

const Cadastro = () => {
  const [step, setStep] = useState(1);
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({
    cpf: false,
    email: false,
    name: false,
    password: false,
    confirmPassword: false,
  });
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: modalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [modalVisible]);

  const validateCPF = (cpf: string) => {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
    return cpfRegex.test(cpf);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string) => {
    const nameRegex = /^[A-Za-z\s]{8,}$/;
    return nameRegex.test(name);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleNextStep = () => {
    let hasErrors = false;
    const newErrors = {
      cpf: false,
      email: false,
      name: false,
      password: false,
      confirmPassword: false,
    };

    if (step === 1) {
      if (!cpf || !email) {
        setErrorMessage('Preencha todos os campos e tente novamente.');
        setModalVisible(true);
        hasErrors = true;
        newErrors.cpf = !cpf;
        newErrors.email = !email;
      } else if (!validateCPF(cpf) || !validateEmail(email)) {
        setErrorMessage('Verifique os campos e tente novamente.');
        setModalVisible(true);
        hasErrors = true;
        newErrors.cpf = !validateCPF(cpf);
        newErrors.email = !validateEmail(email);
      } else if (validateCPF(cpf)) {
        fetch(`http://3.17.66.110/api/cpfUsed?cpf=${cpf.replace(/\D/g, '')}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => response.json())
          .then(data => {
            if (data.inUse) {
              setErrorMessage('CPF associado a uma conta existente');
              setModalVisible(true);
              hasErrors = true;
              newErrors.cpf = true;
            } else {
              // nenhum erro entao ta ok
              if (!hasErrors) {
                console.log("Passo 1 ok");
                setStep(2);
              }
            }
          })
          .catch(error => {
            console.error("Conection error:", error);
            setErrorMessage('Erro de conexão. Tente novamente.');
            setModalVisible(true);
            hasErrors = true;
          });
      }
    } else if (step === 2) {
      if (!validateName(name)) {
        setErrorMessage('O nome deve ter pelo menos 8 letras.');
        setModalVisible(true);
        hasErrors = true;
        newErrors.name = true;
      }

      if (!hasErrors && !validatePassword(password)) {
        setErrorMessage('A senha deve ter:');
        setModalVisible(true);
        hasErrors = true;
        newErrors.password = true;
      }

      if (!hasErrors && password !== confirmPassword) {
        setErrorMessage('As senhas não correspondem.');
        setModalVisible(true);
        hasErrors = true;
        newErrors.confirmPassword = true;
      }

      if (!hasErrors) {
        fetch("http://3.17.66.110/api/register", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            password: password,
            password_confirmation: confirmPassword,
            cpf: cpf,
            email: email
          })
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === "success") {
              console.log("Passo 2 ok");
              Alert.alert("Cadastro bem-sucedido", "Você foi registrado com sucesso!");
              router.push('/login');
            } else {
              setErrorMessage('Erro de conexão. Tente novamente.');
              setModalVisible(true);
            }
          })
          .catch(error => {
            console.error("Erro ao registrar:", error);
            setErrorMessage('Erro no servidor. Tente novamente.');
            setModalVisible(true);
          });
      }
    }

    setErrors(newErrors);
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <View style={styles.innerContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>Crie uma conta!</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInputMask
              type={'cpf'}
              style={[styles.input, errors.cpf && styles.inputError]}
              placeholder="CPF"
              placeholderTextColor="#fff"
              keyboardType="numeric"
              value={cpf}
              onChangeText={setCpf}
            />
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#fff"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleNextStep}
            >
              <Text style={styles.buttonText}>Próximo Passo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoText}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.infoTextRegular}>Já possui uma conta? <Text style={styles.infoTextBold}>Faça Login</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.innerContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Criar conta</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Nome"
              placeholderTextColor="#fff"
              value={name}
              onChangeText={setName}
            />
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
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Confirme a Senha"
                placeholderTextColor="#fff"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <HideText width={24} height={24} color="#fff" /> : <ShowText width={24} height={24} color="#fff" />}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleNextStep}
            >
              <Text style={styles.buttonText}>Criar conta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(1)}
            >
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoText}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.infoTextRegular}>Já possui uma conta? <Text style={styles.infoTextBold}>Faça Login</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
            <View style={styles.modalList}>
              {errorMessage.includes('senha deve ter:') && (
                <>
                  <Text style={styles.modalListItem}>• Mínimo de 8 caracteres</Text>
                  <Text style={styles.modalListItem}>• 1 Letra maiúscula</Text>
                  <Text style={styles.modalListItem}>• 1 Letra minúscula</Text>
                  <Text style={styles.modalListItem}>• 1 Número</Text>
                  <Text style={styles.modalListItem}>• 1 Caractere especial</Text>
                </>
              )}
            </View>
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
  inputError: {
    borderBottomColor: 'red',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: 15,
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
    marginTop: 20,
  },
  backButton: {
    height: 50,
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#242424',
    borderColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  infoText: {
    marginTop: 20,
    textAlign: 'left',
  },
  infoTextRegular: {
    color: '#fff',
    fontSize: 14,
  },
  infoTextBold: {
    color: '#fff',
    fontSize: 14,
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
    marginBottom: 10,
  },
  modalList: {
    marginBottom: 20,
    textAlign: 'left',
  },
  modalListItem: {
    fontSize: 16,
    marginVertical: 2,
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

export default Cadastro;
