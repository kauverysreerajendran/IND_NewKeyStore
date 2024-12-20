// not in use
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../type";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

type ViewUserTableNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ViewUserTablePage"
>;

const ViewUserTablePage: React.FC = () => {
  const [userProfiles, setUserProfiles] = useState<any[]>([]); // Use `any` or define a new type if needed
  const navigation = useNavigation<ViewUserTableNavigationProp>();

  const jumpAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        console.log("Fetching user profiles from AsyncStorage...");
        const storedData = await AsyncStorage.getItem("userProfiles");
        if (storedData) {
          console.log("User profiles found:", storedData);
          setUserProfiles(JSON.parse(storedData));
        } else {
          console.log("No user profiles found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Failed to load user profiles:", error);
      }
    };

    fetchUserProfiles();

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

  const handleDelete = (userID: string) => {
    console.log("Deleting user profile with ID:", userID);
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this profile?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const updatedProfiles = userProfiles.filter(
                (profile) => profile.userID !== userID
              );
              console.log("Updated profiles after deletion:", updatedProfiles);
              setUserProfiles(updatedProfiles);
              await AsyncStorage.setItem(
                "userProfiles",
                JSON.stringify(updatedProfiles)
              );
              console.log("User profiles updated in AsyncStorage.");
            } catch (error) {
              console.error("Failed to delete user profile:", error);
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
          barStyle="dark-content" // Set the color of status bar text
          backgroundColor="transparent" // Make the background transparent
          translucent={true} // Make status bar translucent
        />

        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={() => navigation.navigate("AdminDashboardPage")} // Navigate to AdminDashboard
          >
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.topLeftImageContainer,
              { transform: [{ translateY: jumpAnimation }] },
            ]}
          >
            <Image
              source={require("../../assets/images/userlol.png")}
              style={styles.image}
            />
          </Animated.View>

          <Text style={styles.title}>User Logs</Text>

          <View style={styles.table}>
            <View style={styles.headerRow}>
              <Text style={styles.headerCell}>User ID</Text>
              <Text style={styles.headerCell}>Name</Text>
              <Text style={styles.headerCell}>Age</Text>
              <Text style={styles.headerCell}>Action</Text>
            </View>

            {userProfiles.length > 0 ? (
              userProfiles.map((user, index) => {
                const age =
                  typeof user.age === "string"
                    ? parseInt(user.age, 10)
                    : user.age;
                console.log("Rendering user profile:", user);

                return (
                  <View key={index} style={styles.row}>
                    <Text style={styles.cell}>{user.userID}</Text>
                    <Text style={styles.cell}>{user.userName}</Text>
                    <Text style={styles.cell}>{age}</Text>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() => {
                          console.log("Navigating to ViewPatientTable");
                          navigation.navigate("ViewPatientTablePage"); // Navigate without parameters
                        }}
                      >
                        <MaterialIcons
                          name="visibility"
                          size={20}
                          color="#1E90FF"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(user.userID)}
                      >
                        <MaterialIcons
                          name="delete"
                          size={20}
                          color="#FF6347"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noDataText}>No user profiles found.</Text>
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
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "ios" ? 30 : 40,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  backButtonContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 58 : 55,
    left: Platform.OS === "ios" ? 20 : 20,
    width: 36,
    height: Platform.OS === "ios" ? 35 : 35,
    borderRadius: 25,
    backgroundColor: "#fff", // Same background color for both
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  topLeftImageContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 100,
    height: 100,
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2a3439",
    top: 65,
  },
  table: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
    top: 60,
    width: "100%",
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: -5,
  },
  headerCell: {
    flex: 1,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    marginLeft: -36,
    paddingHorizontal: -3,
  },
  viewButton: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    color: "#F08080",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
  },
});

export default ViewUserTablePage;
