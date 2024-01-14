import { Layout, Text, Spinner } from "@ui-kitten/components";

export const RealmFallback = () => {
  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Spinner status="info" />
      <Text category="s2" status="info">
        Initializing database...
      </Text>
    </Layout>
  );
};
