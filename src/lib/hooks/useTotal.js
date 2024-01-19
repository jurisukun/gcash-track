import { useQuery } from "@realm/react";
import { Capital, GcashTransactions, CapitalTransactions } from "../realm";

export function useSubscribe() {
  const gcashSub = useQuery(GcashTransactions).sorted("date", true);
  const capitalSub = useQuery(CapitalTransactions).sorted("date", true);
  const addCapitalSub = useQuery(Capital).sorted("date", true);

  return {
    gcashSub: gcashSub.filtered("deletedAt==null"),
    capitalSub: capitalSub.filtered("deletedAt==null"),
    addCapitalSub: addCapitalSub.filtered("deletedAt==null"),
  };
}

export const useTotalCashinCashoutFees = () => {
  const { gcashSub } = useSubscribe();
  let cashintotal = 0;
  let cashintotalfee = 0;
  let cashouttotal = 0;
  let cashouttotalfee = 0;

  let cashfee = 0;
  let gcashfee = 0;

  let cashouttransfer = 0;
  let cashintransfer = 0;
  let gcashtransferfee = 0;
  let cashtransferfee = 0;

  gcashSub.filter((row) => {
    if (!row?.isTransfer && !row?.deletedAt) {
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
      if (row.payment == "PHP") {
        cashfee += row.fee;
      } else {
        gcashfee += row.fee;
      }
    } else if (row?.isTransfer && !row?.deletedAt) {
      if (row.category == "Cash in") {
        cashintransfer += row.amount;
      } else if (row.category == "Cash out") {
        cashouttransfer += row.amount;
      }

      if (row.payment == "PHP") {
        cashtransferfee += row.fee;
      } else if (row.payment == "Gcash") {
        gcashtransferfee += row.fee;
      }
    }
  });

  return {
    cashintotal,
    cashintotalfee,
    cashouttotal,
    cashouttotalfee,
    cashfee,
    gcashfee,
    cashouttransfer,
    cashintransfer,
    cashtransferfee,
    gcashtransferfee,
  };
};

export function useTotalGcashCashBalance() {
  const {
    cashouttotal,
    cashfee,
    gcashfee,
    cashouttransfer,
    cashintransfer,
    gcashtransferfee,
    cashtransferfee,
  } = useTotalCashinCashoutFees();

  const { addCapitalSub, capitalSub } = useSubscribe();
  let totalCashBalance = addCapitalSub
    .filtered("category=='Cash'")
    .sum("amount");
  let totalGcashBalance = addCapitalSub
    .filtered("category=='Gcash'")
    .sum("amount");

  let totalGcashDebt = capitalSub
    .filtered("category=='Gcash' AND  isPaid==true")
    .sum("amount");
  let totalCashDebt = capitalSub
    .filtered("category=='PHP' AND  isPaid==true")
    .sum("amount");

  totalGcashBalance =
    totalGcashBalance +
    cashouttotal -
    cashouttransfer -
    gcashtransferfee +
    gcashfee -
    totalGcashDebt;

  totalCashBalance =
    totalCashBalance +
    cashouttransfer -
    cashouttotal +
    cashfee -
    cashtransferfee -
    cashintransfer -
    totalCashDebt;

  return { totalCashBalance, totalGcashBalance };
}
