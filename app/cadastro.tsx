import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Animated, Alert } from "react-native";
import Colors from '@/constants/Colors';
import users from '@/data/user.json';
import { TextInputMask } from 'react-native-masked-text';

const Cadastro = () => {
  const [step, setStep] = useState(1);
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [errorMessage, setErrorMessage] = useState('');

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
    return name.length >= 8 && name.includes(' ');
  };

  const checkUniqueUser = (cpf: string, email: string) => {
    const cpfExists = users.some(user => user.CPF === cpf);
    const emailExists = users.some(user => user.email === email);
    return { cpfExists, emailExists };
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!cpf || !email) {
        setErrorMessage('Preencha todos os campos e tente novamente.');
        setModalVisible(true);
        return;
      }
      if (!validateCPF(cpf) || !validateEmail(email)) {
        setErrorMessage('Verifique os campos e tente novamente.');
        setModalVisible(true);
        return;
      }

      const { cpfExists, emailExists } = checkUniqueUser(cpf, email);
      if (cpfExists) {
        setErrorMessage('CPF já vinculado a uma conta existente.');
        setModalVisible(true);
        return;
      }
      if (emailExists) {
        setErrorMessage('Email vinculado a uma conta existente.');
        setModalVisible(true);
        return;
      }

      setStep(2);
    } else if (step === 2) {
      if (password !== confirmPassword) {
        setErrorMessage('Senhas não correspondem.');
        setModalVisible(true);
        return;
      }
      if (!validateName(name)) {
        setErrorMessage('Nome deve ter pelo menos 8 caracteres e um espaço.');
        setModalVisible(true);
        return;
      }
      
      // BUGADOOO
      // Adiciona o novo usuário ao JSON (ou realiza outra ação necessária)
      const newUser = { id: generateId(), nome: name, CPF: cpf, email: email, password };
      users.push(newUser); // Adicione lógica para atualizar o JSON ou enviar ao servidor

      Alert.alert("Cadastro bem-sucedido", "Você foi registrado com sucesso!");
      // Navega para a página de login ou realiza outra ação
      // navigation.navigate('Login');
    }
  };

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Cadastro - Passo 1</Text>
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
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Cadastro - Passo 2</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#fff"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#fff"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirme a Senha"
            placeholderTextColor="#fff"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleNextStep}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
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
    padding: 20,
  },
  stepContainer: {
    width: '100%',
    maxWidth: 500,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
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
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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

export default Cadastro;
