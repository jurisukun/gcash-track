import { Realm } from "@realm/react";

export class GcashTransactions extends Realm.Object {
  static generate({ description, amount, fee, date, category, load, payment }) {
    function validate() {
      // Validate 'category' field against the allowed values
      if (
        category &&
        !["Cash in", "Cash out", "Load", "Others"].includes(category)
      ) {
        throw new Error(`Invalid category value: ${category}`);
      }
      if (load && !["Globe", "Others"].includes(load)) {
        throw new Error(`Invalid load value: ${load}`);
      }
      if (payment && !["PHP", "Gcash"].includes(payment)) {
        throw new Error(`Invalid payment value: ${payment}`);
      }
    }
    validate();
    return {
      _id: new Realm.BSON.ObjectId(),
      description,
      amount: +amount,
      fee: +fee,
      date,
      category,
      load,
      payment,
      createdAt: new Date(),
    };
  }

  static schema = {
    name: "GcashTransactions",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      description: "string",
      amount: "double",
      fee: "double",
      date: "date",
      category: {
        type: "string",
        optional: false,
      },
      load: { type: "string", optional: false },
      payment: { type: "string", optional: false },
      createdAt: "date",
    },
  };
}
