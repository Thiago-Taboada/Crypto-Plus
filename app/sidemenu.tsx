import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, TextInput, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { ChevronLeft, ShowText, HideText } from '@/constants/Icons';
import { TextInputMask } from 'react-native-masked-text';
import AuthGuard from '@/components/AuthGuard';
import Planos from '@/components/Planos';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Buffer } from 'buffer'; 

const Sidemenu = () => {
  const [userNameGlobal, setUserNameGlobal] = useState<string | null>(null);
  const [userCPFGlobal, setUserCPFGlobal] = useState<string | null>(null);
  const [userEmailGlobal, setUserEmailGlobal] = useState<string | null>(null);
  const [userImageGlobal, setUserImageGlobal] = useState<string | null>(null);
  const [userPlanGlobal, setUserPlanGlobal] = useState<string | null>(null);
  const [userMoedaGlobal, setUserMoedaGlobal] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<'menu' | 'passwordOverlay' | 'dataOverlay' | 'favOverlay' | 'planosOverlay' | 'termosOverlay' >('menu');

  const [userName, setUserName] = useState('');
  const [userCPF, setUserCPF] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userMoeda, setUserMoeda] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [selectedPlano, setSelectedPlano] = useState('');

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modalVisibleErrorMsg, setModalVisibleErrorMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigation = useNavigation();

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

  // Image
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Falla ao abrir a galeria');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const uri = pickerResult.assets[0].uri;
      uploadImage(uri);
    }
  };
  
  const uploadImage = async (uri: string) => {
    console.log("Iniciando o upload da imagem...");
    
    const userId = await AsyncStorage.getItem('userId');
    console.log("userId obtido:", userId);
  
    try {
      console.log("URI da imagem:", uri);
    
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("Blob obtido:", blob);
    
      const mimeType = blob.type;
      const fileExtension = mimeType.split('/')[1];
      console.log("Tipo MIME da imagem:", mimeType);
      console.log("Extensão da imagem:", fileExtension);
      
      const base64Image = await blobToBase64(blob);
      console.log("Imagem convertida para base64:", base64Image.substring(0, 30) + '...');
    
      const jsonBody = {
        image: `${base64Image}`,
      };
  
      const res = await fetch(`http://3.17.66.110/api/user/${userId}/update-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonBody),
      });
    
      console.log("Status da resposta HTTP:", res.status);
    
      if (res.ok) {
        const data = await res.json();
        console.log("Resposta do servidor:", data);
    
        if (data.original?.status === 'success') {
          alert('Imagem atualizada com sucesso!');
          AsyncStorage.setItem('img64', base64Image);
          setUserImageGlobal(base64Image);
        } else {
          alert('Erro ao atualizar a imagem. Verifique a resposta do servidor.');
        }
      } else {
        console.log("Erro na resposta HTTP, código de status:", res.status);
        alert('Erro ao atualizar a imagem. Verifique o código de status no console.');
      }
    } catch (error) {
      console.error('Erro ao atualizar a imagem:', error);
      alert('Erro de conexão. Tente novamente.');
    }
  };
  
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  };
  
  //Password:
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateOldPassword = (password: string) => {
    return password.length >= 8;
  };
  

  const handleConfirmPasswordChange = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const storedPassword = await AsyncStorage.getItem('userPassword');
  
      if (!validateOldPassword(oldPassword)) {
        openModalErrorMsg('Informe a sua senha atual.');
        return;
      }
      if (oldPassword !== storedPassword) {
        openModalErrorMsg('A senha atual está incorreta.');
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
      fetch(`http://3.17.66.110/api/user/${userId}/update-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === "Senha atualizado com sucesso") {
            openModalErrorMsg("Senha alterada com sucesso!");
            AsyncStorage.setItem('userPassword', newPassword);
            setActiveView('menu');
          } else {
            openModalErrorMsg("Erro ao alterar a senha.");
            console.error("Error response:", data);
          }
        })
        .catch(error => {
          console.error("Erro ao alterar a senha:", error);
          openModalErrorMsg("Erro de conexão. Tente novamente.");
        });
    } catch (error) {
      console.error("Erro ao obter o ID do usuário:", error);
      openModalErrorMsg("Erro ao tentar recuperar o ID do usuário.");
    }
  };
  

  //Dados pessoais:
  const handleConfirmDataChange = async () => {
    const nameValidationRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{5,}$/;
    const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!nameValidationRegex.test(userName)) {
        openModalErrorMsg('O nome deve ter pelo menos 5 letras.');
        return;
      }
      if (!emailValidationRegex.test(userEmail)) {
        openModalErrorMsg('Email inválido.');
        return;
      }
  
      const nameResponse = await fetch(`http://3.17.66.110/api/user/${userId}/update-name`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName })
      });
      const emailResponse = await fetch(`http://3.17.66.110/api/user/${userId}/update-email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      const nameData = await nameResponse.json();
      const emailData = await emailResponse.json();
  
      if (nameData.message === "Nome atualizado com sucesso" && emailData.message === "E-mail atualizado com sucesso") {
        openModalErrorMsg('Nome e email atualizados com sucesso!');
        AsyncStorage.setItem('userName', userName);
        AsyncStorage.setItem('userEmail', userEmail);
        setActiveView('menu');
      } else {
        openModalErrorMsg("Erro de conexão. Tente novamente.");
      }
      
    } catch (error) {
      console.error("Erro ao atualizar os dados:", error);
      openModalErrorMsg("Erro de conexão. Tente novamente.");
    }
  };

  // Moeda Fav
  const handleConfirmMoedaChange = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
  
      if (!userMoeda) {
        openModalErrorMsg("Selecione uma moeda favorita.");
        return;
      }
      const response = await fetch(`http://3.17.66.110/api/user/${userId}/update-moeda`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moeda: userMoeda,
        }),
      });
      
      if (response.status !== 200) {
        openModalErrorMsg("Erro ao atualizar a moeda.");
      } else {
        openModalErrorMsg("Moeda atualizada com sucesso!");
        AsyncStorage.setItem('userMoeda', userMoeda);
        setActiveView('menu');
      }
    } catch (error) {
      console.error("Erro ao atualizar a moeda:", error);
      openModalErrorMsg("Erro no servidor. Tente novamente.");
    }
  };

  // Planos
  const handleConfirmPlanosChange = async (selectedPlano: string | null) => {
      const userId = await AsyncStorage.getItem('userId');
  
      console.log("ID plano seleciodado: ", selectedPlano);
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
  const togglePlanosView = () => {
    if (activeView === 'menu') {
      syncWithGlobalValues();
      setActiveView('planosOverlay' );
    } else {
      setActiveView('menu');
    }
  };
  const toggleTermosView = () => {
    if (activeView === 'menu') {
      syncWithGlobalValues();
      setActiveView('termosOverlay');
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
        const moeda = await AsyncStorage.getItem('userPlanoName');

        setUserNameGlobal(name);
        setUserCPFGlobal(cpf);
        setUserEmailGlobal(email);
        setUserImageGlobal(image);
        setUserPlanGlobal(plan);
        setUserMoedaGlobal(moeda);
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
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <ChevronLeft width={40} height={40} color={Colors.white} />
              </TouchableOpacity>
              
              <View style={styles.profileInfo}>
                <TouchableOpacity onPress={pickImage}>
                  <Image source={{ uri: `${userImageGlobal}` }} style={styles.image} />
                </TouchableOpacity>
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
            <TouchableOpacity style={styles.option} onPress={togglePlanosView}>
              <Text style={styles.optionText}>Gerenciar assinatura</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => { }}>
              <Text style={styles.optionText}>Exportar/Importar dados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={toggleTermosView}>
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
                  editable={false}
                  style={styles.formInput}
                  value={userCPF ?? ''}
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
              <Text style={styles.formTitle}>Alterar Moeda Favorita</Text>
              <Text style={styles.formLabel}>Selecione a moeda favorita</Text>
              
              <View style={styles.formInputContainer}>
                <Picker
                  selectedValue={userMoeda}
                  onValueChange={setUserMoeda}
                  style={styles.formInputPicker}
                >
                  <Picker.Item label="USD - Dólar dos Estados Unidos" value="USD" />
                  <Picker.Item label="BRL - Real Brasileiro" value="BRL" />
                  <Picker.Item label="CAD - Dólar Canadense" value="CAD" />
                  <Picker.Item label="MXN - Peso Mexicano" value="MXN" />
                  <Picker.Item label="ARS - Peso Argentino" value="ARS" />
                  <Picker.Item label="EUR - Euro" value="EUR" />
                  <Picker.Item label="GBP - Libra Esterlina" value="GBP" />
                  <Picker.Item label="JPY - Iene Japonês" value="JPY" />
                  <Picker.Item label="AUD - Dólar Australiano" value="AUD" />
                  <Picker.Item label="CHF - Franco Suíço" value="CHF" />
                  <Picker.Item label="CNY - Yuan Chinês" value="CNY" />
                  <Picker.Item label="INR - Rúpia Indiana" value="INR" />
                  <Picker.Item label="ZAR - Rand Sul-Africano" value="ZAR" />
                  <Picker.Item label="BRL - Real Brasileiro" value="BRL" />
                  <Picker.Item label="RUB - Rublo Russo" value="RUB" />
                  <Picker.Item label="KRW - Won Sul-Coreano" value="KRW" />
                  <Picker.Item label="SEK - Coroa Sueca" value="SEK" />
                  <Picker.Item label="NOK - Coroa Norueguesa" value="NOK" />
                  <Picker.Item label="PLN - Zloty Polonês" value="PLN" />
                </Picker>
              </View>
              
              <View style={styles.formButtonContainer}>
                <TouchableOpacity style={styles.formButton} onPress={handleConfirmMoedaChange}>
                  <Text style={styles.formButtonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formButton} onPress={toggleFavView}>
                  <Text style={styles.formButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeView === 'planosOverlay'  && (
          <View style={styles.formOverlay}>
            <View style={styles.formContent}>
              <Text style={styles.formTitle}>Planos</Text>
              <Planos onSelectPlano={setSelectedPlano} /> {/* Pasa la función como prop */}
              <View style={styles.formButtonContainer}>
                <TouchableOpacity style={styles.formButton} onPress={() => handleConfirmPlanosChange(selectedPlano)}>
                  <Text style={styles.formButtonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formButton} onPress={togglePlanosView}>
                  <Text style={styles.formButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeView === 'termosOverlay' && (
          <View style={styles.formOverlay}>
            <View style={styles.formContent}>
              <Text style={styles.formTitle}>Termos de uso do Crypto-Plus</Text>
              <ScrollView>
                <Text style={styles.overlayText}>
                  Bem-vindo ao Crypto-plus! Este termo de uso estabelece as condições para utilização do nosso software. Leia atentamente antes de prosseguir, pois, ao usar o Crypto-plus, você concorda integralmente com as regras aqui apresentadas.
                  {'\n\n'}
                  O Crypto-plus é um software desenvolvido para integrar informações financeiras de diferentes contas bancárias em um único local. Com ele, você pode visualizar gastos, rendas e transações realizadas em diversas instituições, de maneira prática e centralizada. Além disso, o Crypto-plus oferece funcionalidades adicionais, como acesso às cotações de criptomoedas e de moedas estrangeiras, permitindo que você acompanhe os valores atualizados dessas moedas diretamente pelo aplicativo.
                  {'\n\n'}
                  Para funcionar, o software acessa suas contas bancárias de forma segura e somente com sua permissão, por meio de integrações autorizadas com as plataformas das instituições financeiras. Nosso compromisso com a privacidade e proteção dos seus dados segue os princípios da Lei Geral de Proteção de Dados (Lei 13.709/2018). O Crypto-plus coleta apenas os dados indispensáveis para o funcionamento do software, utilizando essas informações exclusivamente para consolidar e exibir os dados das contas bancárias autorizadas por você. Não comercializamos nem compartilhamos os seus dados com terceiros sem seu consentimento. Além disso, adotamos medidas rigorosas de segurança para proteger suas informações contra acessos não autorizados.
                  {'\n\n'}
                  Você tem o direito de acessar, corrigir ou excluir os dados coletados a qualquer momento, assim como revogar sua permissão de uso do software. Caso deseje exercer algum desses direitos, basta entrar em contato conosco pelo e-mail suporte@crypto-plus.com.
                  {'\n\n'}
                  Ao utilizar o Crypto-plus, você se compromete a manter em sigilo suas credenciais bancárias e a usar o software exclusivamente para fins pessoais. É fundamental que você informe imediatamente qualquer atividade suspeita relacionada ao seu uso do aplicativo. Por outro lado, o Crypto-plus se compromete a proteger seus dados com as melhores práticas de segurança, garantir a transparência no funcionamento do software e notificá-lo sobre qualquer alteração relevante nos termos de uso ou na política de privacidade.
                  {'\n\n'}
                  Importante esclarecer que o Crypto-plus atua como um facilitador e não realiza transações financeiras em seu nome. Também não nos responsabilizamos por erros nas informações fornecidas pelas instituições bancárias, pelas cotações exibidas de criptomoedas ou moedas estrangeiras, nem por danos causados pelo uso indevido do software ou por acessos não autorizados decorrentes de negligência do usuário.
                  {'\n\n'}
                  Você pode encerrar o uso do Crypto-plus a qualquer momento, solicitando a exclusão da sua conta e dos dados associados ao serviço. O software poderá atualizar este Termo de Uso sempre que necessário, seja para aprimorar sua experiência ou atender a exigências legais. Qualquer mudança será comunicada com antecedência razoável.
                  {'\n\n'}
                  Se tiver dúvidas, solicitações ou problemas, entre em contato conosco pelo e-mail suporte@crypto-plus.com. Ao continuar usando o Crypto-plus, você declara que leu, entendeu e concorda com este Termo de Uso.
                </Text>
              </ScrollView>

              <View style={styles.formButtonContainer}>
                <TouchableOpacity style={styles.formButton} onPress={toggleTermosView}>
                  <Text style={styles.formButtonText}>Aceitar</Text>
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
  overlayText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
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
  formInputPicker: {
    height: 50,
    width: '100%',
    color: Colors.white,
    backgroundColor: Colors.gray
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
  formButtonContainer: {
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 20,
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