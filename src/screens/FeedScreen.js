import { ScrollView, StyleSheet } from 'react-native';

import theme from '../../theme';
import Screen from '../components/Screen';
import MasonryGrid from '../components/MasonryGrid';
import useMockLoad from '../hooks/useMockLoad';
import LOOKS from '../data/mockLooks';
import { useCloset } from '../state/ClosetContext';

export default function FeedScreen({ onSearch, onProfile }) {
  const loading = useMockLoad();
  const { outfits } = useCloset();
  // Freshly posted fits lead the feed.
  const feed = [...outfits, ...LOOKS];

  return (
    <Screen onSearch={onSearch} onProfile={onProfile}>
      {({ onScroll, scrollEventThrottle, paddingTop }) => (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop }]}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
        >
          <MasonryGrid looks={feed} loading={loading} />
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.space[3],
    // Clears the floating nav cluster, which sits over the content.
    paddingBottom: theme.space[16] + theme.space[10],
  },
});
