import { useQuery } from "@realm/react";
import { Capital, GcashTransactions } from "../realm";

export function useTotalGcashCashBalance(balance) {
  const isGcash = balance === "Gcash";
  const capital = useQuery(Capital);
  const gcash = useQuery(GcashTransactions);
  let c = isGcash ? "category == 'Cash in'" : "category != 'Cash in'";
  let d = isGcash ? "payment == 'Gcash'" : "payment != 'Gcash'";

  let e = isGcash ? "category == 'Cash in'" : "category == 'Cash out'";
  let f = isGcash ? "payment == 'Gcash'" : "payment != 'Gcash'";

  let g = isGcash ? "category == 'Cash out'" : "category == 'Cash in'";

  const totalAmountDeduction = gcash
    .filtered(c)
    .filtered("isTransfer!=true")
    .sum("amount");
  const totalFeeAddition = gcash
    .filtered(d)
    .filtered("isTransfer!=true")
    .sum("fee");

  const totalTransfer = gcash
    .filtered(e)
    .filtered("isTransfer==true")
    .sum("amount");
  const totalTransFerDeduction = gcash
    .filtered("isTransfer==true")
    .filtered(g)
    .sum("amount");
  const totalTransferFee = gcash
    .filtered(f)
    .filtered("isTransfer==true")
    .sum("fee");

  const filteredCapital = capital
    .filtered(`category == "${balance}"`)
    .sum("amount");

  const total =
    filteredCapital -
    totalAmountDeduction +
    totalFeeAddition +
    totalTransfer -
    totalTransFerDeduction -
    totalTransferFee;

  return total;
}
