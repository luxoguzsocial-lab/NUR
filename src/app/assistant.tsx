import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { Chip, DemoBadge } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { findAnswer, SUGGESTED_QUESTIONS } from '@/data/ai-demo';
import { shareText } from '@/lib/share';
import { useTheme } from '@/hooks/use-theme';
import { useAiStore, type AiMessage } from '@/store/media';
import { useSavedStore } from '@/store/saved';
import { useSettingsStore } from '@/store/settings';

let msgCounter = 0;
const nextId = () => `m-${new Date().getTime()}-${msgCounter++}`;

function buildAssistantMessage(query: string, t: (k: string) => string): AiMessage {
  const match = findAnswer(query);
  if (!match) {
    return {
      id: nextId(),
      role: 'assistant',
      text: t('assistant.noAnswerBody'),
      shortAnswer: t('assistant.noAnswerTitle'),
      sources: [],
      confidence: 'low',
      referToScholar: true,
      demo: true,
      createdAt: new Date().toISOString(),
    };
  }
  return {
    id: nextId(),
    role: 'assistant',
    text: match.detailedAnswer,
    shortAnswer: match.shortAnswer,
    sources: match.sources,
    confidence: match.confidence,
    differences: match.differences,
    referToScholar: match.referToScholar,
    relatedTopics: match.relatedTopics,
    demo: true,
    createdAt: new Date().toISOString(),
  };
}

function AssistantBubble({ msg }: { msg: AiMessage }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [showDetails, setShowDetails] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const saved = useSavedStore();
  const setFeedback = useAiStore((s) => s.setFeedback);
  const isSaved = saved.isSaved('aiAnswer', msg.id);

  const confidenceLabel =
    msg.confidence === 'high'
      ? t('assistant.confidenceHigh')
      : msg.confidence === 'medium'
        ? t('assistant.confidenceMedium')
        : t('assistant.confidenceLow');

  return (
    <Card style={{ marginBottom: Spacing.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <DemoBadge />
        {msg.confidence ? (
          <ThemedText variant="caption">
            {t('assistant.confidence')}: {confidenceLabel}
          </ThemedText>
        ) : null}
      </View>

      {msg.shortAnswer ? (
        <ThemedText variant="heading" style={{ marginTop: Spacing.sm }}>
          {msg.shortAnswer}
        </ThemedText>
      ) : null}

      {msg.text && msg.text !== msg.shortAnswer ? (
        showDetails ? (
          <ThemedText variant="secondary" style={{ marginTop: Spacing.sm }}>
            {msg.text}
          </ThemedText>
        ) : (
          <Pressable onPress={() => setShowDetails(true)}>
            <ThemedText variant="secondary" color={theme.primary} style={{ marginTop: Spacing.sm }}>
              {t('assistant.showDetails')} ▾
            </ThemedText>
          </Pressable>
        )
      ) : null}

      {/* Kaynaklar — kaynak metni AI yorumundan görsel olarak ayrık */}
      {msg.sources && msg.sources.length > 0 ? (
        <View style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
          <ThemedText variant="label">{t('assistant.sourcesTitle')}</ThemedText>
          {msg.sources.map((src, i) => (
            <View
              key={i}
              style={{
                backgroundColor: theme.surfaceAlt,
                borderRadius: Radius.md,
                padding: Spacing.sm,
                borderLeftWidth: 3,
                borderLeftColor: theme.accent,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flexWrap: 'wrap' }}>
                <Ionicons
                  name={src.kind === 'ayah' ? 'book-outline' : src.kind === 'hadith' ? 'library-outline' : 'bookmarks-outline'}
                  size={13}
                  color={theme.accent}
                />
                <ThemedText variant="caption" color={theme.accent}>
                  {src.reference}
                </ThemedText>
                {src.grading ? (
                  <ThemedText variant="caption">
                    · {t('assistant.hadithGrading')}: {src.grading}
                  </ThemedText>
                ) : null}
                {src.verified ? (
                  <ThemedText variant="caption" color={theme.success}>
                    · {t('common.verified')}
                  </ThemedText>
                ) : null}
              </View>
              <ThemedText variant="secondary" style={{ marginTop: Spacing.xs, fontStyle: 'italic' }}>
                “{src.text}”
              </ThemedText>
            </View>
          ))}
        </View>
      ) : null}

      {msg.differences ? (
        <View style={{ marginTop: Spacing.md }}>
          <ThemedText variant="label">{t('assistant.differences')}</ThemedText>
          <ThemedText variant="secondary">{msg.differences}</ThemedText>
        </View>
      ) : null}

      {msg.referToScholar ? (
        <View
          style={{
            marginTop: Spacing.md,
            backgroundColor: theme.accentSoft,
            borderRadius: Radius.md,
            padding: Spacing.sm,
            flexDirection: 'row',
            gap: Spacing.sm,
          }}
        >
          <Ionicons name="alert-circle-outline" size={18} color={theme.accent} />
          <ThemedText variant="caption" style={{ flex: 1 }}>
            {t('assistant.referToScholar')}
          </ThemedText>
        </View>
      ) : null}

      {/* Eylemler */}
      <View style={{ flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, alignItems: 'center' }}>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            saved.toggle({
              type: 'aiAnswer',
              refId: msg.id,
              title: msg.shortAnswer ?? t('assistant.title'),
              preview: msg.text.slice(0, 140),
              offline: true,
            })
          }
        >
          <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color={theme.primary} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            void shareText(`${msg.shortAnswer ?? ''}\n\n${msg.text}\n\n${t('assistant.sourcesTitle')}: ${(msg.sources ?? []).map((s) => s.reference).join('; ')}\n— NUR (demo)`,)
          }
        >
          <Ionicons name="share-outline" size={20} color={theme.primary} />
        </Pressable>
        <View style={{ flex: 1 }} />
        {feedbackDone || msg.feedback ? (
          <ThemedText variant="caption" color={theme.success}>
            {t('assistant.feedbackThanks')}
          </ThemedText>
        ) : (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setFeedback(msg.id, 'helpful');
                setFeedbackDone(true);
              }}
            >
              <Ionicons name="thumbs-up-outline" size={18} color={theme.textSecondary} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setFeedback(msg.id, 'incorrect');
                setFeedbackDone(true);
              }}
            >
              <Ionicons name="thumbs-down-outline" size={18} color={theme.textSecondary} />
            </Pressable>
          </>
        )}
      </View>
    </Card>
  );
}

