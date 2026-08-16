import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import theme from '../../theme';
import itemImage from '../data/itemImage';
import CutoutImage from './CutoutImage';
import { ingestLink } from '../api/ingest';
import { useCloset } from '../state/ClosetContext';

export default function AddLinkSheet({ visible, onClose, initialUrl = '', autoSubmit = false }) {
  const { addItem, collections, createCollection, addItemToCollection } = useCloset();
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error | done
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [savedTo, setSavedTo] = useState(null);

  const reset = () => {
    setUrl('');
    setStatus('idle');
    setError('');
    setResult(null);
    setSavedTo(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async (value = url) => {
    const trimmed = String(value).trim();
    if (!trimmed) {
      setError('Paste a product link first.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError('');
    try {
      const item = await ingestLink(trimmed);
      addItem(item);
      setResult(item);
      setStatus('done');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  };

  /**
   * A link arriving from the share sheet should not make the user tap
   * "Extract" on something they already chose to share — fill the field and go.
   */
  useEffect(() => {
    if (!visible || !initialUrl) return;
    setUrl(initialUrl);
    if (autoSubmit) submit(initialUrl);
    // Re-running on every `url` keystroke would restart the ingest mid-typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initialUrl, autoSubmit]);

  const saveToCollection = (collection) => {
    addItemToCollection(collection.id, result.id);
    setSavedTo(collection.name);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      {/* Flat scrim, not a gradient — see CLAUDE.md. */}
      <Pressable style={styles.scrim} onPress={close} accessibilityLabel="Dismiss">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.centre}
        >
          <Pressable style={styles.sheet} onPress={() => {}}>
            {status === 'done' ? (
              <>
                <Text style={styles.title}>Added to your closet</Text>
                <View style={styles.preview}>
                  <CutoutImage source={itemImage(result)} style={styles.previewImage} />
                </View>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {result.title}
                </Text>
                {result.brand ? <Text style={styles.itemMeta}>{result.brand}</Text> : null}

                {/*
                  The closet is the default home for a new piece; a collection
                  is optional. Shown as chips rather than a picker so saving
                  into one is a single tap on the sheet you are already on.
                */}
                {savedTo ? (
                  <Text style={styles.savedTo}>Saved to {savedTo}</Text>
                ) : collections.length === 0 ? (
                  <Pressable
                    onPress={() => {
                      const collection = createCollection('Saved pieces', {
                        itemIds: [result.id],
                      });
                      setSavedTo(collection.name);
                    }}
                    accessibilityRole="button"
                    style={styles.chip}
                  >
                    <Text style={styles.chipLabel}>+ Start a collection</Text>
                  </Pressable>
                ) : (
                  <View style={styles.collections}>
                    <Text style={styles.collectionsLabel}>Add to a collection</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.chips}
                    >
                      {collections.map((collection) => (
                        <Pressable
                          key={collection.id}
                          onPress={() => saveToCollection(collection)}
                          accessibilityRole="button"
                          style={styles.chip}
                        >
                          <Text style={styles.chipLabel} numberOfLines={1}>
                            {collection.name}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View style={styles.actions}>
                  <Pressable onPress={reset} accessibilityRole="button" style={styles.secondary}>
                    <Text style={styles.secondaryLabel}>Add another</Text>
                  </Pressable>
                  <Pressable onPress={close} accessibilityRole="button" style={styles.primary}>
                    <Text style={styles.primaryLabel}>Done</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.title}>Add a piece</Text>
                <Text style={styles.copy}>
                  Paste a link from Myntra, Zara, Instagram — anywhere. We pull the garment out
                  and cut the background away.
                </Text>

                <TextInput
                  value={url}
                  onChangeText={(value) => {
                    setUrl(value);
                    if (error) {
                      setError('');
                      setStatus('idle');
                    }
                  }}
                  placeholder="https://www.myntra.com/..."
                  placeholderTextColor={theme.text.muted}
                  style={[styles.input, status === 'error' && styles.inputError]}
                  autoFocus
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  returnKeyType="go"
                  onSubmitEditing={() => submit()}
                  editable={status !== 'loading'}
                  accessibilityLabel="Product link"
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={styles.actions}>
                  <Pressable
                    onPress={close}
                    accessibilityRole="button"
                    style={styles.secondary}
                    disabled={status === 'loading'}
                  >
                    <Text style={styles.secondaryLabel}>Cancel</Text>
                  </Pressable>
                  {/* Wrapped, not passed directly: a handler would receive the
                      press event as `value` and ingest "[object Object]". */}
                  <Pressable onPress={() => submit()} accessibilityRole="button" style={styles.primary}>
                    {status === 'loading' ? (
                      <ActivityIndicator color={theme.text.onAccent} size="small" />
                    ) : (
                      <Text style={styles.primaryLabel}>Extract</Text>
                    )}
                  </Pressable>
                </View>

                {status === 'loading' ? (
                  <Text style={styles.hint}>Cutting out the garment — this takes a few seconds.</Text>
                ) : null}
              </>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(30, 29, 27, 0.35)',
  },
  centre: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.space[5],
  },
  sheet: {
    borderRadius: theme.radius.xl,
    backgroundColor: theme.surface.overlay,
    padding: theme.space[5],
    gap: theme.space[3],
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.font.semibold,
    color: theme.text.primary,
  },
  copy: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.regular,
    lineHeight: theme.fontSize.base * theme.lineHeight.normal,
    color: theme.text.secondary,
  },
  input: {
    height: theme.hitSlop,
    paddingHorizontal: theme.space[3],
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.strong,
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.regular,
    color: theme.text.primary,
    outlineStyle: 'none',
  },
  inputError: {
    borderColor: theme.status.brick,
  },
  collections: {
    gap: theme.space[2],
  },
  collectionsLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.medium,
    color: theme.text.secondary,
  },
  chips: {
    flexDirection: 'row',
    gap: theme.space[2],
    paddingRight: theme.space[2],
  },
  chip: {
    alignSelf: 'flex-start',
    maxWidth: 180,
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
    borderRadius: theme.radius.full,
    // Hairline border, no shadow — separation without elevation.
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.strong,
  },
  chipLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  savedTo: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.medium,
    color: theme.text.secondary,
  },
  error: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.status.brick,
  },
  hint: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.text.muted,
    textAlign: 'center',
  },
  // Cutouts are transparent PNGs, so they need a white well to read against.
  preview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.surface.photo,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.default,
    padding: theme.space[3],
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  itemTitle: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  itemMeta: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.text.muted,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.space[2],
    marginTop: theme.space[1],
  },
  secondary: {
    flex: 1,
    height: theme.hitSlop,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.strong,
  },
  secondaryLabel: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  primary: {
    flex: 1,
    height: theme.hitSlop,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.accent.default,
  },
  primaryLabel: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.medium,
    color: theme.text.onAccent,
  },
});
