import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/ui";
import { colors, radius } from "@/theme";
import type { Producto } from "@/types";

const sizes = ["16oz", "20oz", "24oz", "32oz"];

export function ProductCard({
  producto,
  tamano,
  onSelectSize,
  onAdd,
}: {
  producto: Producto;
  tamano: string;
  onSelectSize: (size: string) => void;
  onAdd: () => void;
}) {
  const price = producto.precios[tamano] ?? producto.precios["16oz"] ?? 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.cup}>
          <Text style={styles.cupText}>☕</Text>
        </View>
        <View style={styles.copy}>
          <Text style={styles.category}>{producto.categoria}</Text>
          <Text style={styles.name}>{producto.nombre}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {producto.descripcion ||
              "Preparado al momento con café de especialidad."}
          </Text>
        </View>
      </View>

      <Text style={styles.sizeLabel}>TAMAÑO DEL VASO</Text>
      <View style={styles.sizes}>
        {sizes.map((size) => {
          const selected = size === tamano;
          const unavailable = typeof producto.precios[size] !== "number";
          return (
            <Pressable
              key={size}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: unavailable }}
              disabled={unavailable}
              onPress={() => onSelectSize(size)}
              style={[
                styles.sizeChip,
                selected && styles.sizeChipSelected,
                unavailable && styles.sizeChipDisabled,
              ]}
            >
              <Text style={[styles.sizeText, selected && styles.sizeTextSelected]}>
                {size}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.priceCaption}>PRECIO</Text>
          <Text style={styles.price}>{"$" + price.toFixed(2)}</Text>
        </View>
        <AppButton title="Añadir" onPress={onAdd} compact />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 15,
    padding: 16,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 13 },
  cup: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1E4D0",
  },
  cupText: { fontSize: 27 },
  copy: { flex: 1, gap: 4 },
  category: {
    color: colors.coffee,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  name: { color: colors.ink, fontSize: 17, fontWeight: "700" },
  description: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  sizeLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  sizes: { flexDirection: "row", gap: 7 },
  sizeChip: {
    flex: 1,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.cream,
  },
  sizeChipSelected: {
    borderColor: colors.coffeeDark,
    backgroundColor: colors.coffeeDark,
  },
  sizeChipDisabled: { opacity: 0.35 },
  sizeText: { color: colors.muted, fontSize: 10, fontWeight: "700" },
  sizeTextSelected: { color: colors.white },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  priceCaption: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
  },
  price: { marginTop: 2, color: colors.coffeeDark, fontSize: 18, fontWeight: "700" },
});
