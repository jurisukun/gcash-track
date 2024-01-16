import { Layout, Text, Input, Icon } from "@ui-kitten/components";
import { useState } from "react";
import { View } from "react-native";
import RegisterButton from "./RegisterButton";

export default LoginRegisterinputs = () => {
  const [dataToSubmit, setDataToSubmit] = useState({ isLogin: true });
  const [secure, setSecure] = useState(true);

  const checkPassword = (pass, confpass, isLogin) => {
    if (pass.trim() !== confpass.trim() && !isLogin) {
      alert("Passwords don't match");
      return null;
    }
    return pass;
  };

  return (
    <Layout
      style={{
        flex: 1,
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: 20,
      }}
    >
      <Text category="h4">{dataToSubmit?.isLogin ? "Log in" : "Sign up"}</Text>
      <View
        style={{
          flexDirection: "column",
          gap: 20,
          width: "100%",
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}
        className="border rounded-lg"
      >
        {!dataToSubmit.isLogin && (
          <>
            <Input
              label="First Name"
              placeholder="Enter first name"
              onChangeText={(val) =>
                setDataToSubmit((prev) => ({ ...prev, firstName: val }))
              }
            />
            <Input
              label="Last Name"
              placeholder="Enter last name"
              onChangeText={(val) => {
                setDataToSubmit((prev) => ({ ...prev, lastName: val }));
              }}
            />
          </>
        )}
        <Input
          label="Email"
          placeholder="Enter email address"
          onChangeText={(val) =>
            setDataToSubmit((prev) => ({ ...prev, email: val }))
          }
        />
        <Input
          secureTextEntry={secure}
          label="Password"
          placeholder="Enter password"
          onChangeText={(val) =>
            setDataToSubmit((prev) => ({ ...prev, password: val }))
          }
          accessoryRight={(props) =>
            secure ? (
              <Icon
                {...props}
                name="eye"
                onPress={() => {
                  setSecure(false);
                }}
              />
            ) : (
              <Icon
                {...props}
                name="eye-off"
                onPress={() => {
                  setSecure(true);
                }}
              />
            )
          }
        />

        {!dataToSubmit.isLogin && (
          <Input
            secureTextEntry={secure}
            label="Confirm Password"
            placeholder="Re-enter password"
            onChangeText={(val) =>
              setDataToSubmit((prev) => ({ ...prev, confirmPassword: val }))
            }
          />
        )}
        <RegisterButton data={dataToSubmit} checkPassword={checkPassword} />
      </View>
      <View>
        <>
          <Text
            category="p2"
            status="info"
            onPress={() => {
              setDataToSubmit((prev) => ({
                ...prev,
                isLogin: !prev.isLogin,
              }));
            }}
          >
            {!dataToSubmit.isLogin
              ? "Already have an account? Log in here"
              : "Don't have an account? Sign up here"}
          </Text>
        </>
      </View>
    </Layout>
  );
};
