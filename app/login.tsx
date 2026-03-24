import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const colors = useColors();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("الرجاء إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await login(username, password);
      if (success) {
        router.replace("/(tabs)");
      } else {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center px-6 gap-8">
          {/* Logo/Title */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-primary">متجر</Text>
            <Text className="text-lg text-muted">نظام إدارة المبيعات</Text>
          </View>

          {/* Form */}
          <View className="w-full max-w-sm gap-4">
            {/* Username Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">
                اسم المستخدم
              </Text>
              <TextInput
                placeholder="أدخل اسم المستخدم"
                placeholderTextColor={colors.muted}
                value={username}
                onChangeText={setUsername}
                editable={!isLoading}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                style={{ color: colors.foreground }}
              />
            </View>

            {/* Password Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">
                كلمة المرور
              </Text>
              <TextInput
                placeholder="أدخل كلمة المرور"
                placeholderTextColor={colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                style={{ color: colors.foreground }}
              />
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-error/10 border border-error rounded-lg p-3">
                <Text className="text-error text-sm">{error}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`rounded-lg py-3 items-center ${
                isLoading ? "bg-primary/50" : "bg-primary"
              }`}
            >
              <Text className="text-background font-semibold text-base">
                {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Credentials */}
          <View className="w-full max-w-sm bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs font-semibold text-muted mb-2">
              بيانات تجريبية:
            </Text>
            <View className="gap-1">
              <Text className="text-xs text-muted">
                المستخدم: <Text className="font-mono">hamoda</Text>
              </Text>
              <Text className="text-xs text-muted">
                كلمة المرور: <Text className="font-mono">hamoda123</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
