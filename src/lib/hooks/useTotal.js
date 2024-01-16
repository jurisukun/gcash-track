import { useQuery } from "@realm/react";

export function useTotal(Schema, realmField, isEqual, fieldName, sumOf) {
  const data = useQuery(Schema);
  let argument;
  if (isEqual) {
    argument = `${realmField + "=="} '${fieldName}'`;
  } else {
    argument = `${realmField + "!="} '${fieldName}'`;
  }
  let total;

  total = data.filtered(argument).filtered("isTransfer!=true").sum(sumOf);

  return total;
}

export function useTotalTransfer(
  Schema,
  realmField,
  isEqual,
  fieldName,
  sumOf
) {
  const data = useQuery(Schema);
  let argument;
  if (isEqual) {
    argument = `${realmField + "=="} '${fieldName}'`;
  } else {
    argument = `${realmField + "!="} '${fieldName}'`;
  }
  let total;

  total = data.filtered(argument).filtered("isTransfer==true").sum(sumOf);

  return total;
}
