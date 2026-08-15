import { StyleSheet, Text, View } from 'react-native';

import theme from '../../theme';
import Screen from '../components/Screen';

export default function SavedScreen({ onSearch, onProfile }) {
  return (
    <Screen onSearch={onSearch} onProfile={onProfile}>
      <View style={styles.empty}>
        <Text style={styles.headline}>Nothing saved</Text>
        <Text style={styles.body}>
          Looks you save will collect here, ready to pair.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space[8],
    gap: theme.space[2],
  },
  headline: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.text.primary,
  },
  body: {
    fontSize: theme.fontSize.base,
    lineHeight: theme.fontSize.base * theme.lineHeight.normal,
    color: theme.text.secondary,
    textAlign: 'center',
  },
});
