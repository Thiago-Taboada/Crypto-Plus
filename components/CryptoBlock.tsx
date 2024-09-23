import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    TextInput,
  } from "react-native";
  import React, { useState } from "react";
  import Colors from "@/constants/Colors";
  import { Plus } from "@/constants/Icons";
  import CryptoTypes from '@/data/cryptoTypes.json';
  import { Picker } from '@react-native-picker/picker';
  
  type ColorKeys = 'black' | 'gray' | 'white' | 'tintColor' | 'blue' | 'red' | 'peach' | 'robin' | 'periwinkle' | 'mindaro' | 'default';
  
  interface CryptoType {
    id: string;
    idUser: string;
    nome: string;
    valor: string;
    cor: string; // Cambia a string para permitir cualquier valor
    codigo: string;
  }
  
  interface CryptoBlockProps {
    cryptoList: CryptoType[];
  }
  
  const CryptoBlock: React.FC<CryptoBlockProps> = ({ cryptoList }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCrypto, setSelectedCrypto] = useState<string>(''); // Inicializar con una cadena vacía
    const [color, setColor] = useState<string>('default'); // Default color
    const [quantity, setQuantity] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [code, setCode] = useState<string>('');
  
    const handleCryptoChange = (itemValue: string) => {
      const selected = CryptoTypes.find(option => option.codigo === itemValue);
      if (selected) {
        setName(selected.nome);
        setCode(selected.codigo);
      }
      setSelectedCrypto(itemValue);
    };
  
    const newCrypto = () => {
      setModalVisible(true);
    };
  
    const saveCrypto = () => {
      // Implement save logic here
      setModalVisible(false);
    };
  
    const colorOptions = Object.keys(Colors) as ColorKeys[];
  
    const renderItem: ListRenderItem<CryptoType | null> = ({ item, index }) => {
      if (index === 0) {
        return (
          <TouchableOpacity onPress={newCrypto}>
            <View style={styles.addItemBtn}>
              <Plus width={22} height={22} color={"#ccc"} />
            </View>
          </TouchableOpacity>
        );
      }
  
      // Asegúrate de que item no sea null
      if (item) {
        return (
          <View style={[styles.cryptoBlock, { backgroundColor: Colors[item.cor as ColorKeys] || Colors.default }]}>
            <Text style={styles.cryptoName}>{item.nome}</Text>
            <Text style={styles.cryptoValue}>{item.valor}</Text>
            <Text style={styles.cryptoCode}>{item.codigo}</Text>
          </View>
        );
      }
  
      return null; // Si item es null, no renderiza nada
    };
  
    return (
      <View style={{ paddingVertical: 20 }}>
        <FlatList
          data={[null, ...cryptoList]}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => (item ? item.id : `add-button-${index}`)}
        />
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Cryptocurrency</Text>
  
            <Picker
              selectedValue={selectedCrypto}
              onValueChange={handleCryptoChange}
              style={styles.picker}
            >
              {CryptoTypes.map((crypto) => (
                <Picker.Item key={crypto.codigo} label={crypto.nome} value={crypto.codigo} />
              ))}
              <Picker.Item label="Outro" value="OUTRO" />
            </Picker>
  
            <View style={styles.nameCodeContainer}>
              <TextInput
                style={[styles.modalInput, { flex: 1, marginRight: 10 }]} // Nome input
                placeholder="Nome"
                value={name}
                editable={selectedCrypto === 'OUTRO'}
                onChangeText={setName}
              />
              <TextInput
                style={[styles.modalInput, { flex: 1 }]} // Código input
                placeholder="Código"
                value={code}
                editable={selectedCrypto === 'OUTRO'}
                onChangeText={setCode}
              />
            </View>
  
            <TextInput
              style={styles.modalInput}
              placeholder="Quantidade"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
  
            <View style={styles.colorPickerContainer}>
              <View style={[styles.colorPreview, { backgroundColor: Colors[color] || Colors.default, height: 50 }]} />
              <Picker
                selectedValue={color}
                onValueChange={(itemValue: string) => setColor(itemValue)} // Definido el tipo aquí
                style={[styles.picker, { marginLeft: 10 }]} // Espacio añadido
              >
                {colorOptions.map(colorOption => (
                  <Picker.Item key={colorOption} label={colorOption} value={colorOption} />
                ))}
              </Picker>
            </View>
  
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={saveCrypto}>
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    addItemBtn: {
      flex: 1,
      borderWidth: 2,
      borderColor: "#666",
      borderStyle: "dashed",
      borderRadius: 10,
      marginRight: 20,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      width: 60,
    },
    cryptoBlock: {
      minWidth: 100,
      padding: 15,
      borderRadius: 15,
      marginRight: 20,
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    cryptoName: {
      fontSize: 16,
    },
    cryptoValue: {
      fontSize: 16,
      fontWeight: "600",
    },
    cryptoCode: {
      fontSize: 14,
      fontWeight: "400",
    },
    modalView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.black,
      padding: 20,
    },
    modalTitle: {
      color: "#fff",
      fontSize: 24,
      marginBottom: 10,
    },
    modalInput: {
      height: 50,
      width: '100%',
      borderColor: '#fff',
      borderWidth: 0.5,
      marginBottom: 15,
      color: "#fff",
      paddingHorizontal: 10,
      borderRadius: 3,
    },
    colorPickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      width: "100%",
    },
    colorPreview: {
      width: 30,
      height: 50, // Altura ajustada
      borderRadius: 5,
      marginRight: 10, // Espacio entre el cuadrado y el select
    },
    modalButton: {
      backgroundColor: '#242424',
      padding: 10,
      borderRadius: 5,
      width: '48%', // Ajustado para que dos botones quepan
      alignItems: 'center',
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    nameCodeContainer: {
      flexDirection: 'row',
      width: '100%',
      marginBottom: 15,
    },
    picker: {
      height: 50,
      width: '100%',
      color: '#fff',
      backgroundColor: '#242424',
      borderColor: '#fff',
      borderWidth: 0.5,
      borderRadius: 3,
      marginBottom: 15,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
  });
  
  export default CryptoBlock;
