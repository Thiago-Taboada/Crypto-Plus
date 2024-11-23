import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Plus } from '@/constants/Icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';

interface TipoGasto {
    id: string;
    cor: string;
    description: string;
    icon: string;
    name: string;
}

interface Gasto {
    appellant: string;
    dt_init: string;
    dt_update: string;
    icon: string;
    idType: string;
    idUser: string;
    name: string;
    value: number;
}

interface GastoBlockProps {
    tipoGastoList: TipoGasto[];
    fetchGastoTipos: () => Promise<void>;
}

const GastoBlock: React.FC<GastoBlockProps> = ({ tipoGastoList, fetchGastoTipos }) => {
    const [gastosAgrupados, setGastosAgrupados] = useState<{ [key: string]: number }>({});
    const [totalGastos, setTotalGastos] = useState<number>(0);

    useEffect(() => {
        const fetchGastos = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                console.log('User ID:', userId);

                if (!userId) {
                    console.error('Erro: ID do usuário não encontrado');
                    return;
                }

                const simulatedResponse = {
                    success: true,
                    data: {
                        "-OCIg4pRXMKZSzxhle9H": {
                            appellant: "false",
                            dt_init: "2024-11-22T11:44:47.376259Z",
                            dt_update: "2024-11-22T11:44:47.376289Z",
                            icon: "HomeHeart",
                            idType: "-OCIe6LClliHm8lF-l6l",
                            idUser: "-OBgX_3On5FN5BOiuS2X",
                            name: "nome teste",
                            value: 856.4
                        },
                        "-OCIgcozBFOBgd1dhRGD": {
                            appellant: "tue",
                            dt_init: "2024-11-22T11:47:10.693789Z",
                            dt_update: "2024-11-22T11:47:10.693797Z",
                            icon: "HomeHeart",
                            idType: "-OCIiKJYuCSJjtlTnaj4",
                            idUser: "-OBgX_3On5FN5BOiuS2X",
                            name: "nome teste22222",
                            value: 856.4
                        },
                        "-OCIj_Qh2oFsxSxcnE6V": {
                            appellant: "false",
                            dt_init: "2024-11-22T12:00:03.234968Z",
                            dt_update: "2024-11-22T12:00:03.234976Z",
                            icon: "HomeHeart",
                            idType: "-OCIe6LClliHm8lF-l6l",
                            idUser: "-OBgX_3On5FN5BOiuS2X",
                            name: "segundo teste",
                            value: 256.4
                        },
                        "-OCIjiC4XyD1dUyFNVqt": {
                            appellant: "false",
                            dt_init: "2024-11-22T12:00:39.170407Z",
                            dt_update: "2024-11-22T12:00:39.170417Z",
                            icon: "HomeHeart",
                            idType: "-OCIiKJYuCSJjtlTnaj4",
                            idUser: "-OBgX_3On5FN5BOiuS2X",
                            name: "teste",
                            value: 16.4
                        }
                    }
                };

                const data = simulatedResponse;
                console.log('Simulated Response data:', data);
                if (data.success && data.data) {
                    const gastosAgrupadosPorTipo: { [key: string]: number } = {};
                    let total = 0;

                    Object.values(data.data).forEach((gasto: Gasto) => {
                        total += gasto.value;
                        if (gastosAgrupadosPorTipo[gasto.idType]) {
                            gastosAgrupadosPorTipo[gasto.idType] += gasto.value;
                        } else {
                            gastosAgrupadosPorTipo[gasto.idType] = gasto.value;
                        }
                    });

                    console.log('Grouped gastos:', gastosAgrupadosPorTipo);
                    setTotalGastos(total);
                    setGastosAgrupados(gastosAgrupadosPorTipo);
                } else {
                    console.error('Erro: Estrutura de dados inválida ou sem dados encontrados');
                }
            } catch (error) {
                console.error('Erro de conexão:', error);
            }
        };

        fetchGastos();
    }, [fetchGastoTipos]);

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.wrapper}>
                <View style={styles.addGastoBtn}>
                    <Plus width={22} height={22} color={'#ccc'} />
                </View>
                {tipoGastoList.map((tipo) => {
                    const gastoTotal = gastosAgrupados[tipo.id] || 0;
                    const percentage = totalGastos > 0 ? ((gastoTotal / totalGastos) * 100).toFixed(2) : '0.00';

                    return (
                        <View
                            key={tipo.id}
                            style={[styles.gastoBlock, { backgroundColor: Colors[tipo.cor] || 'gray' }]}
                        >
                            <Text style={styles.gastoName}>{tipo.name}</Text>
                            <Text style={styles.gastoValue}>
                                R$ {gastoTotal.toFixed(2).replace('.', ',') || '0,00'}
                            </Text>
                            <View style={styles.gastoPercentageArea}>
                                <Text style={styles.gastoPercentage}>
                                    {percentage}%
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    addGastoBtn: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#666',
        borderStyle: 'dashed',
        borderRadius: 10,
        marginRight: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gastoBlock: {
        minWidth: 100,
        padding: 15,
        borderRadius: 15,
        marginRight: 20,
        gap: 8,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    gastoName: {
        fontSize: 14,
    },
    gastoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    gastoPercentage: {
        fontSize: 14,
        fontWeight: "400",
    },
    gastoPercentageArea: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 10,
        fontWeight: '600',
    },
});

export default GastoBlock;
