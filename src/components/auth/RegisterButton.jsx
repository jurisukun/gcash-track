import { Button } from "@ui-kitten/components";
import { useEmailPasswordAuth } from "@realm/react";
import { useEffect } from "react";
import { Alert } from "react-native";

export default Register = ({ data }) => {
  useEffect(() => {
    console.log(result);
    if (result.success && result.operation === "register") {
      logIn({ email, password });
      return;
    }
    if (result.error) {
      Alert.alert("Error", result.error);
      return;
    }
  }, [result]);

  const { email, password, confirmPassword, isLogin, firstName, lastName } =
    data;

  const { register, result, logIn } = useEmailPasswordAuth();

  try {
    result;
  } catch (e) {
    Alert.alert("Error", result.error);
    return;
  }

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

    isLogin ? logIn({ email, password }) : register({ email, password });
  };

  return (
    <Button onPress={performRegistration}>
      {isLogin ? "Login" : "Create account"}
    </Button>
  );
};
