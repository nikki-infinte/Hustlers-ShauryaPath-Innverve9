import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const GROUND_HEIGHT = 120; // Increased ground height for better visibility
const SOLDIER_SIZE = 150; // Reduced soldier size for better proportions
const OBSTACLE_SIZE = 80; // Increased obstacle size for better visibility

// Adjusted soldier hitbox for more accurate collision detection
const SOLDIER_HITBOX = {
  width: 60,
  height: 120,
  offsetX: 50,
  offsetY: 0,
};

// Simplified parallax configuration
const PARALLAX_LAYERS = {
  SKY: {
    speed: 0.2,
    scale: 1.0,
    image: require('../assets/sky.png'),
  },
  MOUNTAINS: {
    speed: 0.5,
    scale: 1.0,
    image: require('../assets/mountains.png'),
  },
  GROUND: {
    speed: 1,
    scale: 1.0,
    image: require('../assets/ground.png'),
  },
};

// Adjusted obstacle configurations
const OBSTACLES = {
  BARBED_WIRE: {
    height: OBSTACLE_SIZE,
    damage: 20,
    image: require('../assets/obstacle.png'),
    hitbox: { width: OBSTACLE_SIZE - 20, height: OBSTACLE_SIZE - 20 },
  },
  TRENCH: {
    height: OBSTACLE_SIZE,
    damage: 30,
    image: require('../assets/trench.png'),
    hitbox: { width: OBSTACLE_SIZE - 20, height: OBSTACLE_SIZE - 20 },
  },
};

const COLLECTIBLES = {
  MED_KIT: {
    points: 10,
    health: 20,
    image: require('../assets/med-kit.png'),
    hitbox: { width: 40, height: 40 },
  },
  AMMO_BOX: {
    points: 15,
    image: require('../assets/ammo-box.png'),
    hitbox: { width: 40, height: 40 },
  },
};

const RANKS = ['Private', 'Corporal', 'Sergeant', 'Captain', 'Major'];

