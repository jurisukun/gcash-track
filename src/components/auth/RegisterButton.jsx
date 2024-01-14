import { Button } from "@ui-kitten/components";
import { useEmailPasswordAuth } from "@realm/react";
import { useEffect } from "react";
import { Alert } from "react-native";

export default Register = ({ data }) => {
  // const { logInWithAnonymous, result } = useAuth();

  // useEffect(() => {
  //   logInWithAnonymous();
  // }, []);

  useEffect(() => {
    try {
      result.error;
      if (result.success && result.operation === "register") {
        logIn({ email, password });
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error", result.error.message);
      return;
    }
  }, [result]);

  const { email, password, confirmPassword, isLogin, firstName, lastName } =
    data;

  const { register, result, logIn } = useEmailPasswordAuth();

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
