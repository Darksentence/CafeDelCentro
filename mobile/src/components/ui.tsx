import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius } from "@/theme";

type PageProps = {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  safeEdges?: ("top" | "right" | "bottom" | "left")[];
};

export function Page({
  children,
  contentStyle,
  safeEdges = ["top", "left", "right"],
}: PageProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={safeEdges}>
      <ScrollView
        contentContainerStyle={[styles.pageContent, contentStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function CafeBrand({
  subtitle = "ESPECIALIDAD · CALIDEZ · ENCUENTRO",
}: {
  subtitle?: string;
}) {
  return (
    <View style={styles.brandRow}>
      <View style={styles.brandMark}>
        <Text style={styles.brandCup}>☕</Text>
      </View>
      <View>
        <Text style={styles.brandName}>Café del Centro</Text>
        <Text style={styles.brandSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

export function PageHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.headingBlock}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.pageTitle}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

type ButtonProps = {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: "primary" | "secondary" | "text";
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean;
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  compact = false,
}: ButtonProps) {
  const variantStyle =
    variant === "primary"
      ? styles.button_primary
      : variant === "secondary"
        ? styles.button_secondary
        : styles.button_text;
  const variantText =
    variant === "primary"
      ? styles.buttonText_primary
      : variant === "secondary"
        ? styles.buttonText_secondary
        : styles.buttonText_text;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        compact && styles.buttonCompact,
        pressed && !disabled && styles.buttonPressed,
        (disabled || loading) && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.white : colors.coffeeDark}
        />
      ) : (
        <Text style={[styles.buttonText, variantText]}>{title}</Text>
      )}
    </Pressable>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  inputProps?: Omit<TextInputProps, "value" | "onChangeText" | "placeholder">;
};

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  inputProps,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A89B8D"
        secureTextEntry={secureTextEntry}
        style={styles.input}
        selectionColor={colors.coffee}
        {...inputProps}
      />
    </View>
  );
}

export function Notice({
  children,
  kind = "error",
}: {
  children: ReactNode;
  kind?: "error" | "success" | "info";
}) {
  const noticeStyle =
    kind === "error"
      ? styles.notice_error
      : kind === "success"
        ? styles.notice_success
        : styles.notice_info;
  const textStyle =
    kind === "error"
      ? styles.noticeText_error
      : kind === "success"
        ? styles.noticeText_success
        : styles.noticeText_info;

  return (
    <View style={[styles.notice, noticeStyle]}>
      <Text style={[styles.noticeText, textStyle]}>{children}</Text>
    </View>
  );
}

export function LoadingMessage({ label = "Cargando..." }: { label?: string }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.coffee} />
      <Text style={styles.subtitle}>{label}</Text>
    </View>
  );
}

export function Surface({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.cream },
  pageContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 36,
    gap: 18,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 11 },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFE1CA",
  },
  brandCup: { fontSize: 21 },
  brandName: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  brandSubtitle: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.1,
  },
  headingBlock: { gap: 7 },
  eyebrow: {
    color: colors.coffee,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  pageTitle: {
    color: colors.ink,
    fontFamily: "serif",
    fontSize: 34,
    lineHeight: 39,
    letterSpacing: -0.7,
  },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  button: {
    minHeight: 50,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  button_primary: { backgroundColor: colors.coffee },
  button_secondary: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
  },
  button_text: { backgroundColor: "transparent", paddingHorizontal: 10 },
  buttonCompact: { minHeight: 40, paddingHorizontal: 15 },
  buttonPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { fontSize: 14, fontWeight: "700" },
  buttonText_primary: { color: colors.white },
  buttonText_secondary: { color: colors.coffeeDark },
  buttonText_text: { color: colors.coffeeDark },
  field: { gap: 7 },
  fieldLabel: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  input: {
    minHeight: 50,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    backgroundColor: colors.paper,
    fontSize: 15,
  },
  notice: { padding: 13, borderRadius: 12, borderWidth: 1 },
  notice_error: { backgroundColor: "#F9E9E4", borderColor: "#EECFC5" },
  notice_success: { backgroundColor: "#EAF1E7", borderColor: "#D1DFC9" },
  notice_info: { backgroundColor: "#F3E9D8", borderColor: "#E7D7BB" },
  noticeText: { fontSize: 13, lineHeight: 19 },
  noticeText_error: { color: colors.danger },
  noticeText_success: { color: colors.success },
  noticeText_info: { color: colors.coffeeDark },
  loading: {
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  surface: {
    padding: 17,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
});
