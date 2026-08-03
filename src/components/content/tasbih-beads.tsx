import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, useWindowDimensions } from 'react-native';

/**
 * Üstte asılı duran tesbih dizisi animasyonu. Her sayımda dizi bir tane
 * genişliği kadar kayar ve sonra sessizce başa döner (taneler birbirinin
 * aynı olduğu için kesintisiz akıyormuş gibi görünür); merkez tane çekilme
 * anında hafifçe büyür.
 */
export function TasbihBeads({
  color,
  pullSignal,
  height = 96,
  large = false,
}: {
  color: string;
  /** Her artışta değişen değer (sayaç) — değişince çekme animasyonu oynar */
  pullSignal: number;
  height?: number;
  large?: boolean;
}) {
  const { width } = useWindowDimensions();
  const [shift] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(0));
  const firstRender = useRef(true);

  const beadSize = large ? 34 : 26;
  const spacing = beadSize + (large ? 14 : 10);
  const containerWidth = Math.min(width, 560);
  // Kayma payı için görünenden birkaç tane fazla çiz
  const beadCount = Math.ceil(containerWidth / spacing) + 3;
  const sag = large ? 26 : 18; // ortadaki sarkma miktarı

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    shift.setValue(0);
    pulse.setValue(0);
    Animated.parallel([
      Animated.timing(shift, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 110, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 160, useNativeDriver: true }),
      ]),
    ]).start(() => shift.setValue(0));
  }, [pullSignal, shift, pulse]);

  const translateX = shift.interpolate({ inputRange: [0, 1], outputRange: [0, spacing] });
  const centerIndex = Math.floor(beadCount / 2);

  return (
    <View style={{ height, overflow: 'hidden', justifyContent: 'center' }}>
      {/* İp */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: height / 2 - 1 + sag / 2,
          height: 2,
          backgroundColor: color,
          opacity: 0.35,
        }}
      />
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: -spacing * 1.5,
          transform: [{ translateX }],
        }}
      >
        {Array.from({ length: beadCount }, (_, i) => {
          // Asılı dizi görünümü: kenarlar yukarıda, orta hafif aşağıda
          const t = i / (beadCount - 1);
          const y = Math.sin(Math.PI * t) * sag;
          const isCenter = i === centerIndex;
          const scale = isCenter
            ? pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] })
            : 1;
          return (
            <Animated.View
              key={i}
              style={{
                width: beadSize,
                height: beadSize,
                borderRadius: beadSize / 2,
                marginRight: spacing - beadSize,
                backgroundColor: color,
                transform: [{ translateY: y }, { scale }],
                // Tane hissi için hafif iç parlama
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.25)',
              }}
            />
          );
        })}
      </Animated.View>
    </View>
  );
}
