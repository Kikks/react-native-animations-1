import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';

// Types
import {Movie} from '../types/Movie';

type PosterProps = {
  movies: Movie[];
  scrollXAnimated: Animated.Value;
};

const {width} = Dimensions.get('screen');
const SPACING = 10;
const ITEM_WIDTH = width * 0.7;
const ITEM_HEIGHT = ITEM_WIDTH * 1.7;
const VISIBLE_ITEMS = 3;

const Posters = ({movies, scrollXAnimated}: PosterProps) => {
  return (
    <FlatList
      data={movies}
      horizontal
      inverted
      scrollEnabled={false}
      removeClippedSubviews={false}
      keyExtractor={(_, index) => String(index)}
      contentContainerStyle={styles.container}
      CellRendererComponent={({item, index, style, children, ...props}) => {
        const newStyles = [style, {zIndex: movies.length - index}];
        return (
          <View
            {...{
              style: newStyles,
              index,
              ...props,
            }}>
            {children}
          </View>
        );
      }}
      renderItem={({item, index}) => {
        const inputRange = [index - 1, index, index + 1];

        const translateX = scrollXAnimated.interpolate({
          inputRange,
          outputRange: [50, 0, -100],
        });

        const scale = scrollXAnimated.interpolate({
          inputRange,
          outputRange: [0.8, 1, 1.3],
        });

        const opacity = scrollXAnimated.interpolate({
          inputRange,
          outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
        });

        return (
          <Animated.View
            style={[
              styles.imageContainer,
              {
                opacity,
                transform: [{translateX}, {scale}],
              },
            ]}>
            <Image source={{uri: item.Poster}} style={styles.image} />
          </Animated.View>
        );
      }}
    />
  );
};

export default Posters;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING * 2,
  },
  imageContainer: {
    position: 'absolute',
    left: -ITEM_WIDTH / 2.2,
  },
  image: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
  },
});
