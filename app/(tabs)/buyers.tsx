import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useData } from "@/lib/data-context";
import { useColors } from "@/hooks/use-colors";
import { Buyer } from "@/lib/storage";

export default function BuyersScreen() {
  const colors = useColors();
  const { buyers, addBuyer, updateBuyer, deleteBuyer, getBuyerDebtStatus } =
    useData();
  const [showModal, setShowModal] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [debtLimit, setDebtLimit] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuyers = buyers.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddBuyer = async () => {
    if (!buyerName.trim() || !debtLimit.trim()) {
      setError("الرجاء إدخال اسم العميل وحد الدين");
      return;
    }

    const limitNum = parseFloat(debtLimit);
    if (isNaN(limitNum) || limitNum <= 0) {
      setError("الرجاء إدخال حد دين صحيح");
      return;
    }

    const newBuyer: Buyer = {
      id: `buyer_${Date.now()}`,
      name: buyerName.trim(),
      debtLimit: limitNum,
      totalDebt: 0,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };

    await addBuyer(newBuyer);
    setBuyerName("");
    setDebtLimit("");
    setError("");
    setShowModal(false);
  };

  const renderBuyerItem = ({ item }: { item: Buyer }) => {
    const debtStatus = getBuyerDebtStatus(item.id);
    const isHighDebt = debtStatus.percentage >= 90;

    return (
      <TouchableOpacity
        className={`bg-surface rounded-lg p-4 mb-3 border-2 ${
          isHighDebt ? "border-error" : "border-border"
        }`}
      >
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              {item.name}
            </Text>
            <Text className="text-xs text-muted mt-1">
              حد الدين: {item.debtLimit.toFixed(2)} ل.س
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => deleteBuyer(item.id)}
            className="px-2 py-1 bg-error/10 rounded"
          >
            <Text className="text-error text-xs font-semibold">حذف</Text>
          </TouchableOpacity>
        </View>

        {/* Debt Progress */}
        <View className="mt-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-xs text-muted">الدين الحالي</Text>
            <Text
              className={`text-sm font-bold ${
                isHighDebt ? "text-error" : "text-warning"
              }`}
            >
              {item.totalDebt.toFixed(2)} ل.س
            </Text>
          </View>
          <View className="h-2 bg-border rounded-full overflow-hidden">
            <View
              className={`h-full ${isHighDebt ? "bg-error" : "bg-warning"}`}
              style={{
                width: `${Math.min(debtStatus.percentage, 100)}%`,
              }}
            />
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-xs text-muted">
              {debtStatus.percentage.toFixed(0)}% من الحد المسموح
            </Text>
            {isHighDebt && (
              <View className="bg-error/20 px-2 py-1 rounded">
                <Text className="text-error text-xs font-semibold">تنبيه</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="bg-primary px-6 py-4 rounded-b-2xl mb-6">
        <Text className="text-white text-sm opacity-90">إجمالي العملاء</Text>
        <Text className="text-white text-3xl font-bold mt-1">
          {buyers.length}
        </Text>
        <Text className="text-white text-xs opacity-75 mt-1">
          {buyers.filter((b) => getBuyerDebtStatus(b.id).percentage >= 90).length} عملاء بديون عالية
        </Text>
      </View>

      {/* Search */}
      <View className="px-6 mb-4">
        <TextInput
          placeholder="ابحث عن عميل..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
          style={{ color: colors.foreground }}
        />
      </View>

      {/* Buyers List */}
      <View className="flex-1 px-6">
        {filteredBuyers.length > 0 ? (
          <FlatList
            data={filteredBuyers}
            renderItem={renderBuyerItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted text-base">
              {searchQuery ? "لا توجد نتائج" : "لا يوجد عملاء"}
            </Text>
          </View>
        )}
      </View>

      {/* Add Buyer Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="bg-primary rounded-lg py-4 items-center"
        >
          <Text className="text-white font-bold text-base">+ إضافة عميل جديد</Text>
        </TouchableOpacity>
      </View>

      {/* Add Buyer Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 max-h-3/4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-foreground">
                إضافة عميل جديد
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text className="text-2xl text-muted">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Buyer Name */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  اسم العميل
                </Text>
                <TextInput
                  placeholder="أدخل اسم العميل"
                  placeholderTextColor={colors.muted}
                  value={buyerName}
                  onChangeText={setBuyerName}
                  className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                  style={{ color: colors.foreground }}
                />
              </View>

              {/* Debt Limit */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  حد الدين (ل.س)
                </Text>
                <TextInput
                  placeholder="أدخل حد الدين المسموح"
                  placeholderTextColor={colors.muted}
                  value={debtLimit}
                  onChangeText={setDebtLimit}
                  keyboardType="decimal-pad"
                  className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                  style={{ color: colors.foreground }}
                />
              </View>

              {/* Error */}
              {error ? (
                <View className="bg-error/10 border border-error rounded-lg p-3 mb-4">
                  <Text className="text-error text-sm">{error}</Text>
                </View>
              ) : null}

              {/* Buttons */}
              <View className="flex-row gap-3 mt-6">
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  className="flex-1 border border-border rounded-lg py-3 items-center"
                >
                  <Text className="text-foreground font-semibold">إلغاء</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddBuyer}
                  className="flex-1 bg-primary rounded-lg py-3 items-center"
                >
                  <Text className="text-white font-semibold">إضافة</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
