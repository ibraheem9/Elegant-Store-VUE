import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { useState, useCallback } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useData } from "@/lib/data-context";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { Sale } from "@/lib/storage";

export default function SalesScreen() {
  const colors = useColors();
  const { sales, addSale, deleteSale, getSalesToday, getTotalSalesToday } =
    useData();
  const { logout } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "app">("cash");
  const [error, setError] = useState("");

  const todaySales = getSalesToday();
  const totalToday = getTotalSalesToday();

  const handleAddSale = async () => {
    if (!customerName.trim() || !amount.trim()) {
      setError("الرجاء إدخال جميع البيانات");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("الرجاء إدخال مبلغ صحيح");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const newSale: Sale = {
      id: `sale_${Date.now()}`,
      date: today,
      customerName: customerName.trim(),
      amount: amountNum,
      paymentMethod,
      timestamp: Date.now(),
    };

    await addSale(newSale);
    setCustomerName("");
    setAmount("");
    setPaymentMethod("cash");
    setError("");
    setShowModal(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleDeleteSale = (id: string) => {
    deleteSale(id);
  };

  const renderSaleItem = ({ item }: { item: Sale }) => (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border flex-row justify-between items-center">
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">
          {item.customerName}
        </Text>
        <Text className="text-sm text-muted mt-1">
          {new Date(item.timestamp).toLocaleTimeString("ar-SA", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <View className="mt-2 flex-row gap-2">
          <View
            className={`px-2 py-1 rounded ${
              item.paymentMethod === "cash"
                ? "bg-success/20"
                : "bg-primary/20"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                item.paymentMethod === "cash"
                  ? "text-success"
                  : "text-primary"
              }`}
            >
              {item.paymentMethod === "cash" ? "نقد" : "تطبيق"}
            </Text>
          </View>
        </View>
      </View>
      <View className="items-end gap-2">
        <Text className="text-lg font-bold text-primary">
          {item.amount.toFixed(2)} ل.س
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteSale(item.id)}
          className="px-3 py-1 bg-error/10 rounded"
        >
          <Text className="text-error text-xs font-semibold">حذف</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="bg-primary px-6 py-4 rounded-b-2xl mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-white text-sm opacity-90">إجمالي المبيعات اليوم</Text>
            <Text className="text-white text-3xl font-bold mt-1">
              {totalToday.toFixed(2)} ل.س
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white/20 px-3 py-2 rounded-lg"
          >
            <Text className="text-white text-xs font-semibold">تسجيل خروج</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-white text-xs opacity-75">
          {todaySales.length} عملية بيع
        </Text>
      </View>

      {/* Sales List */}
      <View className="flex-1 px-6">
        {todaySales.length > 0 ? (
          <FlatList
            data={todaySales}
            renderItem={renderSaleItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted text-base">لا توجد مبيعات اليوم</Text>
          </View>
        )}
      </View>

      {/* Add Sale Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="bg-primary rounded-lg py-4 items-center"
        >
          <Text className="text-white font-bold text-base">+ إضافة مبيعة جديدة</Text>
        </TouchableOpacity>
      </View>

      {/* Add Sale Modal */}
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
                إضافة مبيعة جديدة
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text className="text-2xl text-muted">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Customer Name */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  اسم العميل
                </Text>
                <TextInput
                  placeholder="أدخل اسم العميل"
                  placeholderTextColor={colors.muted}
                  value={customerName}
                  onChangeText={setCustomerName}
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

              {/* Payment Method */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  طريقة الدفع
                </Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setPaymentMethod("cash")}
                    className={`flex-1 py-3 rounded-lg border-2 items-center ${
                      paymentMethod === "cash"
                        ? "border-success bg-success/10"
                        : "border-border bg-surface"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        paymentMethod === "cash"
                          ? "text-success"
                          : "text-muted"
                      }`}
                    >
                      نقد
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPaymentMethod("app")}
                    className={`flex-1 py-3 rounded-lg border-2 items-center ${
                      paymentMethod === "app"
                        ? "border-primary bg-primary/10"
                        : "border-border bg-surface"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        paymentMethod === "app"
                          ? "text-primary"
                          : "text-muted"
                      }`}
                    >
                      تطبيق
                    </Text>
                  </TouchableOpacity>
                </View>
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
                  onPress={handleAddSale}
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
