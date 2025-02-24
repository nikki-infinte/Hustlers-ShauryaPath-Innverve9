import React from "react";
import { 
  View, Text, ScrollView, ImageBackground, StyleSheet, TouchableOpacity 
} from "react-native";

const StoryScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require("../assets/background_03.jpg")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🔥 Operation Tricolor 🔥</Text>
        <Text style={styles.intro}>
          In the shadows of rising threats, an elite warrior rises—Veer, a tri-service commando, entrusted with India's most critical mission. The nation’s security rests in his hands.
        </Text>

        {/* Missions */}
        <Text style={styles.missionTitle}>🛡 Operation Siachen Sentinel</Text>
        <Text style={styles.missionText}>
          A forward post has gone silent. Enemy movements detected. Alone in the freezing void, Veer must uncover the truth and secure vital intel before an airstrike erases all traces.
        </Text>

        <Text style={styles.missionTitle}>⚓ Operation Samudra Rakshak</Text>
        <Text style={styles.missionText}>
          A terrorist cell hijacks an oil tanker, aiming for mass destruction. As a MARCOS commando, Veer must breach the ship, neutralize threats, and disarm explosives before catastrophe strikes.
        </Text>

        <Text style={styles.missionTitle}>✈ Operation Skyfire</Text>
        <Text style={styles.missionText}>
          Enemy drones breach Indian airspace, threatening a critical airbase. As a Garud Commando, Veer takes to the skies—ready for high-speed dogfights and a daring rescue mission.
        </Text>

        <Text style={styles.missionTitle}>🔥 Final Showdown: Operation Tricolor</Text>
        <Text style={styles.missionText}>
          The pieces are in place. Veer leads a joint strike with the Army, Navy, and Air Force to neutralize the mastermind behind the attack. This is the final battle for the nation’s safety.
        </Text>

        <Text style={styles.victoryText}>🏅 Mission Accomplished! The tricolor soars high. India is safe!</Text>
        <Text style={styles.jaiHind}>🇮🇳 Jai Hind! 🇮🇳</Text>

        {/* Navigation Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("BattleField")}>  
            <Text style={styles.buttonText}>Continue Mission 🚀</Text>
          </TouchableOpacity>
        </View>

        {/* Choose Avatar Option */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>🦸‍♂️ Choose Your Avatar</Text>
          <TouchableOpacity style={styles.avatarButton} onPress={() => navigation.navigate("chooseAvtar")}>  
            <Text style={styles.avatarButtonText}>Select Avatar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 20,
  },
  intro: {
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 15,
  },
  missionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF4500",
    marginTop: 20,
    textAlign: "center",
  },
  missionText: {
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 15,
  },
  victoryText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#32CD32",
    textAlign: "center",
    marginTop: 20,
  },
  jaiHind: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FF4500",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  avatarContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
  },
  avatarButton: {
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 8,
  },
  avatarButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StoryScreen;
