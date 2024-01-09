import { Layout, Text } from "@ui-kitten/components";

export default function Total({ records }) {
  const total = records?.data?.reduce((acc, curr) => acc + curr.amount, 0);
  const fee = records?.data?.reduce((acc, curr) => acc + curr.fee, 0);
  return (
    <Layout
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        category="h6"
        status={records?.category == "Cash in" ? "success" : "danger"}
      >
        ₱{total}
      </Text>
      <Text
        category="s2"
        status={records?.category == "Cash in" ? "success" : "danger"}
      >
        ₱{fee}
      </Text>
    </Layout>
  );
}
