import React, { useRef, useState } from 'react';
import { useColorScheme, Animated, PanResponder, Dimensions } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme } from './style/theme';
import { Ionicons } from '@expo/vector-icons'
import icon from './style/icon'



const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.background};
`;

const CardContainer = styled.View`
flex: 3;
justify-content: center;
align-items: center;
`;

const Card = styled.View`
justify-content: center;
align-items: center;
width: 300px;
height: 300px;
border-radius: 20px;
box-shadow: 1px 1px 5px rgba(0,0,0,.5);
background-color: ${props => props.theme.foreground};
position: absolute;
`;
const AnimateCard = Animated.createAnimatedComponent(Card);
const Btn = styled.TouchableOpacity``;
const BtnContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;



export default function App() {
  const isDark = useColorScheme() === 'dark';

  // animation value
  const POSITION = useRef(new Animated.ValueXY({
    x: 0,
    y: 0
  })).current
  const scale = useRef(new Animated.Value(1)).current;

  // interforlation
  const rotation = POSITION.x.interpolate({
    inputRange: [-150, 150],
    outputRange: ["-20deg", "20deg"],
    extrapolate: "clamp",
  });
  const secondScale = POSITION.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.5, 1],
    extrapolate: "clamp"
  })

  // animation move value
  const onPressCardIn = Animated.spring(scale, {
    toValue: 1.3,
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

  const goRight = Animated.spring(POSITION, {
    toValue: {
      x: 400,
      y: 0
    },
    restSpeedThreshold: 100,
    restDisplacementThreshold: 15,
    useNativeDriver: true,

  })

  const goLeft = Animated.spring(POSITION, {
    toValue: {
      x: -400,
      y: 0
    },
    restSpeedThreshold: 100,
    restDisplacementThreshold: 15,
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
      if (dx < -180) {
        Animated.parallel([onPressCardOut, goLeft]).start(onDismiss);
      } else if (dx > 180) {
        Animated.parallel([onPressCardOut, goRight]).start(onDismiss);
      } else {
        Animated.parallel([onPressCardOut, onBackCard]).start()
      }

    },
  })).current;
  // State 
  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    POSITION.setValue({ x: 0, y: 0 });
    setIndex(prev => prev + 1);
  }
  const handleConfirm = () => {
    goRight.start(onDismiss);
  };
  const handleClose = () => {
    goLeft.start(onDismiss);
  };


  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Container>
        <CardContainer>
          <AnimateCard {...panResponder.panHandlers}
            style={{
              transform: [{ scale: secondScale }],

            }}>
            <Ionicons name={icon[index + 1]} color={"red"} size={100} />
          </AnimateCard>

          <AnimateCard {...panResponder.panHandlers}
            style={{
              transform: [{ scale }, ...POSITION.getTranslateTransform(), { rotateZ: rotation }],
            }}>
            <Ionicons name={icon[index]} color={"red"} size={100} />
          </AnimateCard>


        </CardContainer>


        <BtnContainer>
          <Btn onPress={handleClose}>
            <Ionicons name="close-circle" color={"white"} size={30} />
          </Btn>
          <Btn onPress={handleConfirm}>
            <Ionicons name="checkmark-circle" color={"white"} size={30} />
          </Btn>
        </BtnContainer>

      </Container >
    </ThemeProvider>

  );
}

