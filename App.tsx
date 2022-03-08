import axios from 'axios';
import {StatusBar} from 'expo-status-bar';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  Directions,
  FlingGestureHandler,
  State,
} from 'react-native-gesture-handler';

// Components
import OverflowItems from './src/components/OverflowItems';
import Posters from './src/components/Posters';

// Types
import {Movie} from './src/types/Movie';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollXIndex = useRef(new Animated.Value(0)).current;
  const scrollXAnimated = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  const setActiveIndex = useCallback(
    activeIndex => {
      setIndex(activeIndex);
      scrollXIndex.setValue(activeIndex);
    },
    [index],
  );

  useEffect(() => {
    axios
      .get('http://www.omdbapi.com/?apikey=f90ab49a&s=marvel')
      .then(res => {
        setLoading(false);
        setMovies(res?.data?.Search || []);
      })
      .catch(err => {
        setLoading(false);
        console.log(err?.response?.data || 'Something went wrong');
      });
  }, []);

  useEffect(() => {
    Animated.spring(scrollXAnimated, {
      toValue: scrollXIndex,
      useNativeDriver: true,
      // bounciness: 10,
      mass: 1,
      // velocity: 1,
      // stiffness: 1,
      // friction: 1,
    }).start();
  });

  return (
    <>
      {loading ? (
        <Text style={styles.loading}>Loading</Text>
      ) : (
        <FlingGestureHandler
          key="left"
          direction={Directions.LEFT}
          onHandlerStateChange={event => {
            if (event.nativeEvent.state === State.END) {
              if (index === movies.length - 1) {
                return;
              }

              setActiveIndex(index + 1);
            }
          }}>
          <FlingGestureHandler
            key="right"
            direction={Directions.RIGHT}
            onHandlerStateChange={event => {
              if (event.nativeEvent.state === State.END) {
                if (index === 0) {
                  return;
                }

                setActiveIndex(index - 1);
              }
            }}>
            <SafeAreaView style={styles.container}>
              <OverflowItems {...{movies, scrollXAnimated}} />
              <Posters {...{movies, scrollXAnimated}} />
            </SafeAreaView>
          </FlingGestureHandler>
        </FlingGestureHandler>
      )}
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
