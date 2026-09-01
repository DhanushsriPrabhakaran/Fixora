import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RatingStarsProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showNumeric?: boolean;
  reviewsCount?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 14,
  interactive = false,
  onRatingChange,
  showNumeric = true,
  reviewsCount,
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {stars.map((star) => {
          const filled = rating >= star;
          const half = rating >= star - 0.5 && rating < star;

          if (interactive) {
            return (
              <TouchableOpacity
                key={star}
                onPress={() => onRatingChange && onRatingChange(star)}
                activeOpacity={0.7}
                style={styles.starTouch}
              >
                <Text style={[styles.starText, { fontSize: size + 4, color: filled ? '#F59E0B' : '#D1D5DB' }]}>
                  ★
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <Text
              key={star}
              style={[
                styles.starText,
                { fontSize: size, color: filled ? '#F59E0B' : half ? '#FBBF24' : '#E5E7EB' },
              ]}
            >
              {filled ? '★' : half ? '★' : '☆'}
            </Text>
          );
        })}
      </View>

      {showNumeric && (
        <Text style={[styles.ratingVal, { fontSize: size - 1 }]}>
          {rating.toFixed(1)} {reviewsCount !== undefined && `(${reviewsCount})`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  starTouch: {
    paddingHorizontal: 2,
  },
  starText: {
    fontWeight: 'bold',
  },
  ratingVal: {
    fontWeight: '600',
    color: '#374151',
    marginLeft: 2,
  },
});
