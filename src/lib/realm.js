import { Realm, createRealmContext } from "@realm/react";

export class GcashTransactions extends Realm.Object {
  static generate({
    description,
    amount,
    fee,
    date,
    category,
    load,
    isTransfer,
    payment,
    userId,
  }) {
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
      userId,
      isTransfer,
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: userId,
    };
  }

  static schema = {
    name: "GcashTransactions",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      description: "string",
      amount: "double",
      fee: "double?",
      date: "date",
      category: {
        type: "string",
        optional: false,
      },
      isTransfer: "bool?",
      load: { type: "string", optional: true },
      payment: { type: "string", optional: false },
      userId: "string",
      createdAt: "date",
      updatedAt: {
        type: "date",
        default: () => new Date(),
      },
      updatedBy: "string",
      deletedBy: "string?",
      deletedAt: "date?",
    },
  };
}

export class CapitalTransactions extends Realm.Object {
  static generate({ description, amount, date, category, isPaid, userId }) {
    return {
      _id: new Realm.BSON.ObjectId(),
      description,
      amount: +amount,
      date,
      category,
      isPaid,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: userId,
    };
  }

  static schema = {
    name: "CapitalTransactions",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      description: "string",
      amount: "double",
      date: "date",
      category: "string?",
      isPaid: { type: "bool", default: false },
      userId: "string",
      createtedAt: "date",
      updatedAt: {
        type: "date",
        default: () => new Date(),
      },
      updatedBy: "string",
      deletedBy: "string?",
      deletedAt: "date?",
    },
  };
}

export class Capital extends Realm.Object {
  static generate({ description, amount, userId, category }) {
    return {
      _id: new Realm.BSON.ObjectId(),
      userId,
      description,
      amount: +amount,
      category,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: userId,
    };
  }

  static schema = {
    name: "Capital",
    primaryKey: "_id",
    properties: {
      _id: "objectId",

      userId: "string",
      amount: "double",
      description: "string",
      category: "string",
      date: "date",
      createdAt: "date",
      updatedAt: {
        type: "date",
        default: () => new Date(),
      },
      updatedBy: "string",
      deletedBy: "string?",
      deletedAt: "date?",
    },
  };
}

export class CustomUserData extends Realm.Object {
  static generate({ firstName, lastName, userId }) {
    return {
      _id: new Realm.BSON.ObjectId(),
      userId,
      firstName,
      lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static schema = {
    name: "CustomUserData",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      firstName: "string",
      lastName: "string",
      userId: "string",
      createdAt: "date",
      updatedAt: {
        type: "date",
        default: () => new Date(),
      },
      deletedBy: "string?",
      deletedAt: "date?",
    },
  };
}

const config = {
  schema: [GcashTransactions, CapitalTransactions, Capital, CustomUserData],
  schemaVersion: 7,
};

createRealmContext(config);
