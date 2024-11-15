import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import AuthGuard from '@/components/AuthGuard';
import GastoBlock from '@/components/GastoBlock';
import IncomeBlock from '@/components/IncomeBlock';
import SpendingBlock from '@/components/SpendingBlock';
import spendingList from '@/data/spending.json';
import incomeList from '@/data/income.json';
import GastoList from '@/data/gastos.json';
import Colors from '@/constants/Colors';
import { Sync, LineChart, Calendar } from "@/constants/Icons";

const Carteira: React.FC = () => {
  const pieData = [
    { value: 47, color: Colors.tintColor, focused: true, text: '47%' },
    { value: 40, color: Colors.blue, text: '40%' },
    { value: 16, color: Colors.white, text: '16%' },
    { value: 3, color: '#FFA5BA', gradientCenterColor: '#FF7F97', text: '3%' },
  ];

  return (
    <AuthGuard>
      <View style={[styles.container, { paddingTop: 60 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ color: Colors.white, fontSize: 24, fontWeight: '700', marginBottom: 10, marginTop: 10 }}>
            Saldo
          </Text>

          <View style={styles.balanceContainer}>
            <View style={styles.balanceValuesRow}>
              <View>
                <Text style={{ color: Colors.white, fontSize: 22 }}>R$ 7955,00</Text>
                <Text style={{ color: Colors.white, fontSize: 22 }}>U$ 1325,80</Text>
              </View>
              <View style={styles.refreshContainer}>
                <Sync width={22} height={22} color={Colors.white} />
                <Text style={{ color: Colors.white, marginLeft: 5 }}>30 seg</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionContent}>
              <Text style={styles.buttonText}>Evolução da carteira</Text>
              <LineChart width={22} height={22} color={Colors.white} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionContent}>
              <Text style={styles.buttonText}>Ver previsoes</Text>
              <Calendar width={22} height={22} color={Colors.white} />
            </View>
          </TouchableOpacity>

          <Text style={{ color: Colors.white, fontSize: 16, marginTop: 20 }}>
            Minhas <Text style={{ fontWeight: '700' }}>Despesas</Text>
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ gap: 10 }}>
              <Text style={{ color: Colors.white, fontSize: 36, fontWeight: '700' }}>$1475.<Text style={{ fontSize: 22, fontWeight: '400' }}>00</Text></Text>
            </View>
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <PieChart
                data={pieData}
                donut
                showGradient
                sectionAutoFocus
                semiCircle
                radius={70}
                innerRadius={55}
                innerCircleColor={Colors.black}
                centerLabelComponent={() => (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>47%</Text>
                  </View>
                )}
              />
            </View>
          </View>
          
          <GastoBlock gastoList={GastoList} />
          <IncomeBlock incomeList={incomeList} />          
          <SpendingBlock spendingList={spendingList} />
        </ScrollView>
      </View>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
  },
  balanceContainer: {
    marginVertical: 20,
  },
  balanceValuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  actionButton: {
    borderWidth: 2,
    borderColor: "#666",
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
  },
});

export default Carteira;
