import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import theme from '../../theme';
import { WEB_CLIENT_ID, loadGis } from '../api/google';

/**
 * Google's own sign-in button, rendered by GIS into a real DOM node.
 *
 * It has to be Google's button rather than ours: GIS only hands back a
 * credential from a genuine user click on its own element. Driving it from our
 * own Pressable means loading the script first, which is async, which ends the
 * user-activation window — Chrome then blocks the popup and GIS reports nothing
 * back, leaving the caller spinning forever.
 *
 * Web only. Native renders nothing; see src/api/google.js for that path.
 */
export default function GoogleButton({ onCredential, onError, width }) {
  const host = useRef(null);
  const [failed, setFailed] = useState('');

  useEffect(() => {
    if (Platform.OS !== 'web' || !WEB_CLIENT_ID) return undefined;

    let cancelled = false;

    loadGis()
      .then((id) => {
        if (cancelled || !host.current) return;

        id.initialize({
          client_id: WEB_CLIENT_ID,
          ux_mode: 'popup',
          auto_select: false,
          callback: ({ credential }) => {
            if (credential) onCredential(credential);
            else onError?.(new Error('Google did not return a credential.'));
          },
        });

        // GIS needs a pixel width; it rejects percentages.
        id.renderButton(host.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          logo_alignment: 'center',
          width: Math.round(width || 320),
        });
      })
      .catch((error) => {
        if (cancelled) return;
        setFailed(error.message);
        onError?.(error);
      });

    return () => {
      cancelled = true;
    };
  }, [onCredential, onError, width]);

  if (Platform.OS !== 'web' || !WEB_CLIENT_ID) return null;

  if (failed) {
    return <Text style={styles.failed}>{failed}</Text>;
  }

  return <View ref={host} style={styles.host} collapsable={false} />;
}

const styles = StyleSheet.create({
  host: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  failed: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.status.brick,
    textAlign: 'center',
  },
});
