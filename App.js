import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Paltform, AsyncStorage } from 'react-native';
import { Focus } from './src/features/focus/Focus';
import { Timer } from './src/features/timer/Timer';
import { colors } from './src/utils/colors';
import { paddingSizes } from './src/utils/sizes';
import {FocusHistory} from './src/features/focus/FocusHistory';

const STATUS = {
  COMPLETE: 1,
  CANCLED: 2,
};

export default function App() {
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);

  const addFocusHistorySubjectWithState = (subject, status) => {
    setFocusHistory([...focusHistory, { subject, status, key: String(focusHistory.length + 1) }]);
  };

  const onClear = () => {
    setFocusHistory([])
  };

  const saveFocusHistory = async () => {
      try {
       await AsyncStorage.setItem("focusHsitory", JSON.stringify(focusHistory))
    } catch (e) {
      console.log(e)
    }
  };

  const loadFocusHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('focusHsitory');
      if(history && JSON.parse(history).length) {
        setFocusHistory(JSON.parse(history))
      }
    }catch (e) {
      console.log(e)
    }
  };
  useEffect(() => {
loadFocusHistory()
  }, [])

  useEffect(() => {
    saveFocusHistory()
  }, [focusHistory])
  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          clearSubject={() => {
            addFocusHistorySubjectWithState(focusSubject, STATUS.CANCLED);
            setFocusSubject(null);
          }}
          onTimerEnd={() => {
            addFocusHistorySubjectWithState(focusSubject, STATUS.COMPLETE);
            setFocusSubject(null);
          }}
        />
      ) : (
        <View style={{flex: 0.5}}>
        <Focus addSubject={setFocusSubject} />
        <FocusHistory focusHistory={focusHistory} onClear={onClear}/>
        </View>
      )}
      <Text>{focusSubject}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
    paddingTop: paddingSizes.md,
  },
});