const SoldierRunGame = () => {
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [rank, setRank] = useState(RANKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Animation values
  const soldierY = useRef(new Animated.Value(0)).current;
  const obstacleX = useRef(new Animated.Value(WINDOW_WIDTH)).current;
  const groundX = useRef(new Animated.Value(0)).current;

  // Game state
  const isJumping = useRef(false);
  const gameSpeed = useRef(1);
  const obstacleAnimation = useRef(null);
  const groundAnimation = useRef(null);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setHealth(100);
    setRank(RANKS[0]);
    gameSpeed.current = 1;
    
    startGroundAnimation();
    spawnObstacle();
  };

  const startGroundAnimation = () => {
    const duration = 2000 / gameSpeed.current;
    
    groundAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(groundX, {
          toValue: -WINDOW_WIDTH,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(groundX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    
    groundAnimation.current.start();
  };

  const spawnObstacle = () => {
    if (isGameOver) return;
    
    const duration = 2000 / gameSpeed.current;
    obstacleX.setValue(WINDOW_WIDTH);
    
    obstacleAnimation.current = Animated.timing(obstacleX, {
      toValue: -OBSTACLE_SIZE,
      duration: duration,
      useNativeDriver: true,
    });
    
    obstacleAnimation.current.start(() => {
      updateScore(10);
      if (!isGameOver) {
        setTimeout(spawnObstacle, Math.random() * 1000 + 500);
      }
    });
  };

  const handleJump = () => {
    if (!isPlaying) {
      startGame();
      return;
    }

    if (isJumping.current || isGameOver) return;
    
    isJumping.current = true;
    Animated.sequence([
      Animated.timing(soldierY, {
        toValue: -200,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(soldierY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      isJumping.current = false;
    });
  };

  useEffect(() => {
    const checkCollision = () => {
      if (!isPlaying || isGameOver) return;

      const obstacleCurrentX = obstacleX.__getValue();
      const soldierCurrentY = soldierY.__getValue();

      const soldierHitbox = {
        x: SOLDIER_HITBOX.offsetX,
        y: WINDOW_HEIGHT - GROUND_HEIGHT - SOLDIER_SIZE + soldierCurrentY + SOLDIER_HITBOX.offsetY,
        width: SOLDIER_HITBOX.width,
        height: SOLDIER_HITBOX.height,
      };

      const obstacleHitbox = {
        x: obstacleCurrentX,
        y: WINDOW_HEIGHT - GROUND_HEIGHT - OBSTACLE_SIZE,
        width: OBSTACLES.BARBED_WIRE.hitbox.width,
        height: OBSTACLES.BARBED_WIRE.hitbox.height,
      };

      if (
        soldierHitbox.x < obstacleHitbox.x + obstacleHitbox.width &&
        soldierHitbox.x + soldierHitbox.width > obstacleHitbox.x &&
        soldierHitbox.y < obstacleHitbox.y + obstacleHitbox.height &&
        soldierHitbox.y + soldierHitbox.height > obstacleHitbox.y
      ) {
        handleCollision();
      }
    };

    const interval = setInterval(checkCollision, 16);
    return () => clearInterval(interval);
  }, [isPlaying, isGameOver]);

  const handleCollision = () => {
    const damage = OBSTACLES.BARBED_WIRE.damage;
    console.log('collision '+damage);
    
    setHealth(prev => {
      console.log('prev '+prev);
      
      const newHealth = prev - damage;
      if (newHealth <= 0) {
        gameOver();
      }
      return Math.max(0, newHealth);
    });
  };

  const gameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    obstacleAnimation.current?.stop();
    groundAnimation.current?.stop();
  };

  const updateScore = (points) => {
    console.log(health);
    const damage = OBSTACLES.BARBED_WIRE.damage;
    console.log(damage);
    setScore(prev => {
      const newScore = prev + points;
      const rankIndex = Math.min(Math.floor(newScore / 100), RANKS.length - 1);
      setRank(RANKS[rankIndex]);
      gameSpeed.current = 1 + (rankIndex * 0.2);
      return newScore;
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handleJump}>
      <View style={styles.container}>
        {/* Ground */}
        <Animated.View style={[styles.ground, { transform: [{ translateX: groundX }] }]}>
          <View style={styles.groundStrip} />
          <View style={styles.groundStrip} />
        </Animated.View>

        {/* Soldier */}
        <Animated.View
          style={[
            styles.soldier,
            { transform: [{ translateY: soldierY }] }
          ]}
        >
          <FastImage
            source={require('../assets/gifs/run_black.gif')}
            style={styles.soldierImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Animated.View>

        {/* Obstacle */}
        <Animated.View
          style={[
            styles.obstacle,
            { transform: [{ translateX: obstacleX }] }
          ]}
        >
          <FastImage
            source={OBSTACLES.BARBED_WIRE.image}
            style={styles.obstacleImage}
          />
        </Animated.View>

        {/* UI */}
        <View style={styles.uiContainer}>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.rank}>Rank: {rank}</Text>
          <Text style={styles.health}>Health: {health}</Text>
          {!isPlaying && (
            <Text style={styles.startText}>
              {isGameOver ? 'Game Over - Tap to Restart' : 'Tap to Start'}
            </Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: WINDOW_WIDTH * 2,
    height: GROUND_HEIGHT,
    flexDirection: 'row',
  },
  groundStrip: {
    width: WINDOW_WIDTH,
    height: GROUND_HEIGHT,
    backgroundColor: '#8B4513',
  },
  soldier: {
    position: 'absolute',
    bottom: GROUND_HEIGHT,
    left: SOLDIER_HITBOX.offsetX,
    width: SOLDIER_SIZE,
    height: SOLDIER_SIZE,
  },
  soldierImage: {
    width: '100%',
    height: '100%',
  },
  obstacle: {
    position: 'absolute',
    bottom: GROUND_HEIGHT,
    width: OBSTACLE_SIZE,
    height: OBSTACLE_SIZE,
  },
  obstacleImage: {
    width: '100%',
    height: '100%',
  },
  uiContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
  },
  score: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  rank: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
  },
  health: {
    fontSize: 24,
    color: '#ff4444',
    fontWeight: 'bold',
    marginTop: 10,
  },
  startText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: WINDOW_HEIGHT / 3,
  },
});

export default SoldierRunGame;