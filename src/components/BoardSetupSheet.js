import { useState } from 'react';
import {
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
import { Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../theme';
import SLOTS, { DEFAULT_SLOTS } from '../data/slots';

/** Bottom sheet: name the board and pick which slots it needs. */
export default function BoardSetupSheet({ visible, onClose, onCreate }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState(DEFAULT_SLOTS);
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setSelected(DEFAULT_SLOTS);
    setError('');
  };

  const close = () => {
    reset();
    onClose();
  };

  const toggle = (key) => {
    setError('');
    setSelected((current) =>
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key],
    );
  };

  const submit = () => {
    if (selected.length === 0) {
      setError('Pick at least one piece to build with.');
      return;
    }
    // Keep the canonical head-to-foot order rather than tap order.
    const ordered = SLOTS.filter((slot) => selected.includes(slot.key));
    onCreate({ name: name.trim() || 'New fit', slots: ordered });
    reset();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.root}>
        {/* Flat scrim, not a gradient — see CLAUDE.md. */}
        <Pressable style={styles.scrim} onPress={close} accessibilityLabel="Dismiss" />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, theme.space[4]) }]}>
            <View style={styles.grabber} />

            <Text style={styles.title}>What are you building?</Text>
            <Text style={styles.copy}>
              Pick the pieces this fit needs. Each one becomes a slot on your canvas.
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name the board (optional)"
              placeholderTextColor={theme.text.muted}
              style={styles.input}
              returnKeyType="done"
              accessibilityLabel="Board name"
            />

            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {SLOTS.map((slot) => {
                const active = selected.includes(slot.key);
                return (
                  <Pressable
                    key={slot.key}
                    onPress={() => toggle(slot.key)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: active }}
                    aria-checked={active}
                    accessibilityLabel={slot.label}
                    style={styles.row}
                  >
                    {/* No accent colour — checked state is an ink fill. */}
                    <View style={[styles.box, active && styles.boxActive]}>
                      {active && <Check size={14} color={theme.text.onAccent} strokeWidth={2.5} />}
                    </View>
                    <Text style={[styles.rowLabel, active && styles.rowLabelActive]}>
                      {slot.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable onPress={submit} accessibilityRole="button" style={styles.cta}>
              <Text style={styles.ctaLabel}>
                Create canvas{selected.length ? ` · ${selected.length}` : ''}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 29, 27, 0.35)',
  },
  sheet: {
    backgroundColor: theme.surface.overlay,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingHorizontal: theme.space[5],
    paddingTop: theme.space[3],
    gap: theme.space[3],
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.border.strong,
    marginBottom: theme.space[2],
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
  list: {
    maxHeight: 260,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space[3],
    height: theme.hitSlop,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: theme.radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.strong,
  },
  boxActive: {
    backgroundColor: theme.accent.default,
    borderColor: theme.accent.default,
  },
  rowLabel: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.regular,
    color: theme.text.secondary,
  },
  rowLabelActive: {
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  error: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.status.brick,
  },
  cta: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.accent.default,
  },
  ctaLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.font.medium,
    color: theme.text.onAccent,
  },
});
