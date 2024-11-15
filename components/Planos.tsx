import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from '@/constants/Colors';

interface Plano {
  id: string;
  exchange_coin: string;
  exchange_cryptos: string;
  grafics: boolean;
  income_forecast: number;
  name: string;
  qtd_types_expenses: number;
  qtd_types_profits: number;
  value: number;
}

interface PlanosProps {
  onSelectPlano: (id: string) => void;
}

const Planos: React.FC<PlanosProps> = ({ onSelectPlano }) => {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [selectedPlano, setSelectedPlano] = useState<string | null>(null);

  useEffect(() => {
    const idPlano = localStorage.getItem("IDplano");
    const storedPlanos: Plano[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("planoID")) {
        const plano = localStorage.getItem(key);
        if (plano) {
          storedPlanos.push(JSON.parse(plano));
        }
      }
    }

    storedPlanos.sort((a, b) => a.value - b.value);

    setPlanos(storedPlanos);
    setSelectedPlano(idPlano);
  }, []);

  const handleSelectPlano = (id: string) => {
    setSelectedPlano(id);
    onSelectPlano(id);
  };

  return (
    <View style={styles.container}>
      {planos.map((plano) => (
        <TouchableOpacity
          key={plano.id}
          style={[styles.planoContainer, {
            backgroundColor: plano.id === selectedPlano ? Colors.tintColor : Colors.gray,
          }]}
          onPress={() => handleSelectPlano(plano.id)}
        >
          <Text style={styles.planoTitle}>{plano.name}</Text>
          <Text style={styles.planoDetail}>
            Previsão da Carteira: {plano.income_forecast} Meses
          </Text>
          <Text style={styles.planoDetail}>
            Gráficos Avançados: {plano.grafics ? "Sim" : "Não"}
          </Text>
          <Text style={styles.planoDetail}>
            Sincronização de Criptomoedas: {plano.exchange_cryptos} seg
          </Text>
          <Text style={styles.planoDetail}>
            Sincronização de Moedas: {plano.exchange_coin} seg
          </Text>
          <Text style={styles.planoDetail}>
            Tipos de Despesas: {plano.qtd_types_expenses}
          </Text>
          <Text style={styles.planoDetail}>
            Tipos de Entradas: {plano.qtd_types_profits}
          </Text>

          <View style={styles.planoValueContainer}>
            <Text style={styles.planoValue}>
              {plano.value === 0 ? "Gratuito" : `R$${plano.value}`}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  planoContainer: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  planoTitle: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 5,
    textAlign: 'left',
  },
  planoDetail: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 3,
    textAlign: 'left',
  },
  planoValueContainer: {
    width: "100%",
    alignItems: 'flex-end',
  },
  planoValue: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: 'right',
  },
});

export default Planos;