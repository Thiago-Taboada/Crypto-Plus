import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import { PieChart } from 'react-native-gifted-charts';
import ExpenseBlock from '@/components/ExpenseBlock';
import IncomeBlock from '@/components/IncomeBlock';
import SpendingBlock from '@/components/SpendingBlock';
import ExpenseList from '@/data/expenses.json';
import incomeList from '@/data/income.json';
import spendingList from '@/data/spending.json';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const checkLocalStorage = async () => {
      try {
        const data = await AsyncStorage.getItem('userId');
        if (!data) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking local storage:', error);
      }
    };

    checkLocalStorage();
  }, [router]);

  const pieData = [
    {
      value: 47,
      color: Colors.tintColor,
      focused: true,
      text: '47%',
    },
    {
      value: 40,
      color: Colors.blue,
      text: '40%',
    },
    {
      value: 16,
      color: Colors.white,
      text: '16%',
    },
    { value: 3, color: '#FFA5BA', gradientCenterColor: '#FF7F97', text: '3%' },
  ];

  return (
    <View style={[styles.container, { paddingTop: 60 }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ gap: 10 }}>
            <Text style={{ color: Colors.white, fontSize: 16 }}>
              Minhas <Text style={{ fontWeight: '700' }}>Despesas</Text>
            </Text>
            <Text style={{ color: Colors.white, fontSize: 36, fontWeight: '700' }}>
              $1475.<Text style={{ fontSize: 22, fontWeight: '400' }}>00</Text>
            </Text>
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
              centerLabelComponent={() => {
                return (
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        fontSize: 22,
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      47%
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>

        <ExpenseBlock expenseList={ExpenseList} />
        <IncomeBlock incomeList={incomeList} />
        <SpendingBlock spendingList={spendingList} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
  },
});
export default Index;
