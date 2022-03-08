import {View, Text, StyleSheet, Dimensions, Animated} from 'react-native';
import React from 'react';

// Types
import {Movie} from '../types/Movie';

type OverflowItemsProps = {
  movies: Movie[];
  scrollXAnimated: Animated.Value;
};

const OVERFLOW_HEIGHT = 70;
const SPACING = 10;

const OverflowItems = ({movies, scrollXAnimated}: OverflowItemsProps) => {
  const inputRange = [-1, 0, 1];

  const translateY = scrollXAnimated.interpolate({
    inputRange,
    outputRange: [OVERFLOW_HEIGHT, 0, -OVERFLOW_HEIGHT],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{transform: [{translateY}]}}>
        {movies.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.Title}
            </Text>
            <View style={styles.itemContainerRow}>
              <Text style={styles.text}>{item.imdbID}</Text>
              <Text style={styles.text}>{item.Year}</Text>
            </View>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: OVERFLOW_HEIGHT,
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  itemContainer: {
    height: OVERFLOW_HEIGHT,
    padding: SPACING,
  },
  itemContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
  },
});

export default OverflowItems;
