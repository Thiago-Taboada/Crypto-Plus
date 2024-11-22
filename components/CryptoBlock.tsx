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
import CryptoTypes from "@/data/cryptoTypes.json";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ColorKeys =
  | "black"
  | "gray"
  | "white"
  | "tintColor"
  | "blue"
  | "red"
  | "peach"
  | "robin_1"
  | "robin_2"
  | "cambridge_blue"
  | "celadon"
  | "tea_green_1"
  | "tea_green_2"
  | "tiffany_blue_1"
  | "tiffany_blue_2"
  | "alabaster"
  | "apricot_1"
  | "apricot_2"
  | "apricot_3"
  | "melon_1"
  | "melon_2"
  | "salmon"
  | "light_red"
  | "coral_pink"
  | "amaranth_pink"
  | "periwinkle"
  | "lilac"
  | "mimi_pink"
  | "light_cyan"
  | "light_blue"
  | "non_photo_blue"
  | "vanilla"
  | "mindaro"
  | "default";

interface CryptoType {
  id: string;
  idUser: string;
  nome: string;
  quantidade: string;
  cor: string;
  codigo: string;
}

interface CryptoBlockProps {
  cryptoList: CryptoType[];
  fetchCryptos: () => void;
}

const rgbToLuminance = (r: number, g: number, b: number): number => {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastColor = (backgroundColor: string) => {
  const r = parseInt(backgroundColor.slice(1, 3), 16);
  const g = parseInt(backgroundColor.slice(3, 5), 16);
  const b = parseInt(backgroundColor.slice(5, 7), 16);

  const luminance = rgbToLuminance(r, g, b);
  return luminance < 128 ? "#FFFFFF" : "#000000";
};

const CryptoBlock: React.FC<CryptoBlockProps> = ({ cryptoList, fetchCryptos }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("default");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [cryptoId, setCryptoId] = useState<string>(""); // Guarda el ID de la criptomoneda seleccionada
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);

  const getRandomColor = () => {
    const allowedColors = Object.keys(Colors).filter(
      (color) => color !== "black" && color !== "gray" && color !== "white"
    ) as ColorKeys[];
    const randomIndex = Math.floor(Math.random() * allowedColors.length);
    return allowedColors[randomIndex];
  };

  const resetFields = () => {
    setSelectedCrypto("");
    setCryptoId("");
    setSelectedColor(getRandomColor());
    setQuantity("");
    setName("");
    setCode("");
    setShowPlaceholder(true);
  };

  const handleCryptoClick = (crypto: CryptoType) => {
    setCryptoId(crypto.id);
    setName(crypto.nome);
    setQuantity(crypto.quantidade.toString());
    setSelectedColor(crypto.cor);
    setCode(crypto.codigo);
    setSelectedCrypto(crypto.codigo);
    setShowPlaceholder(false);
    setModalVisible(true);
  };

  const handleCryptoChange = (itemValue: string) => {
    setShowPlaceholder(false);

    if (itemValue === "OUTRO") {
      setName("");
      setCode("");
    } else {
      const selected = CryptoTypes.find(
        (option) => option.codigo === itemValue
      );
      if (selected) {
        setName(selected.nome);
        setCode(selected.codigo);
      }
    }
    setSelectedCrypto(itemValue);
  };

  const handleQuantityChange = (text: string) => {
    const filteredText = text.replace(/[^0-9,]/g, "");
    setQuantity(filteredText);
  };

  const openColorPicker = () => {
    setColorPickerVisible(true);
  };

  const closeColorPicker = () => {
    setColorPickerVisible(false);
  };

  const saveCrypto = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const formattedQuantity = quantity.replace(",", ".");

      const cryptoData = {
        uid: userId,
        cripto: {
          Nome: name,
          Quantidade: formattedQuantity,
          Cor: selectedColor,
          Codigo: code,
        },
      };

      const response = await fetch("http://3.17.66.110/api/addCripto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cryptoData),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.status === "success") {
          console.log(`Criptomoneda adicionada, ID: ${responseData.ID}`);
          setModalVisible(false);
          fetchCryptos();
        } else {
          console.error("Erro: Bad Response");
        }
      } else {
        console.error("Erro durante o envío");
      }
    } catch (error) {
      console.error("Erro de conexão", error);
    }
  };

  const updateCrypto = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const formattedQuantity = quantity.replace(",", ".");
  
      const cryptoData = {
        uid: userId,
        idCripto: cryptoId,
        cripto: {
          Nome: name,
          Quantidade: formattedQuantity,
          Cor: selectedColor,
          Codigo: code,
        },
      };
  
      const response = await fetch("http://3.17.66.110/api/updCripto", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cryptoData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
  
        if (responseData.status === "success") {
          console.log(`Criptomoneda actualizada, ID: ${responseData.ID}`);
          setModalVisible(false);
          fetchCryptos();
        } else {
          console.error("Erro: Bad Response");
        }
      } else {
        console.error("Erro durante o envio");
      }
    } catch (error) {
      console.error("Erro de conexão", error);
    }
  };
  
  const deleteCrypto = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const cryptoData = {
        uid: userId,
        idCripto: cryptoId,
      };
      const response = await fetch("http://3.17.66.110/api/dltCripto", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cryptoData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
  
        if (responseData.status === "success") {
          console.log(`Criptomoneda eliminada, ID: ${cryptoId}`);
          setModalVisible(false);
          fetchCryptos();
        } else {
          console.error("Erro: Bad Response");
        }
      } else {
        console.error("Erro durante o envio");
      }
    } catch (error) {
      console.error("Erro de conexão", error);
    }
  };

  const renderItem: ListRenderItem<CryptoType | null> = ({ item, index }) => {
    if (index === 0) {
      return (
        <TouchableOpacity
          onPress={() => {
            resetFields();
            setModalVisible(true);
          }}
        >
          <View style={styles.addItemBtn}>
            <Plus width={22} height={22} color={"#ccc"} />
          </View>
        </TouchableOpacity>
      );
    }

    if (item) {
      const textColor = getContrastColor(Colors[item.cor as ColorKeys]);
      return (
        <TouchableOpacity onPress={() => handleCryptoClick(item)}>
          <View
            style={[
              styles.cryptoBlock,
              {
                backgroundColor:
                  Colors[item.cor as ColorKeys] || Colors.default,
              },
            ]}
          >
            <Text style={[styles.cryptoName, { color: textColor }]}>
              {item.nome}
            </Text>
            <Text style={[styles.cryptoValue, { color: textColor }]}>
              {item.quantidade}
            </Text>
            <Text style={[styles.cryptoCode, { color: textColor }]}>
              {item.codigo}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderColorSquare = () => (
    <TouchableOpacity style={styles.colorContainer} onPress={openColorPicker}>
      <View
        style={[
          styles.colorPreview,
          { backgroundColor: Colors[selectedColor] || Colors.default },
        ]}
      />
      <Text style={styles.changeColorText}>Mudar cor</Text>
    </TouchableOpacity>
  );

  const renderColorGrid = () => (
    <Modal
      visible={colorPickerVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.colorGridModal}>
        <FlatList
          data={Object.keys(Colors).filter(
            (color) =>
              color !== "black" && color !== "gray" && color !== "white"
          )}
          numColumns={5}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.colorSquare, { backgroundColor: Colors[item] }]}
              onPress={() => {
                setSelectedColor(item);
                closeColorPicker();
              }}
            />
          )}
          keyExtractor={(item) => item}
        />
      </View>
    </Modal>
  );

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
          <Text style={styles.modalTitle}>
            {cryptoId ? "Editar Criptomoeda" : "Adicionar Criptomoeda"}
          </Text>

          <Picker
            selectedValue={selectedCrypto}
            onValueChange={handleCryptoChange}
            style={styles.picker}
          >
            {showPlaceholder && (
              <Picker.Item
                label="Escolha o tipo de criptomoeda aqui"
                value=""
              />
            )}
            {CryptoTypes.map((crypto) => (
              <Picker.Item
                key={crypto.codigo}
                label={crypto.nome}
                value={crypto.codigo}
              />
            ))}
            <Picker.Item label="Outro" value="OUTRO" />
          </Picker>

          <View style={styles.nameCodeContainer}>
            <TextInput
              style={[styles.modalInput, { flex: 1, marginRight: 10 }]}
              placeholder="Nome"
              placeholderTextColor="#fff"
              value={name}
              editable={selectedCrypto === "OUTRO"}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.modalInput, { flex: 1 }]}
              placeholder="Código"
              placeholderTextColor="#fff"
              value={code}
              editable={selectedCrypto === "OUTRO"}
              onChangeText={setCode}
            />
          </View>

          <TextInput
            style={styles.modalInput}
            placeholder="Quantidade"
            placeholderTextColor="#fff"
            keyboardType="default"
            value={quantity}
            onChangeText={handleQuantityChange}
          />

          {renderColorSquare()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            {!cryptoId && (
              <TouchableOpacity style={styles.modalButton} onPress={saveCrypto}>
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            )}
            {cryptoId && (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={updateCrypto}
              >
                <Text style={styles.modalButtonText}>Atualizar</Text>
              </TouchableOpacity>
            )}
          </View>

          {cryptoId && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#d9534f", marginTop: 10, }]}
                onPress={deleteCrypto}
              >
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}

          {renderColorGrid()}
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
    justifyContent: "center",
    alignItems: "center",
    width: 60,
  },
  cryptoBlock: {
    minWidth: 100,
    padding: 15,
    borderRadius: 15,
    marginRight: 20,
    gap: 8,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cryptoName: {
    fontSize: 14,
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
    justifyContent: "center",
    alignItems: "center",
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
    width: "100%",
    borderColor: "#fff",
    borderWidth: 0.5,
    marginBottom: 15,
    color: "#fff",
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  changeColorText: {
    color: "#fff",
    fontSize: 16,
  },
  colorGridModal: {
    flex: 1,
    paddingVertical: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  colorSquare: {
    width: 50,
    height: 50,
    margin: 5,
    borderRadius: 5,
  },
  modalButton: {
    height: 50,
    backgroundColor: "#242424",
    borderColor: "#fff",
    borderWidth: 0.5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  picker: {
    color: "#fff",
    width: "100%",
    marginBottom: 15,
    height: 50,
    backgroundColor: "#242424",
    maxHeight: 200,
  },
  nameCodeContainer: {
    flexDirection: "row",
    width: "100%",
  },
});

export default CryptoBlock;
