import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

/* 
  FadeTransition does both the fade in animation and the fade out animation
  These two animations are controlled by the phase prop
  If the phase prop is even (0, 2, ..), it will be considered an intro phase and will fade in.
  else, it will be considered an exit phase and will fade out.
*/

const FadeTransition = ({ children, phase, setPhase }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-50)).current;

  const startFadeInAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 5000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 2500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const startFadeOutAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }),
      Animated.timing(translateYAnim, {
        toValue: 50,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (phase == 5) {
        setPhase(0);
      } else {
        setPhase(phase + 1);
      }
    });
  };

  useEffect(() => {
    if (phase % 2 == 0) {
      fadeAnim.setValue(0);
      translateYAnim.setValue(-50);
      startFadeInAnimation();
    } else {
      fadeAnim.setValue(0.99);
      translateYAnim.setValue(0);
      startFadeOutAnimation();
    }
  }, [phase]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: translateYAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};

export default FadeTransition;
