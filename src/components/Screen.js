import { StyleSheet, View } from 'react-native';

import theme from '../../theme';
import Header from './Header';

/** Shared screen chrome: the app header plus the screen body. */
export default function Screen({ onSearch, onProfile, children }) {
  return (
    <View style={styles.screen}>
      <Header onSearch={onSearch} onProfile={onProfile} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.surface.canvas,
  },
});
