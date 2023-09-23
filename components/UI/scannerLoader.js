import { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet } from "react-native";
import {
  Skia,
  Canvas,
  Path,
  Image,
  vec,
  useComputedValue,
  useClockValue,
  useValue,
  LinearGradient,
  Mask,
  Group,
} from "@shopify/react-native-skia";

import { line, curveBasis } from "d3";

const dimens = Dimensions.get("screen");
const width = 400;
const frequency = 3;
const initialAmplitude = 20;

const screenHeight = dimens.height;
const desiredHeight = Math.max(screenHeight * 0.7, 480); // At least 70% of the screen height
const verticalShiftConst = 0;

const imageAspectRatio = 1020 / 1020; // Replace with your image's aspect ratio (width / height)
const desiredWidth = desiredHeight * imageAspectRatio;

const horizontalShift = (desiredWidth - width) / 2;

export const WaveMeter = ({ externalPhase, image }) => {
  const verticalShift = useValue(verticalShiftConst);
  const amplitude = useValue(initialAmplitude);
  const clock = useClockValue();
  const maxHeight = desiredHeight; // Your max height

  // New state to hold the current phase of the animation
  const [currentPhase, setCurrentPhase] = useState("bottom");

  // State to hold the verticalShift value
  const [localVerticalShift, setLocalVerticalShift] =
    useState(verticalShiftConst);

  useEffect(() => {
    let targetHeight = 0;
    let intervalTime = 25; // 20 milliseconds
    let speedFactor = 1.5; // Default speed factor

    if (externalPhase === "bottom") {
      targetHeight = maxHeight * 0.4;
    } else if (externalPhase === "middle") {
      targetHeight = maxHeight * 0.8;
    } else if (externalPhase === "top") {
      targetHeight = maxHeight;
    }

    const interval = setInterval(() => {
      const remaining = targetHeight - verticalShift.current;
      const traveled = verticalShift.current - verticalShiftConst;
      const total = targetHeight - verticalShiftConst;

      // Calculate delta using a logarithmic curve
      const delta = Math.max(
        1,
        ((Math.log(remaining + 1) + Math.log(traveled + 1)) /
          (Math.log(total + 1) * 2)) *
          speedFactor
      );

      verticalShift.current += delta;

      if (verticalShift.current >= targetHeight) {
        clearInterval(interval);
        // Do something when the target height is reached
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [externalPhase]);

  const createWavePath = (phase = 20) => {
    const startX = horizontalShift; // Start the wave at 300px from the left

    let points = Array.from(
      { length: desiredWidth + horizontalShift - startX },
      (_, index) => {
        const adjustedIndex = index + startX; // Adjust the index so the wave starts at 300px
        const angle =
          ((adjustedIndex - horizontalShift) / desiredWidth) *
            (Math.PI * frequency) +
          phase;

        return [
          adjustedIndex,
          desiredHeight -
            (amplitude.current * Math.sin(angle) + verticalShift.current),
        ];
      }
    );

    const lineGenerator = line().curve(curveBasis);
    const waveLine = lineGenerator(points);
    const bottomLine = `L${
      desiredWidth + horizontalShift
    },${desiredHeight} L${horizontalShift},${desiredHeight}`;
    const extendedWavePath = `${waveLine} ${bottomLine} Z`;
    return extendedWavePath;
  };

  const animatedPath = useComputedValue(() => {
    const current = (clock.current / 2400) % 2400;
    const start = Skia.Path.MakeFromSVGString(createWavePath(current));
    const end = Skia.Path.MakeFromSVGString(createWavePath(Math.PI * current));
    return start.interpolate(end, 0.5);
  }, [clock, verticalShift]);

  const gradientStart = useComputedValue(() => {
    return vec(0, verticalShift.current);
  }, [verticalShift]);

  const gradientEnd = useComputedValue(() => {
    return vec(0, verticalShift.current + 150);
  }, [verticalShift]);

  return (
    <SafeAreaView style={styles.container}>
      <Canvas style={styles.canvas}>
        <Mask
          mask={
            <Group>
              <Image
                image={image}
                fit="contain"
                x={0}
                y={75}
                width={desiredWidth}
                height={desiredHeight}
                opacity={1} // Make sure the image is fully opaque to act as a mask
              />
            </Group>
          }
        >
          <Path path={animatedPath} style="fill">
            <LinearGradient
              start={gradientStart}
              end={gradientEnd}
              colors={["crimson", "darkslateblue"]}
            />
          </Path>
        </Mask>
      </Canvas>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    width: desiredWidth,
    height: desiredHeight,
    marginBottom: 100,
  },
});

export default WaveMeter;
