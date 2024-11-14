import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from '@/constants/Colors';

interface Plano {
  id: number;
  graficos_avancados: boolean;
  intervalo_cambio_criptomoedas: number;
  intervalo_cambio_moedas: number;
  nome: string;
  previsao_renda: number;
  qt_tipos_gastos: number;
  valor: number;
}

interface PlanosProps {
  onSelectPlano: (id: string) => void; // Prop para pasar el ID del plano seleccionado
}

const Planos: React.FC<PlanosProps> = ({ onSelectPlano }) => {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [selectedPlano, setSelectedPlano] = useState<string | null>(null);

  useEffect(() => {
    // Obtener el ID del plano seleccionado desde localStorage
    const idPlano = localStorage.getItem("IDplano");

    // Obtener los planes desde localStorage (planoID0, planoID1, ...)
    const storedPlanos: Plano[] = [];
    let i = 0;
    while (localStorage.getItem(`planoID${i}`)) {
      const plano = localStorage.getItem(`planoID${i}`);
      if (plano) {
        storedPlanos.push(JSON.parse(plano));
      }
      i++;
    }

    // Ordenar los planos por ID
    storedPlanos.sort((a, b) => a.id - b.id);

    // Establecer el estado
    setPlanos(storedPlanos);
    setSelectedPlano(idPlano);
  }, []);

  const handleSelectPlano = (id: number) => {
    setSelectedPlano(id.toString());
    onSelectPlano(id.toString());  // Pasar el ID al componente principal
  };

  return (
    <View style={styles.container}>
      {planos.map((plano) => (
        <TouchableOpacity
          key={plano.id}
          style={[styles.planoContainer, {
            backgroundColor: plano.id === Number(selectedPlano) ? Colors.tintColor : Colors.gray,
          }]}
          onPress={() => handleSelectPlano(plano.id)}
        >
          <Text style={styles.planoTitle}>{plano.nome}</Text>
          <Text style={styles.planoDetail}>
            Previsão da Carteira: {plano.previsao_renda} Meses
          </Text>
          <Text style={styles.planoDetail}>
            Gráficos Avançados: {plano.graficos_avancados ? "Sim" : "Não"}
          </Text>
          <Text style={styles.planoDetail}>
            Sincronização de Criptomoedas: {plano.intervalo_cambio_criptomoedas} min
          </Text>
          <Text style={styles.planoDetail}>
            Sincronização de Moedas: {plano.intervalo_cambio_moedas} min
          </Text>
          <Text style={styles.planoDetail}>
            Tipos de Gastos: {plano.qt_tipos_gastos}
          </Text>

          <View style={styles.planoValueContainer}>
            <Text style={styles.planoValue}>
              {plano.valor === 0 ? "Gratuito" : `R$${plano.valor}`}
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
