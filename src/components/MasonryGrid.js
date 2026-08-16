import { StyleSheet, View } from 'react-native';

import theme from '../../theme';
import LookCard from './LookCard';
import OutfitCard from './OutfitCard';
import Skeleton from './Skeleton';

const COLUMNS = 2;

/**
 * Two-column masonry. Items go to whichever column is currently shortest,
 * using the ratio as a proxy for rendered height — that keeps the columns
 * from drifting apart the way naive alternating placement does.
 */
function distribute(items) {
  const columns = Array.from({ length: COLUMNS }, () => []);
  const heights = new Array(COLUMNS).fill(0);

  items.forEach((item) => {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push(item);
    heights[shortest] += 1 / item.ratio;
  });

  return columns;
}

// Fixed ratios so the loading state has the same rhythm as the real grid.
const PLACEHOLDERS = [
  { id: 's1', ratio: 0.72 },
  { id: 's2', ratio: 1.0 },
  { id: 's3', ratio: 0.66 },
  { id: 's4', ratio: 0.8 },
  { id: 's5', ratio: 1.2 },
  { id: 's6', ratio: 0.7 },
];

export default function MasonryGrid({ looks, loading = false }) {
  const items = loading ? PLACEHOLDERS : looks;
  const columns = distribute(items);

  return (
    <View style={styles.grid}>
      {columns.map((column, index) => (
        <View key={index} style={styles.column}>
          {column.map((item) =>
            loading ? (
              <Skeleton
                key={item.id}
                radius={theme.radius.lg}
                style={{ width: '100%', aspectRatio: item.ratio }}
              />
            ) : item.type === 'outfit' ? (
              <OutfitCard key={item.id} outfit={item} />
            ) : (
              <LookCard key={item.id} look={item} />
            ),
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: theme.space[1],
  },
  column: {
    flex: 1,
    gap: theme.space[1],
  },
});
