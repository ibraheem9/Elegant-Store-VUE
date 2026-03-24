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
import { Payment } from "@/lib/storage";

export default function PaymentsScreen() {
  const colors = useColors();
  const { payments, addPayment, deletePayment, getPaymentsToday } = useData();
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "app">("cash");
  const [invoiceRef, setInvoiceRef] = useState("");
  const [error, setError] = useState("");

  const paymentsToday = getPaymentsToday();
  const totalPaymentsToday = paymentsToday.reduce((sum, p) => sum + p.amount, 0);

  const handleAddPayment = async () => {
    if (!customerName.trim() || !amount.trim()) {
      setError("الرجاء إدخال اسم العميل والمبلغ");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("الرجاء إدخال مبلغ صحيح");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const newPayment: Payment = {
      id: `payment_${Date.now()}`,
      date: today,
      customerName: customerName.trim(),
      amount: amountNum,
      method,
      invoiceReference: invoiceRef.trim() || undefined,
      timestamp: Date.now(),
    };

    await addPayment(newPayment);
    setCustomerName("");
    setAmount("");
    setMethod("cash");
    setInvoiceRef("");
    setError("");
    setShowModal(false);
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="flex-row justify-between items-start mb-2">
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
          {item.invoiceReference && (
            <Text className="text-xs text-muted mt-1">
              الفاتورة: {item.invoiceReference}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => deletePayment(item.id)}
          className="px-3 py-1 bg-error/10 rounded"
        >
          <Text className="text-error text-xs font-semibold">حذف</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-end mt-2">
        <View
          className={`px-2 py-1 rounded ${
            item.method === "cash" ? "bg-success/20" : "bg-primary/20"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              item.method === "cash" ? "text-success" : "text-primary"
            }`}
          >
            {item.method === "cash" ? "نقد" : "تطبيق"}
          </Text>
        </View>
        <Text className="text-lg font-bold text-primary">
          {item.amount.toFixed(2)} ل.س
        </Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="bg-primary px-6 py-4 rounded-b-2xl mb-6">
        <Text className="text-white text-sm opacity-90">إجمالي الدفعات اليوم</Text>
        <Text className="text-white text-3xl font-bold mt-1">
          {totalPaymentsToday.toFixed(2)} ل.س
        </Text>
        <Text className="text-white text-xs opacity-75 mt-1">
          {paymentsToday.length} دفعة
        </Text>
      </View>

      {/* Payments List */}
      <View className="flex-1 px-6">
        {paymentsToday.length > 0 ? (
          <FlatList
            data={paymentsToday}
            renderItem={renderPaymentItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted text-base">لا توجد دفعات اليوم</Text>
          </View>
        )}
      </View>

      {/* Add Payment Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="bg-primary rounded-lg py-4 items-center"
        >
          <Text className="text-white font-bold text-base">+ تسجيل دفعة جديدة</Text>
        </TouchableOpacity>
      </View>

      {/* Add Payment Modal */}
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
                تسجيل دفعة جديدة
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
                    onPress={() => setMethod("cash")}
                    className={`flex-1 py-3 rounded-lg border-2 items-center ${
                      method === "cash"
                        ? "border-success bg-success/10"
                        : "border-border bg-surface"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        method === "cash" ? "text-success" : "text-muted"
                      }`}
                    >
                      نقد
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setMethod("app")}
                    className={`flex-1 py-3 rounded-lg border-2 items-center ${
                      method === "app"
                        ? "border-primary bg-primary/10"
                        : "border-border bg-surface"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        method === "app" ? "text-primary" : "text-muted"
                      }`}
                    >
                      تطبيق
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Invoice Reference */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  رقم الفاتورة (اختياري)
                </Text>
                <TextInput
                  placeholder="أدخل رقم الفاتورة"
                  placeholderTextColor={colors.muted}
                  value={invoiceRef}
                  onChangeText={setInvoiceRef}
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
                  onPress={handleAddPayment}
                  className="flex-1 bg-primary rounded-lg py-3 items-center"
                >
                  <Text className="text-white font-semibold">تسجيل</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
