import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal, Button } from 'react-native';
import { theme } from '@/constants/theme';
import { ChevronRight, Clock, Flame } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type WorkoutCardProps = {
  title: string;
  duration: number;
  calories: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  imageUrl: string;
  onPress: () => void;
};

export default function WorkoutCard({ title, duration, calories, level, imageUrl, onPress }: WorkoutCardProps) {
  const [modalVisible, setModalVisible] = useState(false);

  // Define level color
  const levelColor = level === 'Beginner' 
    ? theme.colors.success[500]
    : level === 'Intermediate'
      ? theme.colors.warning[500]
      : theme.colors.error[500];

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={toggleModal} activeOpacity={0.9}>
        <ImageBackground
          source={{ uri: imageUrl }}
          style={styles.imageBackground}
          imageStyle={styles.image}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <View style={styles.topRow}>
                <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
                  <Text style={styles.levelText}>{level}</Text>
                </View>
              </View>
              
              <View style={styles.bottomRow}>
                <Text style={styles.title}>{title}</Text>
                
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Clock size={16} color="#fff" />
                    <Text style={styles.statText}>{duration} min</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Flame size={16} color="#fff" />
                    <Text style={styles.statText}>{calories} cal</Text>
                  </View>
                  
                  <ChevronRight size={20} color="#fff" />
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>

      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={toggleModal}
>
  <View style={styles.modalView}>
    <Text style={styles.modalText}>Workout Steps</Text>

    {level === 'Beginner' && (
      <>
        <Text>1. Jumping Jacks - 30 secs</Text>
        <Text>2. Push-ups (on knees) - 10 reps</Text>
        <Text>3. Bodyweight Squats - 15 reps</Text>
        <Text>4. Wall Sit - 30 secs</Text>
        <Text>5. Plank - 20 secs</Text>
      </>
    )}

    {level === 'Intermediate' && (
      <>
        <Text>1. High Knees - 45 secs</Text>
        <Text>2. Regular Push-ups - 15 reps</Text>
        <Text>3. Jump Squats - 20 reps</Text>
        <Text>4. Lunges - 10 reps each leg</Text>
        <Text>5. Plank with Shoulder Tap - 30 secs</Text>
      </>
    )}

    {level === 'Advanced' && (
      <>
        <Text>1. Burpees - 1 min</Text>
        <Text>2. Clap Push-ups - 15 reps</Text>
        <Text>3. Pistol Squats - 10 reps each leg</Text>
        <Text>4. Jump Lunges - 20 reps</Text>
        <Text>5. Plank to Push-up - 1 min</Text>
      </>
    )}

    <Button title="Close" onPress={toggleModal} />
  </View>
</Modal>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  image: {
    borderRadius: theme.borderRadius.lg,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  levelBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  levelText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.xs,
    color: '#fff',
  },
  bottomRow: {
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: theme.fonts.heading.bold,
    fontSize: theme.fontSizes.xl,
    color: '#fff',
    marginBottom: theme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  statText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.sm,
    color: '#fff',
    marginLeft: 4,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
