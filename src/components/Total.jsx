import { Layout, Text } from "@ui-kitten/components";

export default function Total({ records }) {
  return (
    <Layout
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
      }}
    >
      <>
        <Text
          category="s1"
          status={records?.category == "Cash in" ? "success" : "warning"}
          style={{ fontWeight: "700", fontSize: 16 }}
        >
          ₱{records.total}
        </Text>
        {!isExpense && (
          <Text
            category="s2"
            status={records?.category == "Cash in" ? "success" : "warning"}
          >
            ₱{records.totalfee}
          </Text>
        )}
      </>
    </Layout>
  );
}
