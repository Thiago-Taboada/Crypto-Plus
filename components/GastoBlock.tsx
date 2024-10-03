import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Plus } from '@/constants/Icons';
import gastosData from '@/data/gastosTypes.json';
import Colors from '@/constants/Colors';

interface Gasto {
    id: string;
    idTipoGasto: string;
    nome: string;
    valor: string;
}

interface GastoBlockProps {
    gastoList: Gasto[];
}

const rgbToLuminance = (r: number, g: number, b: number): number => {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastColor = (backgroundColor: string) => {
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);

    const luminance = rgbToLuminance(r, g, b);
    return luminance < 128 ? '#FFFFFF' : '#000000';
};

const GastoItem: React.FC<{ tipo: { nome: string; total: number; cor: string }; totalGastos: number }> = ({ tipo, totalGastos }) => {
    const textColor = getContrastColor(tipo.cor);
    const totalFormatted = tipo.total.toFixed(2).replace('.', ','); // Formato del total
    const [inteiro, decimal] = totalFormatted.split(','); // Separar la parte entera de los decimales

    return (
        <View style={[styles.gastoBlock, { backgroundColor: tipo.cor }]}>
            <Text style={[styles.gastoName, { color: textColor }]}>{tipo.nome}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={[styles.gastoValue, { color: textColor, fontWeight: '600' }]}>R$ {inteiro},</Text>
                <Text style={[styles.gastoValue, { color: textColor, fontSize: 12, fontWeight: '400' }]}>
                    {decimal}
                </Text>
            </View>
            <View style={styles.gastoPercentageArea}>
                <Text style={[styles.gastoPercentage, { color: textColor }]}>
                    {((tipo.total / totalGastos) * 100).toFixed(2)}%
                </Text>
            </View>
        </View>
    );
};

const GastoBlock: React.FC<GastoBlockProps> = ({ gastoList }) => {
    const tiposGasto = gastosData.reduce((acc, tipo) => {
        acc[tipo.id] = {
            nome: tipo.nome,
            total: 0,
            cor: Colors[tipo.cor] || 'gray',
        };
        return acc;
    }, {} as { [key: string]: { nome: string; total: number; cor: string } });

    gastoList.forEach((gasto) => {
        const tipo = tiposGasto[gasto.idTipoGasto];
        if (tipo) {
            tipo.total += parseFloat(gasto.valor.replace(',', '.'));
        }
    });

    const tiposConGastos = Object.entries(tiposGasto).filter(([_, tipo]) => tipo.total > 0);
    const totalGastos = tiposConGastos.reduce((acc, [_, tipo]) => acc + tipo.total, 0);

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.wrapper}>
                <View style={styles.addGastoBtn}>
                    <Plus width={22} height={22} color={"#ccc"} />
                </View>
                {tiposConGastos.map(([idTipo, tipo]) => (
                    <GastoItem key={idTipo} tipo={tipo} totalGastos={totalGastos} />
                ))}
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
        borderColor: "#666",
        borderStyle: "dashed",
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
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    gastoName: {
        fontSize: 14,
    },
    gastoValue: {
        fontSize: 16,
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
    },
});

export default GastoBlock;
