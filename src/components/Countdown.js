import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';
import { fontSizes, paddingSizes } from '../utils/sizes';

export const Countdown = ({ mins = 20, isPaused, onPrgress, onEnd }) => {
  const interval = React.useRef(null);
  const minsToMills = (min) => {
    return min * 1000 * 60;
  };
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  const [mills, setMills] = useState(null);
  const minute = Math.floor(mills / 1000 / 60) % 60;
  const seconds = Math.floor(mills / 1000) % 60;
  const countDown = () => {
    setMills((time) => {
      if (time === 0) {
        // do stuff here;
        clearInterval(interval.current);
        return time;
      }
      const timeLeft = time - 1000;

      return timeLeft;
    });
  };

  useEffect(() => {
    onPrgress(mills / minsToMills(mins));
    if (mills === 0) {
      onEnd();
    }
  }, [mills]);

  useEffect(() => {
    setMills(minsToMills(mins));
  }, [mins]);

  useEffect(() => {
    if (isPaused) {
      if (interval.current) {
        clearInterval(interval.current);
      }
      return;
    }
    interval.current = setInterval(countDown, 1000);
    return () => clearInterval(interval.current);
  }, [isPaused]);

  return (
    <Text style={styles.text}>
      {minute}:{formatTime(seconds)}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.white,
    padding: paddingSizes.lg,
    backgroundColor: 'rgba(94, 132, 226, 0.5)',
  },
});