export default function AssistantScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const aiStore = useAiStore();
  const historyEnabled = useSettingsStore((s) => s.aiHistoryEnabled);
  const [input, setInput] = useState('');
  // Kayıt kapalıyken mesajlar yalnızca ekranda tutulur
  const [sessionMessages, setSessionMessages] = useState<AiMessage[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const messages = historyEnabled ? aiStore.messages : sessionMessages;

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    setInput('');
    const userMsg: AiMessage = {
      id: nextId(),
      role: 'user',
      text,
      demo: true,
      createdAt: new Date().toISOString(),
    };
    const answer = buildAssistantMessage(text, t);
    if (historyEnabled) {
      aiStore.append(userMsg);
      aiStore.append(answer);
    } else {
      setSessionMessages((m) => [...m, userMsg, answer]);
    }
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const relatedTopicPress = (topic: string) => send(topic);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Uyarı bandı */}
      <View
        style={{
          backgroundColor: theme.accentSoft,
          paddingTop: Spacing.sm,
          paddingBottom: Spacing.sm,
          paddingHorizontal: Spacing.md,
          flexDirection: 'row',
          gap: Spacing.sm,
          alignItems: 'center',
        }}
      >
        <Ionicons name="information-circle-outline" size={18} color={theme.accent} />
        <ThemedText variant="caption" style={{ flex: 1 }}>
          {t('assistant.disclaimerBanner')}
        </ThemedText>
        {messages.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              aiStore.clearHistory();
              setSessionMessages([]);
            }}
          >
            <Ionicons name="trash-outline" size={18} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      {!historyEnabled ? (
        <View style={{ backgroundColor: theme.surfaceAlt, padding: Spacing.xs, paddingHorizontal: Spacing.md }}>
          <ThemedText variant="caption">{t('assistant.historyOff')}</ThemedText>
        </View>
      ) : null}

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xl }}
        keyboardShouldPersistTaps="handled"
      >
        {messages.length === 0 ? (
          <View style={{ marginTop: Spacing.xl, gap: Spacing.sm }}>
            <ThemedText variant="title">{t('assistant.emptyTitle')}</ThemedText>
            <ThemedText variant="secondary">{t('assistant.emptyBody')}</ThemedText>
            <View style={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
              {SUGGESTED_QUESTIONS.map((q) => (
                <Card key={q} onPress={() => send(q)}>
                  <ThemedText variant="secondary">{q}</ThemedText>
                </Card>
              ))}
            </View>
          </View>
        ) : (
          messages.map((msg) =>
            msg.role === 'user' ? (
              <View
                key={msg.id}
                style={{
                  alignSelf: 'flex-end',
                  backgroundColor: theme.primary,
                  borderRadius: Radius.lg,
                  padding: Spacing.sm + 2,
                  marginBottom: Spacing.sm,
                  maxWidth: '85%',
                }}
              >
                <ThemedText color={theme.onPrimary}>{msg.text}</ThemedText>
              </View>
            ) : (
              <View key={msg.id}>
                <AssistantBubble msg={msg} />
                {msg.relatedTopics && msg.relatedTopics.length > 0 ? (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.md }}>
                    {msg.relatedTopics.map((topic) => (
                      <Chip key={topic} label={topic} onPress={() => relatedTopicPress(topic)} />
                    ))}
                    <Chip label={t('assistant.relatedContent')} onPress={() => router.push('/programs')} />
                  </View>
                ) : null}
              </View>
            ),
          )
        )}
      </ScrollView>

      {/* Giriş */}
      <View
        style={{
          flexDirection: 'row',
          gap: Spacing.sm,
          padding: Spacing.md,
          paddingBottom: Spacing.md + insets.bottom / 2,
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        }}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={t('assistant.inputPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          multiline
          style={{
            flex: 1,
            backgroundColor: theme.surfaceAlt,
            borderRadius: Radius.lg,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            color: theme.text,
            maxHeight: 100,
          }}
          onSubmitEditing={() => send()}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('assistant.send')}
          onPress={() => send()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-end',
          }}
        >
          <Ionicons name="arrow-up" size={20} color={theme.onPrimary} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
