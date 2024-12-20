import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../type";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
 


type AddClinicalProfileNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ViewMetabolicTablePage"
>;

export default function ViewMetabolicTablePage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>View Metabolic Table Page</Text>
    </View>
  );
}
