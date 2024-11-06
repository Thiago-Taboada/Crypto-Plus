import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, TextInput, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { ChevronLeft, ShowText, HideText } from '@/constants/Icons';
import { TextInputMask } from 'react-native-masked-text';
import AuthGuard from '@/components/AuthGuard';

const Sidemenu = () => {
  const [userNameGlobal, setUserNameGlobal] = useState<string | null>(null);
  const [userCPFGlobal, setUserCPFGlobal] = useState<string | null>(null);
  const [userEmailGlobal, setUserEmailGlobal] = useState<string | null>(null);
  const [userImageGlobal, setUserImageGlobal] = useState<string | null>(null);
  const [userPlanGlobal, setUserPlanGlobal] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<'menu' | 'passwordOverlay' | 'dataOverlay' | 'favOverlay'>('menu');

  const [userName, setUserName] = useState('');
  const [userCPF, setUserCPF] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modalVisibleErrorMsg, setModalVisibleErrorMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const syncWithGlobalValues = () => {
    if (userNameGlobal) setUserName(userNameGlobal);
    if (userCPFGlobal) setUserCPF(userCPFGlobal);
    if (userEmailGlobal) setUserEmail(userEmailGlobal);
  };

  const openModalErrorMsg = (message: string) => {
    setErrorMsg(message);
    setModalVisibleErrorMsg(true);
  };

  const closeModalErrorMsg = () => {
    setModalVisibleErrorMsg(false);
  };

  //Password:
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateOldPassword = (password: string) => {
    return password.length >= 8;
  };

  const handleConfirmPasswordChange = () => {
    if (!validateOldPassword(oldPassword)) {
      openModalErrorMsg('Informe a sua senha atual.');
      return;
    }
    if (!validatePassword(newPassword)) {
      openModalErrorMsg('A senha deve ter no minimo:');
      return;
    }
    if (newPassword !== confirmPassword) {
      openModalErrorMsg('As senhas não correspondem.');
      return;
    }

    // codigo e logica aqui para alterar senha

    setActiveView('menu');
  };

  //Dados pessoais:
  const handleConfirmDataChange = () => {
    const nameValidationRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{5,}$/;
    const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cpfValidationRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  
    if (!nameValidationRegex.test(userName)) {
      openModalErrorMsg('O nome deve ter pelo menos 5 letras.');
      return;
    }
  
    if (!emailValidationRegex.test(userEmail)) {
      openModalErrorMsg('Email inválido.');
      return;
    }
  
    if (!cpfValidationRegex.test(userCPF)) {
      openModalErrorMsg('CPF inválido.');
      return;
    }
  
    // Logica para salvar aqui
  
    setActiveView('menu');
  };
  


  // Manage Active view
  const togglePasswordView = () => {
    if (activeView === 'menu') {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setActiveView('passwordOverlay');
    } else {
      setActiveView('menu');
    }
  };
  const toggleDataView = () => {
    if (activeView === 'menu') {
      syncWithGlobalValues();
      setActiveView('dataOverlay');
    } else {
      setActiveView('menu');
    }
  };
  const toggleFavView = () => {
    if (activeView === 'menu') {
      syncWithGlobalValues();
      setActiveView('favOverlay');
    } else {
      setActiveView('menu');
    }
  };
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const cpf = await AsyncStorage.getItem('userCPF');
        const email = await AsyncStorage.getItem('userEmail');
        const image = await AsyncStorage.getItem('img64');
        const plan = await AsyncStorage.getItem('userPlanoName');

        setUserNameGlobal(name);
        setUserCPFGlobal(cpf);
        setUserEmailGlobal(email);
        setUserImageGlobal(image);
        setUserPlanGlobal(plan);
      } catch (error) {
        console.error('Erro ao recuperar os dados do usuário:', error);
      }
    };
    getUserData();
  }, []);

  return (
    <AuthGuard>
      <ScrollView contentContainerStyle={styles.container}>
        {activeView === 'menu' && (
          <View style={styles.menu}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.push('/')}>
                <ChevronLeft width={40} height={40} color={Colors.white} />
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                {userImageGlobal && <Image source={{ uri: `${userImageGlobal}` }} style={styles.image} />}
                <View style={styles.textContainer}>
                  {userNameGlobal && <Text style={styles.name}>{userNameGlobal}</Text>}
                  {userPlanGlobal && <Text style={styles.plan}>Membro {userPlanGlobal}</Text>}
                </View>
              </View>
            </View>
            <Text style={styles.configTitle}>Configurações</Text>
            <TouchableOpacity style={styles.option} onPress={toggleDataView}>
              <Text style={styles.optionText}>Dados pessoais</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={togglePasswordView}>
              <Text style={styles.optionText}>Alterar senha</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={toggleFavView}>
              <Text style={styles.optionText}>Moeda Favorita</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => { }}>
              <Text style={styles.optionText}>Gerenciar assinatura</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => { }}>
              <Text style={styles.optionText}>Exportar/Importar dados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => { }}>
              <Text style={styles.optionText}>Termos de uso</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={async () => {
              await AsyncStorage.clear();
              router.push('/login');
            }}>
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeView === 'dataOverlay' && (
          <View style={styles.formOverlay}>
            <View style={styles.formContent}>
              <Text style={styles.formTitle}>Alterar dados Pessoais</Text>
              <Text style={styles.formLabel}>Nome</Text>
              <View style={styles.formInputContainer}>
              <TextInput
                  style={styles.formInput}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="Seu nome"
                  placeholderTextColor="#888"
                />
              </View>
              <Text style={styles.formLabel}>CPF</Text>
              <View style={styles.formInputContainer}>
                <TextInputMask
                  type={'cpf'}
                  style={styles.formInput}
                  value={userCPF ?? ''}
                  onChangeText={setUserCPF}
                  placeholder={userCPF ?? '000.000.000-00'}
                  placeholderTextColor="#888"
                />
              </View>
              <Text style={styles.formLabel}>Email</Text>
              <View style={styles.formInputContainer}>
                <TextInput
                  style={styles.formInput}
                  value={userEmail ?? ''}
                  onChangeText={setUserEmail}
                  placeholder={userEmail ?? 'seu@email.aqui'}
                  placeholderTextColor="#888"
                />
              </View>
              
              <View style={styles.formButtonContainer}>
                <TouchableOpacity style={styles.formButton} onPress={handleConfirmDataChange}>
                  <Text style={styles.formButtonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formButton} onPress={toggleDataView}>
                  <Text style={styles.formButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeView === 'passwordOverlay' && (
          <View style={styles.formOverlay}>
            <View style={styles.formContent}>
              <Text style={styles.formTitle}>Alterar senha</Text>
              <Text style={styles.formLabel}>Senha antiga</Text>
              <View style={styles.formInputContainer}>
                <TextInput
                  style={styles.formInput}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry={!showOldPassword}
                  placeholder="Digite sua senha atual"
                  placeholderTextColor="#888"
                />
                <TouchableOpacity style={styles.iconContainer} onPress={() => setShowOldPassword(!showOldPassword)}>
                  {showOldPassword ? (
                    <HideText width={24} height={24} color="#fff" />
                  ) : (
                    <ShowText width={24} height={24} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.formLabel}>Senha nova</Text>
              <View style={styles.formInputContainer}>
                <TextInput
                  style={styles.formInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  placeholder="Digite sua nova senha"
                  placeholderTextColor="#888"
                />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <HideText width={24} height={24} color="#fff" />
                  ) : (
                    <ShowText width={24} height={24} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.formLabel}>Confirmar Senha</Text>
              <View style={styles.formInputContainer}>
                <TextInput
                  style={styles.formInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirme sua senha"
                  placeholderTextColor="#888"
                />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <HideText width={24} height={24} color="#fff" />
                  ) : (
                    <ShowText width={24} height={24} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.formButtonContainer}>
                <TouchableOpacity style={styles.formButton} onPress={handleConfirmPasswordChange}>
                  <Text style={styles.formButtonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formButton} onPress={togglePasswordView}>
                  <Text style={styles.formButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeView === 'favOverlay' && (
          <View style={styles.formOverlay}>
            <View style={styles.formContent}>
              <Text style={styles.formTitle}>Alterar dados Pessoais</Text>
              <Text style={styles.formLabel}>Nome</Text>
              <View style={styles.formInputContainer}>
              <TextInput
                  style={styles.formInput}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="Seu nome"
                  placeholderTextColor="#888"
                />
              </View>
              <Text style={styles.formLabel}>CPF</Text>
              <View style={styles.formInputContainer}>
                <TextInputMask
                  type={'cpf'}
                  style={styles.formInput}
                  value={userCPF ?? ''}
                  onChangeText={setUserCPF}
                  placeholder={userCPF ?? '000.000.000-00'}
                  placeholderTextColor="#888"
                />
              </View>
              <Text style={styles.formLabel}>Email</Text>
              <View style={styles.formInputContainer}>
                <TextInput
                  style={styles.formInput}
                  value={userEmail ?? ''}
                  onChangeText={setUserEmail}
                  placeholder={userEmail ?? 'seu@email.aqui'}
                  placeholderTextColor="#888"
                />
              </View>
              
              <View style={styles.formButtonContainer}>
                <TouchableOpacity style={styles.formButton} onPress={handleConfirmDataChange}>
                  <Text style={styles.formButtonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formButton} onPress={toggleFavView}>
                  <Text style={styles.formButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* MODAL ERROR MSG */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleErrorMsg}
          onRequestClose={closeModalErrorMsg}
        >
          <View style={styles.modalOverlayErrormsg}>
            <View style={styles.modalContentErrormsg}>
              <Text style={styles.modalTextErrormsg}>{errorMsg}</Text>
              <View style={styles.modalListErrormsg}>
              {errorMsg.includes('senha deve ter no minimo:') && (
                <>
                  <Text style={styles.modalListItemErrormsg}>• 8 caracteres</Text>
                  <Text style={styles.modalListItemErrormsg}>• 1 Letra maiúscula</Text>
                  <Text style={styles.modalListItemErrormsg}>• 1 Letra minúscula</Text>
                  <Text style={styles.modalListItemErrormsg}>• 1 Número</Text>
                  <Text style={styles.modalListItemErrormsg}>• 1 Caractere especial</Text>
                </>
              )}
              </View>
              <TouchableOpacity style={styles.modalButtonErrormsg} onPress={closeModalErrorMsg}>
                <Text style={styles.modalButtonTextErrormsg}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.black,
    paddingTop: 30,
  },
  menu: {
    flexGrow: 1,
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

  formOverlay: {
    backgroundColor: Colors.black,
  },
  formContent: {
    paddingTop: 10,
    paddingHorizontal: 30,
    borderRadius: 0,
    width: '100%',
    height: '100%',
  },
  formTitle: {
    fontSize: 28,
    marginBottom: 20,
    color: Colors.white,
  },
  formLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.white,
  },
  formInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  formInput: {
    height: 50,
    width: '100%',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    color: Colors.white,
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
  formButtonContainer: {
    flexDirection: 'column',
    marginTop: 20,
    width: '100%',
  },
  formButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#242424',
    borderColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  formButtonText: {
    color: Colors.white,
    fontSize: 16,
  },

  // MODAL ERROR MSG
  modalOverlayErrormsg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentErrormsg: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 500,
    alignItems: 'flex-start',
    zIndex: 1000,
  },
  modalTextErrormsg: {
    textAlign: 'left',
    fontSize: 18,
    marginBottom: 10,
  },
  modalListErrormsg: {
    textAlign: 'left',
    paddingLeft: 20,
    marginBottom: 10,
  },
  modalListItemErrormsg: {
    fontSize: 16,
    marginVertical: 2,
  },
  modalButtonErrormsg: {
    backgroundColor: '#242424',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonTextErrormsg: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Sidemenu;