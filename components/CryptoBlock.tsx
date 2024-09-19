import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Plus } from "@/constants/Icons";

type ColorKeys = 'black' | 'gray' | 'white' | 'tintColor' | 'blue' | 'red' | 'peach' | 'robin' | 'periwinkle' | 'mindaro' | 'default';

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
            const itemColor = Colors[item.cor as ColorKeys] || Colors.default;
            const textColor = itemColor === Colors.mindaro ? Colors.black : Colors.white;

            return (
                <View style={[styles.cryptoBlock, { backgroundColor: itemColor }]}>
                    <Text style={[styles.cryptoName, { color: textColor }]}>{item.nome}</Text>
                    <Text style={[styles.cryptoValue, { color: textColor }]}>{item.valor}</Text>
                    <Text style={[styles.cryptoCode, { color: textColor }]}>{item.codigo}</Text>
                </View>
            );
        }

        return null;
    };

    const newCrypto = () => {
        console.log("Agregar criptomoneda");
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
});

export default CryptoBlock;
