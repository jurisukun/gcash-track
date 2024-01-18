import { useQuery } from "@realm/react";
import { Capital, GcashTransactions, CapitalTransactions } from "../realm";

export function useSubscribe() {
  const gcashSub = useQuery(GcashTransactions).sorted("date", true);
  const capitalSub = useQuery(CapitalTransactions);
  const addCapitalSub = useQuery(Capital);

  let cashintotal = 0;
  let cashintotalfee = 0;
  let cashouttotal = 0;
  let cashouttotalfee = 0;

  gcashSub
    .filtered("isTransfer!=true")

    .filter((row) => {
      if (
        (row.category == "Cash in" || row.category == "Load") &&
        !row?.deletedAt
      ) {
        cashintotal += row.amount;
        cashintotalfee += row.fee;
      } else if (
        (row.category != "Cash in" || row.category != "Load") &&
        !row?.deletedAt
      ) {
        cashouttotal += row.amount;
        cashouttotalfee += row.fee;
      }
    });

  return {
    gcashSub: gcashSub.filtered("deletedAt==null"),
    capitalSub: capitalSub.filtered("deletedAt==null"),
    addCapitalSub: addCapitalSub.filtered("deletedAt==null"),
    cashintotal,
    cashintotalfee,
    cashouttotal,
    cashouttotalfee,
  };
}

export function useTotalGcashCashBalance() {
  const { gcashSub, addCapitalSub } = useSubscribe();
  let totalCashBalance = addCapitalSub
    .filtered("category=='Cash'")
    .sum("amount");
  let totalGcashBalance = addCapitalSub
    .filtered("category=='Gcash'")
    .sum("amount");

  gcashSub.filter((row) => {
    if (row.isTransfer) {
      if (row.category == "Cash in") {
        totalGcashBalance += row.amount;
        totalCashBalance -= row.amount;
      } else {
        totalGcashBalance -= row.amount;
        totalCashBalance += row.amount;
      }

      if (row.payment == "PHP") {
        totalCashBalance -= row.fee;
      } else {
        totalGcashBalance -= row.fee;
      }
    } else {
      if (row.category == "Cash in" || row.category == "Load") {
        totalCashBalance += row.amount;
        totalGcashBalance -= row.amount;
      } else {
        totalCashBalance -= row.amount;
        totalGcashBalance += row.amount;
      }
      if (row.payment == "PHP") {
        totalCashBalance += row.fee;
      } else {
        totalGcashBalance += row.fee;
      }
    }
  });

  return { totalCashBalance, totalGcashBalance };
}
