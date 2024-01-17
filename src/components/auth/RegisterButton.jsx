import { Button, Text } from "@ui-kitten/components";
import { View } from "react-native";

import { useEffect } from "react";
import { Alert } from "react-native";

export default Register = ({ data, register, result, logIn }) => {
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
      if (!email || !password || !confirmPassword) {
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
        gap: 15,
      }}
    >
      {result.error && (
        <Text status="danger" style={{ textAlign: "center" }}>
          {result.error.message}
        </Text>
      )}
      <Button onPress={performRegistration}>
        {isLogin ? "Login" : "Create account"}
      </Button>
    </View>
  );
};
