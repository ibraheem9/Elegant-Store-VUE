import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useData } from "@/lib/data-context";
import { useColors } from "@/hooks/use-colors";

export default function StatisticsScreen() {
  const colors = useColors();
  const {
    getCashTotal,
    getPreviousDayTotal,
    getDailyIncome,
    getTotalSalesToday,
    getTotalPurchasesToday,
    getPaymentsToday,
  } = useData();

  const cashTotal = getCashTotal();
  const previousDayTotal = getPreviousDayTotal();
  const dailyIncome = getDailyIncome();
  const totalSales = getTotalSalesToday();
  const totalPurchases = getTotalPurchasesToday();
  const paymentsToday = getPaymentsToday();
  const totalPayments = paymentsToday.reduce((sum, p) => sum + p.amount, 0);

  const StatCard = ({
    title,
    value,
    subtitle,
    color = "primary",
  }: {
    title: string;
    value: string;
    subtitle?: string;
    color?: string;
  }) => (
    <View className={`bg-${color}/10 border-l-4 border-${color} rounded-lg p-4 mb-3`}>
      <Text className="text-xs text-muted mb-1">{title}</Text>
      <Text className={`text-2xl font-bold text-${color}`}>{value}</Text>
      {subtitle && <Text className="text-xs text-muted mt-1">{subtitle}</Text>}
    </View>
  );

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        {/* Header */}
        <Text className="text-2xl font-bold text-foreground mb-6">
          إحصائيات اليوم
        </Text>

        {/* Cash Summary */}
        <View className="bg-primary rounded-lg p-6 mb-6">
          <Text className="text-white text-sm opacity-90 mb-2">إجمالي النقد</Text>
          <Text className="text-white text-4xl font-bold">
            {cashTotal.toFixed(2)} ل.س
          </Text>
          <View className="flex-row gap-4 mt-4 pt-4 border-t border-white/20">
            <View>
              <Text className="text-white text-xs opacity-75">اليوم</Text>
              <Text className="text-white text-lg font-semibold mt-1">
                {cashTotal.toFixed(2)} ل.س
              </Text>
            </View>
            <View>
              <Text className="text-white text-xs opacity-75">أمس</Text>
              <Text className="text-white text-lg font-semibold mt-1">
                {previousDayTotal.toFixed(2)} ل.س
              </Text>
            </View>
          </View>
        </View>

        {/* Daily Income */}
        <StatCard
          title="إجمالي المبيعات"
          value={`${totalSales.toFixed(2)} ل.س`}
          subtitle={`الدخل اليومي: ${dailyIncome.toFixed(2)} ل.س`}
          color="success"
        />

        {/* Purchases */}
        <StatCard
          title="إجمالي المشتريات"
          value={`${totalPurchases.toFixed(2)} ل.س`}
          color="warning"
        />

        {/* Payments */}
        <StatCard
          title="إجمالي الدفعات المستلمة"
          value={`${totalPayments.toFixed(2)} ل.س`}
          subtitle={`عدد الدفعات: ${paymentsToday.length}`}
          color="primary"
        />

        {/* Breakdown */}
        <Text className="text-lg font-bold text-foreground mt-8 mb-4">
          تفاصيل المبيعات
        </Text>

        <View className="bg-surface rounded-lg p-4 border border-border mb-6">
          <View className="flex-row justify-between mb-3 pb-3 border-b border-border">
            <Text className="text-sm text-muted">مبيعات نقدية</Text>
            <Text className="text-sm font-semibold text-foreground">
              {totalSales.toFixed(2)} ل.س
            </Text>
          </View>
          <View className="flex-row justify-between mb-3 pb-3 border-b border-border">
            <Text className="text-sm text-muted">مبيعات تطبيق</Text>
            <Text className="text-sm font-semibold text-foreground">
              {(totalSales - totalSales).toFixed(2)} ل.س
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted">الفرق من أمس</Text>
            <Text
              className={`text-sm font-semibold ${
                cashTotal > previousDayTotal
                  ? "text-success"
                  : "text-error"
              }`}
            >
              {(cashTotal - previousDayTotal).toFixed(2)} ل.س
            </Text>
          </View>
        </View>

        {/* Summary Table */}
        <Text className="text-lg font-bold text-foreground mb-4">
          الملخص المالي
        </Text>

        <View className="bg-surface rounded-lg p-4 border border-border mb-6">
          <View className="flex-row justify-between mb-3 pb-3 border-b border-border">
            <Text className="text-sm text-muted">المبيعات</Text>
            <Text className="text-sm font-semibold text-success">
              +{totalSales.toFixed(2)} ل.س
            </Text>
          </View>
          <View className="flex-row justify-between mb-3 pb-3 border-b border-border">
            <Text className="text-sm text-muted">المشتريات</Text>
            <Text className="text-sm font-semibold text-error">
              -{totalPurchases.toFixed(2)} ل.س
            </Text>
          </View>
          <View className="flex-row justify-between mb-3 pb-3 border-b border-border">
            <Text className="text-sm text-muted">الدفعات</Text>
            <Text className="text-sm font-semibold text-primary">
              +{totalPayments.toFixed(2)} ل.س
            </Text>
          </View>
          <View className="flex-row justify-between pt-3 border-t-2 border-primary">
            <Text className="text-sm font-bold text-foreground">الرصيد الصافي</Text>
            <Text className="text-sm font-bold text-primary">
              {(totalSales - totalPurchases + totalPayments).toFixed(2)} ل.س
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
