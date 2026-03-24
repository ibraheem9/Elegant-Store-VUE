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
import { Purchase } from "@/lib/storage";

export default function PurchasesScreen() {
  const colors = useColors();
  const { purchases, addPurchase, deletePurchase, getTotalPurchasesToday } =
    useData();
  const [showModal, setShowModal] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const totalToday = getTotalPurchasesToday();
  const todayPurchases = purchases.filter(
    (p) => p.date === new Date().toISOString().split("T")[0]
  );

  const handleAddPurchase = async () => {
    if (!vendorName.trim() || !amount.trim()) {
      setError("الرجاء إدخال اسم المورد والمبلغ");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("الرجاء إدخال مبلغ صحيح");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const newPurchase: Purchase = {
      id: `purchase_${Date.now()}`,
      date: today,
      vendorName: vendorName.trim(),
      amount: amountNum,
      notes: notes.trim(),
      timestamp: Date.now(),
    };

    await addPurchase(newPurchase);
    setVendorName("");
    setAmount("");
    setNotes("");
    setError("");
    setShowModal(false);
  };

  const renderPurchaseItem = ({ item }: { item: Purchase }) => (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {item.vendorName}
          </Text>
          <Text className="text-sm text-muted mt-1">
            {new Date(item.timestamp).toLocaleTimeString("ar-SA", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => deletePurchase(item.id)}
          className="px-3 py-1 bg-error/10 rounded"
        >
          <Text className="text-error text-xs font-semibold">حذف</Text>
        </TouchableOpacity>
      </View>
      {item.notes && (
        <Text className="text-sm text-muted mt-2 italic">{item.notes}</Text>
      )}
      <Text className="text-lg font-bold text-warning mt-2">
        {item.amount.toFixed(2)} ل.س
      </Text>
    </View>
  );

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="bg-warning px-6 py-4 rounded-b-2xl mb-6">
        <Text className="text-white text-sm opacity-90">إجمالي المشتريات اليوم</Text>
        <Text className="text-white text-3xl font-bold mt-1">
          {totalToday.toFixed(2)} ل.س
        </Text>
        <Text className="text-white text-xs opacity-75 mt-1">
          {todayPurchases.length} عملية شراء
        </Text>
      </View>

      {/* Purchases List */}
      <View className="flex-1 px-6">
        {todayPurchases.length > 0 ? (
          <FlatList
            data={todayPurchases}
            renderItem={renderPurchaseItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted text-base">لا توجد مشتريات اليوم</Text>
          </View>
        )}
      </View>

      {/* Add Purchase Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="bg-warning rounded-lg py-4 items-center"
        >
          <Text className="text-white font-bold text-base">+ إضافة مشتريات</Text>
        </TouchableOpacity>
      </View>

      {/* Add Purchase Modal */}
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
                إضافة مشتريات جديدة
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text className="text-2xl text-muted">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Vendor Name */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  اسم المورد
                </Text>
                <TextInput
                  placeholder="أدخل اسم المورد"
                  placeholderTextColor={colors.muted}
                  value={vendorName}
                  onChangeText={setVendorName}
                  className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                  style={{ color: colors.foreground }}
                />
              </View>

              {/* Amount */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  المبلغ (ل.س)
                </Text>
                <TextInput
                  placeholder="أدخل المبلغ"
                  placeholderTextColor={colors.muted}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                  style={{ color: colors.foreground }}
                />
              </View>

              {/* Notes */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  ملاحظات (اختياري)
                </Text>
                <TextInput
                  placeholder="أدخل ملاحظات عن المشتريات"
                  placeholderTextColor={colors.muted}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
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
                  onPress={handleAddPurchase}
                  className="flex-1 bg-warning rounded-lg py-3 items-center"
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
