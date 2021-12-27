import React, { useState } from 'react';
import { Text, View, StyleSheet, Vibration, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { RoundedButton } from '../../components/RoundedButton';
import { paddingSizes, fontSizes } from '../../utils/sizes';
import { colors } from '../../utils/colors';
import { useKeepAwake } from 'expo-keep-awake';

import { Countdown } from '../../components/Countdown';
import { Timing } from './Timing';

const DEFAULT_TIME = 0.1;

export const Timer = ({ focusSubject, onTimerEnd, clearSubject }) => {
  useKeepAwake();
  const [mins, setMins] = useState(DEFAULT_TIME);
  const [isStarted, setIsStarted] = useState(false);
  const [progress, setProgress] = useState(1);

  const onPrgress = (p) => {
    setProgress(p);
  };

  const changeTime = (time) => {
    setMins(time);
    setProgress(1);
    setIsStarted(false);
  };

  const vibrate = () => {
    if(Platform.OS === 'ios'){
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      setTimeout(() => clearInterval(interval), 5000)
    } else {
      Vibration.vibrate(5000)
    }
  };

  const onEnd = () => {
    vibrate();
    setMins(DEFAULT_TIME);
    setProgress(1);
    setIsStarted(false);
    onTimerEnd();
  };
  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown
          mins={mins}
          isPaused={!isStarted}
          onPrgress={onPrgress}
          onEnd={onEnd}
        />
      </View>
      <View style={{ paddingTop: paddingSizes.xxl }}>
        <Text style={styles.title}>Focusing on: </Text>
        <Text style={styles.task}>{focusSubject} </Text>
      </View>
      <View style={{ paddingTop: paddingSizes.sm }}>
        <ProgressBar
          color="#5e84e2"
          style={{ height: 10 }}
          progress={progress}
        />
      </View>
      <View style={styles.buttonsWrapper}>
        <Timing changeTime={changeTime} />
      </View>
      <View style={styles.buttonsWrapper}>
        {!isStarted ? (
          <RoundedButton title="start" onPress={() => setIsStarted(true)} />
        ) : (
          <RoundedButton title="pause" onPress={() => setIsStarted(false)} />
        )}
      </View>
      <View style={styles.clearButton}>
      <RoundedButton title="-" size={50} onPress={() => clearSubject()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: colors.white,
    textAlign: 'center',
  },
  task: {
    color: colors.white,
    fontWight: 'bold',
    textAlign: 'center',
  },
  countdown: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsWrapper: {
    flex: 0.3,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    paddingBottom: 25,
    paddingLeft: 25,
  },
});
