import { useQuery } from "@realm/react";
import {
  Capital,
  GcashTransactions,
  CapitalTransactions,
  ProfileImage,
} from "../realm";
import { useMemo } from "react";
import { format, getMonth } from "date-fns";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export function useSubscribe() {
  const gcashSub = useQuery(GcashTransactions).sorted("date", false);
  const capitalSub = useQuery(CapitalTransactions).sorted("date", true);
  const addCapitalSub = useQuery(Capital).sorted("date", true);
  const profilePicSub = useQuery(ProfileImage).filtered("deletedAt==null");

  return {
    gcashSub: gcashSub.filtered("deletedAt==null"),
    capitalSub: capitalSub.filtered("deletedAt==null"),
    addCapitalSub: addCapitalSub.filtered("deletedAt==null"),
    profilePicSub,
  };
}

export const useTotalCashinCashoutFees = () => {
  const { gcashSub, addCapitalSub } = useSubscribe();
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

  let totalCashBalance = addCapitalSub
    .filtered("category=='Cash'")
    .sum("amount");
  let totalGcashBalance = addCapitalSub
    .filtered("category=='Gcash'")
    .sum("amount");

  let monthlyStats = [];

  // console.log("------------start---------------");
  // console.log("Gcash-", totalGcashBalance, "Cash-", totalCashBalance);
  let month;
  let prevmonth = "January";
  useMemo(() => {
    gcashSub.filter((row, index) => {
      // let st = ""
      month = format(getMonth(row.date), "MMMM");

      if (!row?.isTransfer && !row?.deletedAt) {
        // st +=
        //   row.description +
        //   " " +
        //   row.category +
        //   " " +
        //   row.amount +
        //   " " +
        //   row.fee +
        //   " " +
        // row.payment;
        if (row.category == "Cash in" || row.category == "Load") {
          totalGcashBalance -= row.amount;
          totalCashBalance += row.amount;
          cashintotal += row.amount;
          cashintotalfee += row.fee;
        } else if (row.category != "Cash in" || row.category != "Load") {
          totalGcashBalance += row.amount;
          totalCashBalance -= row.amount;
          cashouttotal += row.amount;
          cashouttotalfee += row.fee;
        }
        if (row.payment == "PHP") {
          totalCashBalance += row.fee;
          cashfee += row.fee;
        } else if (row.payment == "Gcash") {
          totalGcashBalance += row.fee;
          gcashfee += row.fee;
        }
      } else if (row?.isTransfer && !row?.deletedAt) {
        // console.log("transfer", row.category, row.amount, row.fee);
        if (row.category == "Cash in") {
          totalCashBalance += row.amount;
          cashintransfer += row.amount;
        } else if (row.category == "Cash out") {
          totalGcashBalance -= row.amount;
          totalCashBalance += row.amount;
          cashouttransfer += row.amount;
        }

        if (row.payment == "PHP") {
          cashtransferfee += row.fee;
          totalCashBalance -= row.fee;
        } else if (row.payment == "Gcash") {
          gcashtransferfee += row.fee;
          totalGcashBalance -= row.fee;
        }
      }
      let monthIndex = monthlyStats.findIndex((item) => item.month == month);
      if (monthIndex !== -1) {
        monthlyStats[monthIndex] = {
          month,
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
      } else {
        monthlyStats.push({
          month,
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
        });
      }

      if (month != prevmonth) {
        prevmonth = month;
        cashintotal = 0;
        cashintotalfee = 0;
        cashouttotal = 0;
        cashouttotalfee = 0;

        cashfee = 0;
        gcashfee = 0;

        cashouttransfer = 0;
        cashintransfer = 0;
        gcashtransferfee = 0;
        cashtransferfee = 0;
      }

      // console.log(st);
      // console.log("Gcash-", totalGcashBalance, "Cash-", totalCashBalance);
      // console.log("\n");
    });
  }, [gcashSub]);

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
    totalCashBalance,
    totalGcashBalance,
    monthlyStats,
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
    cashintotal,
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
    cashintransfer +
    cashouttotal +
    gcashfee -
    (totalGcashDebt + cashouttransfer + gcashtransferfee);

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
