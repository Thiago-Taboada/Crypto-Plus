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

type ColorKeys = 
  'black' | 'gray' | 'white' | 'tintColor' | 'blue' | 'red' | 
  'peach' | 'robin_1' | 'robin_2' | 'cambridge_blue' | 'celadon' | 
  'tea_green_1' | 'tea_green_2' | 'tiffany_blue_1' | 'tiffany_blue_2' | 
  'alabaster' | 'apricot_1' | 'apricot_2' | 'apricot_3' | 'melon_1' | 
  'melon_2' | 'salmon' | 'light_red' | 'coral_pink' | 'amaranth_pink' | 
  'periwinkle' | 'lilac' | 'mimi_pink' | 'light_cyan' | 'light_blue' | 
  'non_photo_blue' | 'vanilla' | 'mindaro' | 'default';

interface CryptoType {
  id: string;
  idUser: string;
  nome: string;
  valor: string;
  cor: string;
  codigo: string;
}

interface CryptoBlockProps {
  cryptoList: CryptoType[];
}

const CryptoBlock: React.FC<CryptoBlockProps> = ({ cryptoList }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string>(''); 
  const [color, setColor] = useState<string>('default');
  const [quantity, setQuantity] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true); // Para controlar la visibilidad del placeholder

  // Función para asignar un color aleatorio excluyendo 'black', 'gray', y 'white'
  const getRandomColor = () => {
    const allowedColors = Object.keys(Colors).filter(color => 
      color !== 'black' && color !== 'gray' && color !== 'white'
    ) as ColorKeys[];
    const randomIndex = Math.floor(Math.random() * allowedColors.length);
    return allowedColors[randomIndex];
  };

  // Limpia los campos cuando se abre el modal
  const resetFields = () => {
    setSelectedCrypto('');
    setColor(getRandomColor());
    setQuantity('');
    setName('');
    setCode('');
    setShowPlaceholder(true);  // Muestra el placeholder al abrir el modal
  };

  const handleCryptoChange = (itemValue: string) => {
    setShowPlaceholder(false);  // Una vez seleccionado un valor, ocultar el placeholder

    if (itemValue === "OUTRO") {
      setName('');  // Vacía los campos si se selecciona "Outro"
      setCode('');
    } else {
      const selected = CryptoTypes.find(option => option.codigo === itemValue);
      if (selected) {
        setName(selected.nome);
        setCode(selected.codigo);
      }
    }

    setSelectedCrypto(itemValue);
  };

  const newCrypto = () => {
    resetFields();
    setModalVisible(true);
  };

  const saveCrypto = () => {
    // Implementar lógica de guardado
    setModalVisible(false);
  };

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

    if (item) {
      return (
        <View style={[styles.cryptoBlock, { backgroundColor: Colors[item.cor as ColorKeys] || Colors.default }]}>
          <Text style={styles.cryptoName}>{item.nome}</Text>
          <Text style={styles.cryptoValue}>{item.valor}</Text>
          <Text style={styles.cryptoCode}>{item.codigo}</Text>
        </View>
      );
    }

    return null;
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
          <Text style={styles.modalTitle}>Adicionar Criptomoeda</Text>

          <Picker
            selectedValue={selectedCrypto}
            onValueChange={handleCryptoChange}
            style={styles.picker}
          >
            {showPlaceholder && <Picker.Item label="Escolha o tipo de criptomoeda aqui" value="" />}
            {CryptoTypes.map((crypto) => (
              <Picker.Item key={crypto.codigo} label={crypto.nome} value={crypto.codigo} />
            ))}
            <Picker.Item label="Outro" value="OUTRO" />
          </Picker>

          <View style={styles.nameCodeContainer}>
            <TextInput
              style={[styles.modalInput, { flex: 1, marginRight: 10 }]} 
              placeholder="Nome"
              value={name}
              editable={selectedCrypto === 'OUTRO'}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.modalInput, { flex: 1 }]} 
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
              onValueChange={(itemValue: string) => setColor(itemValue)}
              style={[styles.picker, { marginLeft: 10 }]} 
            >
              {Object.keys(Colors).filter(c => c !== 'black' && c !== 'gray' && c !== 'white').map(colorOption => (
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
    padding: 40,
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
    height: 50, 
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 15,
  },
  modalButton: {
    height: 50,
    maxWidth: 500,
    backgroundColor: '#242424',
    borderColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  picker: {
    color: '#fff',
    width: '100%',
    marginBottom: 15,
    height: 50, 
    backgroundColor: '#242424',
  },
  nameCodeContainer: {
    flexDirection: 'row',
    width: '100%',
  },
});

export default CryptoBlock;
