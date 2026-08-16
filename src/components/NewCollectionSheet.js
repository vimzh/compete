import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import theme from '../../theme';

export default function NewCollectionSheet({ visible, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const trimmed = name.trim();

  const close = () => {
    setName('');
    setError('');
    onClose();
  };

  const submit = () => {
    if (!trimmed) {
      setError('Give the collection a name first.');
      return;
    }
    onCreate(trimmed);
    close();
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
            <Text style={styles.title}>New collection</Text>

            <TextInput
              value={name}
              onChangeText={(value) => {
                setName(value);
                if (error) setError('');
              }}
              placeholder="Summer linen"
              placeholderTextColor={theme.text.muted}
              style={[styles.input, error && styles.inputError]}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={submit}
              accessibilityLabel="Collection name"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.actions}>
              <Pressable onPress={close} accessibilityRole="button" style={styles.secondary}>
                <Text style={styles.secondaryLabel}>Cancel</Text>
              </Pressable>
              <Pressable onPress={submit} accessibilityRole="button" style={styles.primary}>
                <Text style={styles.primaryLabel}>Create</Text>
              </Pressable>
            </View>
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
  error: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.status.brick,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.space[2],
    marginTop: theme.space[1],
  },
  // Secondary: hairline, no fill. Primary: solid ink. No accent colour exists.
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
