import { useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Heart, Link2, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../theme';
import Logo from '../components/Logo';

/**
 * `image` is left null on purpose — each page renders an empty 3:4 well until
 * a real asset is dropped in. To fill one, set:
 *   image: require('../../assets/onboarding/save.png')
 * and the placeholder swaps out with no other changes.
 */
const PAGES = [
  {
    key: 'save',
    Icon: Link2,
    image: null,
    title: 'Save from anywhere',
    body: 'See a piece on Instagram, TikTok, or any shop. Share the link to fitterest and we pull the garment out for you.',
  },
  {
    key: 'try',
    Icon: Sparkles,
    image: null,
    title: 'See it on you',
    body: 'Every piece you save gets rendered onto your own photo, so your closet is you wearing things — not product shots.',
  },
  {
    key: 'post',
    Icon: Heart,
    image: null,
    title: 'Post it, let them vote',
    body: 'Pair pieces into a look and share it. The most-liked look each day becomes Outfit of the Day.',
  },
];

export default function OnboardingScreen({ onDone }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scroller = useRef(null);
  const [index, setIndex] = useState(0);

  const last = index === PAGES.length - 1;

  const goNext = () => {
    if (last) {
      onDone();
      return;
    }
    scroller.current?.scrollTo({ x: width * (index + 1), animated: true });
  };

  const onScroll = (event) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + theme.space[4] }]}>
      <View style={styles.top}>
        <Logo size={theme.fontSize.lg} />
        <Pressable
          onPress={onDone}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          hitSlop={theme.space[2]}
        >
          <Text style={styles.skip}>{last ? '' : 'Skip'}</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        {PAGES.map(({ key, Icon, image, title, body }) => (
          <View key={key} style={[styles.page, { width }]}>
            <View style={styles.well}>
              {image ? (
                <Image source={image} style={styles.image} resizeMode="cover" />
              ) : (
                <Icon size={26} color={theme.text.muted} strokeWidth={1.5} />
              )}
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, theme.space[4]) }]}>
        <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no">
          {PAGES.map((page, i) => (
            <View key={page.key} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        {/* Primary action: solid ink. The palette has no accent colour. */}
        <Pressable onPress={goNext} accessibilityRole="button" style={styles.cta}>
          <Text style={styles.ctaLabel}>{last ? 'Get started' : 'Next'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.surface.canvas,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space[4],
    height: theme.hitSlop,
  },
  skip: {
    fontSize: theme.fontSize.base,
    color: theme.text.secondary,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Images run near full-bleed; the copy keeps its own gutter below.
    paddingHorizontal: theme.space[2],
    gap: theme.space[4],
  },
  // Scaffolding for artwork that isn't made yet. Hairline, no fill — the
  // empty state should read as reserved space, not as a broken image.
  well: {
    width: '100%',
    aspectRatio: 3 / 4,
    maxHeight: 380,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.default,
    backgroundColor: theme.surface.photo,
    marginBottom: theme.space[2],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    paddingHorizontal: theme.space[6],
    fontSize: theme.fontSize.xl,
    fontFamily: theme.font.semibold,
    color: theme.text.primary,
    textAlign: 'center',
  },
  body: {
    paddingHorizontal: theme.space[6],
    fontSize: theme.fontSize.md,
    lineHeight: theme.fontSize.md * theme.lineHeight.relaxed,
    color: theme.text.secondary,
    textAlign: 'center',
  },
  bottom: {
    paddingHorizontal: theme.space[4],
    gap: theme.space[5],
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.space[2],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.border.strong,
  },
  dotActive: {
    backgroundColor: theme.text.primary,
    width: 18,
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
