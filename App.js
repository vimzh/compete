import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShareIntentProvider, useShareIntentContext } from 'expo-share-intent';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';

import theme from './theme';
import FloatingNav from './src/components/FloatingNav';
import FeedScreen from './src/screens/FeedScreen';
import SavedScreen from './src/screens/SavedScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import CanvasScreen from './src/screens/CanvasScreen';
import SignInScreen from './src/screens/SignInScreen';
import AddLinkSheet from './src/components/AddLinkSheet';
import BoardSetupSheet from './src/components/BoardSetupSheet';
import { AuthProvider, useAuth } from './src/state/AuthContext';
import { ClosetProvider } from './src/state/ClosetContext';
import useOnboarded from './src/hooks/useOnboarded';

const SCREENS = {
  feed: FeedScreen,
  saved: SavedScreen,
};

/**
 * A link shared in from Myntra, Flipkart, Instagram — anywhere with a share
 * sheet. The extension hands over `webUrl` for a URL share and `text` for a
 * plain-text one; retailers send either, and the server's normaliser digs the
 * link out of surrounding share copy, so pass whichever arrived straight
 * through.
 */
function useSharedLink() {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();
  const [pending, setPending] = useState(null);

  useEffect(() => {
    if (!hasShareIntent) return;
    const link = shareIntent?.webUrl || shareIntent?.text;
    if (link) setPending(link);
    // Clearing it now stops the same share replaying on the next foreground.
    resetShareIntent();
  }, [hasShareIntent, shareIntent, resetShareIntent]);

  return [pending, () => setPending(null)];
}

function Shell() {
  const [tab, setTab] = useState('feed');
  const [sharedLink, clearSharedLink] = useSharedLink();
  // Search and profile cover the whole app rather than living inside a tab,
  // so the nav cluster hides while either is open.
  const [overlay, setOverlay] = useState(null);
  const [adding, setAdding] = useState(false);
  // Board setup -> canvas. `board` being set is what puts the canvas on screen.
  const [settingUpBoard, setSettingUpBoard] = useState(false);
  const [board, setBoard] = useState(null);

  const ActiveScreen = SCREENS[tab];
  const closeOverlay = () => setOverlay(null);

  // An incoming share opens the sheet on its own — the user already chose to
  // add this piece, so it extracts without a second confirmation.
  const addOpen = adding || Boolean(sharedLink);
  const closeAdd = () => {
    setAdding(false);
    clearSharedLink();
  };

  if (board) {
    return (
      <View style={styles.root}>
        <CanvasScreen
          board={board}
          onClose={() => setBoard(null)}
          onAddLink={() => setAdding(true)}
          onPosted={() => {
            setBoard(null);
            setTab('feed');
          }}
        />
        <AddLinkSheet
          visible={addOpen}
          onClose={closeAdd}
          initialUrl={sharedLink || ''}
          autoSubmit={Boolean(sharedLink)}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {overlay === 'search' && <SearchScreen onClose={closeOverlay} />}
      {overlay === 'profile' && <ProfileScreen onClose={closeOverlay} />}

      {overlay === null && (
        <>
          <ActiveScreen
            onSearch={() => setOverlay('search')}
            onProfile={() => setOverlay('profile')}
          />
          <FloatingNav active={tab} onChange={setTab} onAdd={() => setSettingUpBoard(true)} />
        </>
      )}

      <BoardSetupSheet
        visible={settingUpBoard}
        onClose={() => setSettingUpBoard(false)}
        onCreate={(created) => {
          setSettingUpBoard(false);
          setBoard(created);
        }}
      />

      <AddLinkSheet
        visible={addOpen}
        onClose={closeAdd}
        initialUrl={sharedLink || ''}
        autoSubmit={Boolean(sharedLink)}
      />
    </View>
  );
}

/**
 * Launch gate: onboarding, then Google sign-in, then the app itself.
 * Everything below this point can assume there is a signed-in user.
 */
function Root() {
  const { status } = useAuth();
  const [onboarded, completeOnboarding] = useOnboarded();

  // Reading the stored session and the onboarding flag each take a frame or
  // two — a spinner would only flash, and rendering early would show
  // onboarding to someone who has already seen it.
  if (status === 'loading' || onboarded === null) return <View style={styles.root} />;

  // Someone already signed in has plainly seen the welcome pages, even if the
  // flag was lost — send them straight to the feed.
  if (!onboarded && status !== 'signedIn') {
    return <OnboardingScreen onDone={completeOnboarding} />;
  }

  if (status === 'signedOut') return <SignInScreen />;

  return (
    <ClosetProvider>
      <Shell />
    </ClosetProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Transcity: require('./assets/fonts/TranscityDemo.otf'),
  });

  // Hold on the canvas rather than flashing system-font chrome that reflows
  // once the wordmark face lands.
  if (!fontsLoaded) {
    return <View style={styles.root} />;
  }

  return (
    // Outermost, so a share that cold-starts the app is already captured by the
    // time the sign-in gate has resolved and Shell mounts.
    <ShareIntentProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <Root />
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </AuthProvider>
    </ShareIntentProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.surface.canvas,
  },
});
