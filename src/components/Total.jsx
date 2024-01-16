import { Layout, Text } from "@ui-kitten/components";

export default function Total({ records }) {
  let totalamount = records?.data
    .filtered("isTransfer!=true")

    .sum("amount");
  let totalfee = records?.data
    .filtered("isTransfer!=true")

    .sum("fee");

  return (
    <Layout
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
      }}
    >
      {records.data.length > 0 && (
        <>
          <Text
            category="s1"
            status={records?.category == "Cash in" ? "success" : "warning"}
            style={{ fontWeight: "700", fontSize: 16 }}
          >
            ₱{totalamount}
          </Text>
          {!isExpense && (
            <Text
              category="s2"
              status={records?.category == "Cash in" ? "success" : "warning"}
            >
              ₱{totalfee}
            </Text>
          )}
        </>
      )}
    </Layout>
  );
}
