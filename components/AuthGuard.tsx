import React, { useEffect, useState, ReactNode } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLocalStorage = async () => {
      try {
        const data = await AsyncStorage.getItem('userId');
        if (!data) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking local storage:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLocalStorage();
  }, [router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.tintColor} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  loadingText: {
    color: Colors.white,
    marginTop: 10,
  },
});

export default AuthGuard;
