import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGH_SCORES_KEY = '@soldier_run_high_scores';
const MAX_SCORES_TO_KEEP = 10;

const HighScorePage = ({ navigation, route }) => {
  const [highScores, setHighScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const newScore = route.params?.score;

  useEffect(() => {
    loadHighScores();
  }, []);

  useEffect(() => {
    if (newScore !== undefined) {
      handleNewScore(newScore);
    }
  }, [newScore]);

  const loadHighScores = async () => {
    try {
      const storedScores = await AsyncStorage.getItem(HIGH_SCORES_KEY);
      if (storedScores) {
        setHighScores(JSON.parse(storedScores));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load high scores');
      console.error('Failed to load high scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewScore = async (score) => {
    try {
      const newHighScore = {
        score,
        date: new Date().toISOString(),
        id: Date.now().toString()
      };

      const updatedScores = [...highScores, newHighScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_SCORES_TO_KEEP);

      await AsyncStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(updatedScores));
      setHighScores(updatedScores);

      const rank = updatedScores.findIndex(s => s.id === newHighScore.id) + 1;
      if (rank <= MAX_SCORES_TO_KEEP) {
        Alert.alert(
          'New High Score!',
          `Congratulations! Your score ranks #${rank} on the leaderboard!`
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save high score');
      console.error('Failed to save high score:', error);
    }
  };

  const clearHighScores = async () => {
    Alert.alert(
      'Clear High Scores',
      'Are you sure you want to clear all high scores? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(HIGH_SCORES_KEY);
              setHighScores([]);
            } catch (error) {
              Alert.alert('Error', 'Failed to clear high scores');
              console.error('Failed to clear high scores:', error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Scores</Text>
      
      <ScrollView style={styles.scrollView}>
        {highScores.length > 0 ? (
          highScores.map((score, index) => (
            <View key={score.id} style={styles.scoreRow}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.score}>{score.score}</Text>
              <Text style={styles.date}>{formatDate(score.date)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noScores}>No high scores yet!</Text>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Game')}
        >
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearHighScores}
        >
          <Text style={[styles.buttonText, styles.clearButtonText]}>
            Clear Scores
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  rank: {
    width: 50,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  score: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 14,
    color: '#888888',
  },
  noScores: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888888',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#2A2A2A',
  },
  clearButtonText: {
    color: '#FF4444',
  },
});

export default HighScorePage;