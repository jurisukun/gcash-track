import { Layout, Text } from "@ui-kitten/components";

export default function Total({ records }) {
  let total = 0;
  let fee = 0;
  records?.data?.map((row) => {
    total += +row.amount;
    fee += +row.fee;
  });

  return (
    <Layout
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {records.data.length > 0 && (
        <>
          <Text
            category="h6"
            status={records?.category == "Cash in" ? "success" : "warning"}
          >
            ₱{total}
          </Text>
          <Text
            category="s2"
            status={records?.category == "Cash in" ? "success" : "warning"}
          >
            ₱{fee}
          </Text>
        </>
      )}
    </Layout>
  );
}
