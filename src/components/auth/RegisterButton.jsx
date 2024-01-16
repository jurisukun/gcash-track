import { Button, Text } from "@ui-kitten/components";
import { View } from "react-native";
import { useEmailPasswordAuth } from "@realm/react";
import { useEffect } from "react";
import { Alert } from "react-native";

export default Register = ({ data }) => {
  const { register, result, logIn } = useEmailPasswordAuth();
  useEffect(() => {
    if (result.success && result.operation === "register") {
      logIn({ email, password });
      return;
    }
  }, [result]);

  const { email, password, confirmPassword, isLogin, firstName, lastName } =
    data;

  const performRegistration = () => {
    if (!isLogin) {
      if (
        !email ||
        (!firstName && !lastName) ||
        !password ||
        !confirmPassword
      ) {
        Alert.alert("Invalid", "Please fill in all fields");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Invalid", "Passwords don't match");
        return;
      }
    }
    if (isLogin) {
      if (!email || !password) {
        Alert.alert("Invalid", "Please fill in all fields");
        return;
      }
    }

    if (isLogin) {
      logIn({ email, password });
    } else {
      register({ email, password });
    }
  };

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {result.error && (
        <Text status="danger">
          {isLogin
            ? "Invalid email/password"
            : "Cannot register email/password"}
        </Text>
      )}
      <Button onPress={performRegistration}>
        {isLogin ? "Login" : "Create account"}
      </Button>
    </View>
  );
};
