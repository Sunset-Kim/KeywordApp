import React, { useRef } from 'react';
import { useColorScheme, Animated, PanResponder, Dimensions } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme } from './style/theme';
import { Ionicons } from '@expo/vector-icons'
import { interpolate } from 'react-native-reanimated';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.background};
`;
const Card = styled.View`
justify-content: center;
align-items: center;
width: 200px;
height: 200px;
border-radius: 20px;
box-shadow: 1px 1px 5px rgba(0,0,0,.5);
background-color: ${props => props.theme.foreground};
`;

const AnimateCard = Animated.createAnimatedComponent(Card);


export default function App() {
  const isDark = useColorScheme() === 'dark';

  // animation value
  const POSITION = useRef(new Animated.ValueXY({
    x: 0,
    y: 0
  })).current
  const scale = useRef(new Animated.Value(1)).current;

  // animation move value
  const onPressCardIn = Animated.spring(scale, {
    toValue: 1.5,
    tension: 100,
    friction: 3,
    useNativeDriver: true
  })
  const onPressCardOut = Animated.spring(scale, {
    toValue: 1,
    tension: 100,
    friction: 3,
    useNativeDriver: true
  })
  const onBackCard = Animated.spring(POSITION, {
    toValue: {
      x: 0,
      y: 0
    },
    useNativeDriver: true
  })

  // pan animation 
  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (_, { dx, dy }) => {
      onPressCardIn.start();
    },

    onPanResponderMove: (e, { dx, dy }) => {
      POSITION.setValue({
        x: dx,
        y: dy
      })
    },
    onPanResponderRelease: (e, { dx, dy }) => {
      Animated.parallel([onPressCardOut, onBackCard]).start()
    },
  })).current;

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Container>
        <AnimateCard {...panResponder.panHandlers} style={{
          transform: [{ scale }, ...POSITION.getTranslateTransform()],
        }}>
          <Ionicons name="pizza" color={"red"} size={100} />
        </AnimateCard>
      </Container >
    </ThemeProvider>

  );
}

