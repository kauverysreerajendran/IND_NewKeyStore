import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert, Platform, Image, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../type';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type ViewClinicalTableNavigationProp = StackNavigationProp<RootStackParamList, 'ViewClinicalTablePage'>;

const ViewClinicalTablePage: React.FC = () => {
  const [clinicalProfiles, setClinicalProfiles] = useState<any[]>([]);
  const navigation = useNavigation<ViewClinicalTableNavigationProp>();

  const jumpAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchClinicalProfiles = async () => {
      try {
        console.log('Fetching clinical profiles from AsyncStorage...');
        const storedData = await AsyncStorage.getItem('clinicalProfiles');
        if (storedData) {
          console.log('Clinical profiles found:', storedData);
          setClinicalProfiles(JSON.parse(storedData));
        } else {
          console.log('No clinical profiles found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Failed to load clinical profiles:', error);
      }
    };

    fetchClinicalProfiles();

    Animated.loop(
      Animated.sequence([
        Animated.timing(jumpAnimation, {
          toValue: -30,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(jumpAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [jumpAnimation]);

  const handleDelete = (profileID: string) => {
    console.log('Deleting clinical profile with ID:', profileID);
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const updatedProfiles = clinicalProfiles.filter(profile => profile.profileID !== profileID);
              console.log('Updated profiles after deletion:', updatedProfiles);
              setClinicalProfiles(updatedProfiles);
              await AsyncStorage.setItem('clinicalProfiles', JSON.stringify(updatedProfiles));
              console.log('Clinical profiles updated in AsyncStorage.');
            } catch (error) {
              console.error('Failed to delete clinical profile:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaProvider> 
<SafeAreaView style={styles.safeArea}>
      {/* Adjust StatusBar visibility */}
      <StatusBar 
        barStyle="dark-content"        // Set the color of status bar text
        backgroundColor="transparent"  // Make the background transparent
        translucent={true}             // Make status bar translucent
      />

    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={[styles.topLeftImageContainer, { transform: [{ translateY: jumpAnimation }] }]}>
        <Image source={require('../../assets/images/userlol.png')} style={styles.customImage} />
      </Animated.View>

      <Text style={styles.title}>Clinical Profiles</Text>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Patient ID</Text>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Age</Text>
          <Text style={styles.headerCell}>Action</Text>
        </View>

        {clinicalProfiles.length > 0 ? (
          clinicalProfiles.map((profile, index) => {
            const age = typeof profile.age === 'string' ? parseInt(profile.age, 10) : profile.age;
            console.log('Rendering clinical profile:', profile);

            return (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{profile.profileID}</Text>
                <Text style={styles.cell}>{profile.name}</Text>
                <Text style={styles.cell}>{age}</Text>
                <Text style={styles.cell}>{profile.condition}</Text>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => {
                      console.log('Navigating to DetailedProfile');
                     
                    }}
                  >
                    <Image source={require('../../assets/images/patientlol.png')} style={styles.actionImage} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(profile.profileID)}
                  >
                    <Image source={require('../../assets/images/userlol.png')} style={styles.actionImage} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noDataText}>No clinical profiles found.</Text>
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
</SafeAreaProvider>

  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 30 : 40,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  topLeftImageContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 100,
    height: 100,
    zIndex: 10,
  },
  customImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2a3439',
    top: 65,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    top: 60,
    width: '100%',
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: -5,
  },
  headerCell: {
    flex: 1,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 5,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    marginLeft: -36,
    paddingHorizontal: -3,
  },
  viewButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#F08080',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
  },
});

export default ViewClinicalTablePage;
