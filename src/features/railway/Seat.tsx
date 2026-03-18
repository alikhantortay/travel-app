import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Seat as SeatType } from '../../api/mockRailwayData';

interface Props {
  seat: SeatType;
  isSelected: boolean;
  onPress: (seat: SeatType) => void;
}

const COLORS: Record<string, string> = {
  lower: '#4A90D9',
  upper: '#7B68EE',
  side: '#48C774',
};

const SeatItem = memo(({ seat, isSelected, onPress }: Props) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (seat.status === 'taken') return;
    scale.value = withSpring(0.88, {}, () => {
      scale.value = withSpring(1);
    });
    onPress(seat);
  };

  const bgColor = seat.status === 'taken'
    ? '#ccc'
    : isSelected
    ? '#FF6B35'
    : COLORS[seat.type];

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.seat, { backgroundColor: bgColor }]}
        onPress={handlePress}
        disabled={seat.status === 'taken'}
        activeOpacity={0.8}
      >
        <Text style={styles.number}>{seat.number}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

SeatItem.displayName = 'SeatItem';
export default SeatItem;

const styles = StyleSheet.create({
  seat: {
    width: 44,
    height: 44,
    borderRadius: 8,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  number: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
