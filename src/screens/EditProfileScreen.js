import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../theme';
import Avatar from '../components/Avatar';
import { useAuth } from '../state/AuthContext';

const LIMITS = { name: 40, bio: 160 };

/** Mirrors the server's rule so a bad handle is caught before a round trip. */
const HANDLE_PATTERN = /^[a-z0-9_]{3,20}$/;

function Field({ label, hint, error, children }) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldHead}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export default function EditProfileScreen({ onClose }) {
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [handle, setHandle] = useState(user?.handle || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const trimmedName = name.trim();
  const cleanHandle = handle.trim().replace(/^@/, '').toLowerCase();

  const handleError =
    cleanHandle && !HANDLE_PATTERN.test(cleanHandle)
      ? '3–20 characters: letters, numbers, underscores.'
      : '';

  const dirty = useMemo(
    () => trimmedName !== user?.name || cleanHandle !== user?.handle || bio.trim() !== user?.bio,
    [trimmedName, cleanHandle, bio, user],
  );

  const canSave = dirty && Boolean(trimmedName) && Boolean(cleanHandle) && !handleError && !saving;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setError('');
    try {
      await updateProfile({ name: trimmedName, handle: cleanHandle, bio: bio.trim() });
      onClose();
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <View style={[styles.header, { paddingTop: insets.top + theme.space[3] }]}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          style={styles.iconButton}
        >
          <ArrowLeft size={22} color={theme.text.primary} strokeWidth={1.75} />
        </Pressable>

        <Text style={styles.title}>Edit profile</Text>

        <Pressable
          onPress={save}
          disabled={!canSave}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSave, busy: saving }}
          style={styles.saveButton}
        >
          {saving ? (
            <ActivityIndicator size="small" color={theme.text.primary} />
          ) : (
            // Disabled reads as muted weight, not a different hue.
            <Text style={[styles.saveLabel, !canSave && styles.saveLabelDisabled]}>Save</Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.avatarRow}>
          <Avatar name={trimmedName || user?.name} uri={user?.avatarUrl} size={72} />
          <Text style={styles.avatarNote}>
            Your picture comes from your Google account.
          </Text>
        </View>

        {error ? (
          <Text style={styles.formError} accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}

        <Field label="Name" hint={`${trimmedName.length}/${LIMITS.name}`}>
          <TextInput
            value={name}
            onChangeText={setName}
            maxLength={LIMITS.name}
            placeholder="Your name"
            placeholderTextColor={theme.text.muted}
            style={styles.input}
            autoCapitalize="words"
            accessibilityLabel="Name"
          />
        </Field>

        <Field label="Handle" error={handleError}>
          <View style={[styles.input, styles.handleWrap, handleError && styles.inputError]}>
            <Text style={styles.at}>@</Text>
            <TextInput
              value={handle}
              onChangeText={(value) => setHandle(value.replace(/^@/, '').toLowerCase())}
              maxLength={20}
              placeholder="handle"
              placeholderTextColor={theme.text.muted}
              style={styles.handleInput}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Handle"
            />
          </View>
        </Field>

        <Field label="Bio" hint={`${bio.trim().length}/${LIMITS.bio}`}>
          <TextInput
            value={bio}
            onChangeText={setBio}
            maxLength={LIMITS.bio}
            placeholder="What do you dress for?"
            placeholderTextColor={theme.text.muted}
            style={[styles.input, styles.multiline]}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Bio"
          />
        </Field>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.surface.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space[3],
    paddingBottom: theme.space[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.default,
  },
  iconButton: {
    width: theme.hitSlop,
    height: theme.hitSlop,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.font.semibold,
    color: theme.text.primary,
  },
  saveButton: {
    minWidth: theme.hitSlop,
    height: theme.hitSlop,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: theme.space[3],
  },
  saveLabel: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.semibold,
    color: theme.text.primary,
  },
  saveLabelDisabled: {
    fontFamily: theme.font.regular,
    color: theme.text.muted,
  },
  body: {
    paddingHorizontal: theme.space[4],
    paddingTop: theme.space[5],
    paddingBottom: theme.space[16],
    gap: theme.space[5],
  },
  avatarRow: {
    alignItems: 'center',
    gap: theme.space[2],
  },
  avatarNote: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.text.muted,
  },
  field: {
    gap: theme.space[2],
  },
  fieldHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.medium,
    color: theme.text.secondary,
  },
  hint: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.font.regular,
    color: theme.text.muted,
    fontVariant: ['tabular-nums'],
  },
  input: {
    minHeight: theme.hitSlop,
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.strong,
    backgroundColor: theme.surface.raised,
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.regular,
    color: theme.text.primary,
    outlineStyle: 'none',
  },
  inputError: {
    borderColor: theme.status.brick,
  },
  multiline: {
    minHeight: 96,
    lineHeight: theme.fontSize.base * theme.lineHeight.normal,
  },
  handleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space[1],
    paddingVertical: 0,
  },
  at: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.regular,
    color: theme.text.muted,
  },
  handleInput: {
    flex: 1,
    height: theme.hitSlop,
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.regular,
    color: theme.text.primary,
    outlineStyle: 'none',
  },
  error: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.status.brick,
  },
  formError: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.regular,
    color: theme.status.brick,
    textAlign: 'center',
  },
});
