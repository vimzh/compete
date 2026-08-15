import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Jost_300Light, Jost_500Medium } from '@expo-google-fonts/jost';

import theme from './theme';
import FloatingNav from './src/components/FloatingNav';
import FeedScreen from './src/screens/FeedScreen';
import SavedScreen from './src/screens/SavedScreen';
import SearchScreen from './src/screens/SearchScreen';

const SCREENS = {
  feed: FeedScreen,
  saved: SavedScreen,
};

export default function App() {
  const [tab, setTab] = useState('feed');
  // Search covers the whole app rather than living inside a tab, so the nav
  // cluster hides while it's open.
  const [searchOpen, setSearchOpen] = useState(false);
  const [fontsLoaded] = useFonts({ Jost_300Light, Jost_500Medium });

  const ActiveScreen = SCREENS[tab];

  // Hold on the canvas rather than flashing system-font chrome that reflows
  // once the wordmark face lands.
  if (!fontsLoaded) {
    return <View style={styles.root} />;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {searchOpen ? (
          <SearchScreen onClose={() => setSearchOpen(false)} />
        ) : (
          <>
            <ActiveScreen onSearch={() => setSearchOpen(true)} />
            <FloatingNav active={tab} onChange={setTab} />
          </>
        )}
      </View>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.surface.canvas,
  },
});
