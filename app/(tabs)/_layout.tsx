import React from "react";
import { Tabs } from "expo-router";
import { AntDesign, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import { View } from "react-native";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";

const Layout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colors.gray,
            position: "absolute",
            bottom: 30,
            justifyContent: "center",
            alignSelf: "center",
            height: 63,
            marginHorizontal: 80,
            paddingHorizontal: 10,
            paddingVertical: 8,
            paddingBottom: 8,
            borderRadius: 40,
            borderWidth: 1,
            borderTopWidth: 1,
            borderColor: "#333",
            borderTopColor: "#333",
          },
          tabBarShowLabel: false,
          tabBarInactiveTintColor: "#999",
          tabBarActiveTintColor: Colors.white,
          headerShown: false, // Ensure header is hidden in Tabs
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  padding: 12,
                  borderRadius: 30,
                  backgroundColor: focused ? Colors.tintColor : Colors.gray,
                }}
              >
                <SimpleLineIcons name="pie-chart" size={18} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  padding: 12,
                  borderRadius: 30,
                  backgroundColor: focused ? Colors.tintColor : Colors.gray,
                }}
              >
                <AntDesign name="swap" size={18} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  padding: 12,
                  borderRadius: 30,
                  backgroundColor: focused ? Colors.tintColor : Colors.gray,
                }}
              >
                <FontAwesome name="user-o" size={18} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
      <StatusBar style="light" />
    </>
  );
};

export default Layout;
