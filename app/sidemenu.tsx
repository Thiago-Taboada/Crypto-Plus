import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, TextInput, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { ChevronLeft, ShowText, HideText } from '@/constants/Icons';
import AuthGuard from '@/components/AuthGuard';

const Sidemenu = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userCPF, setUserCPF] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<'menu' | 'passwordOverlay'>('menu');
  const [showPasswordView, setShowPasswordView] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modalVisibleErrorMsg, setModalVisibleErrorMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const openModalErrorMsg = (message: string) => {
    setErrorMsg(message);
    setModalVisibleErrorMsg(true);
  };  

  const closeModalErrorMsg = () => {
    setModalVisibleErrorMsg(false);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    return passwordRegex.test(password);
  };
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


  const togglePasswordView = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setActiveView(activeView === 'menu' ? 'passwordOverlay' : 'menu');
  };

  const handleConfirmPasswordChange = () => {
    if (!validatePassword(newPassword)) {
      openModalErrorMsg('A nova senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.');
      return;
    }
    if (newPassword !== confirmPassword) {
      openModalErrorMsg('A nova senha e a confirmação devem ser iguais.');
      return;
    }
  
    setActiveView('menu');
  };

  return (
    <AuthGuard>
      <ScrollView contentContainerStyle={styles.container}>
        {activeView === 'menu' && (
          <View style={styles.menu}>
            {/* Contenido del menú */}
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
            {/* Opciones del menú */}
            <TouchableOpacity style={styles.option} onPress={() => { }}>
              <Text style={styles.optionText}>Dados pessoais</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={togglePasswordView}>
              <Text style={styles.optionText}>Alterar senha</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => { }}>
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
        </View>
        )}

        {activeView === 'passwordOverlay' && (
          <View style={styles.passwordOverlay}>
            <View style={styles.passwordContent}>
              <Text style={styles.passwordTitle}>Alterar senha</Text>
              {/* Campos para cambiar la contraseña */}
              <Text style={styles.passwordLabel}>Senha antiga</Text>
              <TextInput
                style={styles.passwordInput}
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!showOldPassword}
                placeholder="Digite sua senha antiga"
                placeholderTextColor="#888"
              />
              <TouchableOpacity style={styles.iconContainer} onPress={() => setShowOldPassword(!showOldPassword)}>
                {showOldPassword ? (
                  <HideText width={24} height={24} color="#fff" />
                ) : (
                  <ShowText width={24} height={24} color="#fff" />
                )}
              </TouchableOpacity>

              <Text style={styles.passwordLabel}>Senha nova</Text>
              <TextInput
                style={styles.passwordInput}
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

              <Text style={styles.passwordLabel}>Confirmar Senha</Text>
              <TextInput
                style={styles.passwordInput}
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

              <View style={styles.passwordButtonContainer}>
                <TouchableOpacity style={styles.passwordButton} onPress={togglePasswordView}>
                  <Text style={styles.passwordButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.passwordButton} onPress={handleConfirmPasswordChange}>
                  <Text style={styles.passwordButtonText}>Confirmar</Text>
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

  passwordOverlay: {
    flex: 1,
    backgroundColor: Colors.black,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  passwordContent: {
    paddingTop: 10,
    paddingHorizontal: 30,
    borderRadius: 0,
    width: '100%',
    height: '100%',
  },
  passwordTitle: {
    fontSize: 28,
    marginBottom: 20,
    color: Colors.white,
  },
  passwordLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.white,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    color: Colors.white,
  },
  passwordButtonContainer: {
    flexDirection: 'column',
    marginTop: 20,
    width: '100%',
  },
  passwordButton: {
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
  passwordButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    top: 15,
  },

  // MODAL ERROR MSG
  modalOverlayErrormsg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalContentErrormsg: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 500,
    alignItems: 'center',
    zIndex: 1000,
  },
  modalTextErrormsg: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalListErrormsg: {
    marginBottom: 20,
    textAlign: 'left',
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