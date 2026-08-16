import { useCallback, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../theme';
import Logo from '../components/Logo';
import GoogleButton from '../components/GoogleButton';
import { WEB_CLIENT_ID, usingDevSignIn } from '../api/google';
import { useAuth } from '../state/AuthContext';

// On web Google owns the button, because only a real click on its own element
// yields a credential. Everywhere else we drive the flow from our own control.
const useGoogleButton = Platform.OS === 'web' && Boolean(WEB_CLIENT_ID);

/**
 * The only door into the app. Google is the sole identity provider — there is
 * no password to forget and no email to verify, so this screen is one button
 * plus whatever went wrong last time.
 */
export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, signInWithIdToken, signingIn } = useAuth();
  const [error, setError] = useState('');
  const [width, setWidth] = useState(0);

  const onCredential = useCallback(
    async (credential) => {
      setError('');
      try {
        await signInWithIdToken(credential);
      } catch (e) {
        setError(e.message);
      }
    },
    [signInWithIdToken],
  );

  const onPress = async () => {
    setError('');
    try {
      await signIn();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + theme.space[6], paddingBottom: Math.max(insets.bottom, theme.space[6]) },
      ]}
    >
      <View style={styles.middle}>
        <Logo size={theme.fontSize.hero} />
        <Text style={styles.tagline}>
          Save a piece from any link, see it on you, and put the look up for a vote.
        </Text>
      </View>

      <View style={styles.bottom}>
        {error ? (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}

        {useGoogleButton ? (
          <View
            style={styles.googleHost}
            onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
          >
            {signingIn ? (
              <ActivityIndicator color={theme.text.primary} size="small" />
            ) : (
              width > 0 && (
                <GoogleButton
                  width={width}
                  onCredential={onCredential}
                  onError={(e) => setError(e.message)}
                />
              )
            )}
          </View>
        ) : (
        /* Native: our own control, since we drive the flow there. Solid ink,
           no logo — the palette carries no brand colour, and Google's mark
           can't be recoloured under their terms. */
        <Pressable
          onPress={onPress}
          disabled={signingIn}
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
          accessibilityState={{ disabled: signingIn, busy: signingIn }}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          {signingIn ? (
            <ActivityIndicator color={theme.text.onAccent} size="small" />
          ) : (
            <Text style={styles.ctaLabel}>Continue with Google</Text>
          )}
        </Pressable>
        )}

        <Text style={styles.footnote}>
          {usingDevSignIn
            ? 'Development build — signs you into a local demo account.'
            : 'We only ever read your name, email, and profile picture.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: theme.space[6],
    backgroundColor: theme.surface.canvas,
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space[4],
  },
  tagline: {
    maxWidth: 300,
    fontSize: theme.fontSize.md,
    fontFamily: theme.font.regular,
    lineHeight: theme.fontSize.md * theme.lineHeight.relaxed,
    color: theme.text.secondary,
    textAlign: 'center',
  },
  bottom: {
    gap: theme.space[3],
  },
  googleHost: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.accent.default,
  },
  ctaPressed: {
    backgroundColor: theme.accent.hover,
  },
  ctaLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.font.medium,
    color: theme.text.onAccent,
  },
  error: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.status.brick,
    textAlign: 'center',
  },
  footnote: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.text.muted,
    textAlign: 'center',
  },
});
