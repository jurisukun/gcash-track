import { Realm, createRealmContext } from "@realm/react";

export class GcashTransactions extends Realm.Object {
  static generate({
    description,
    amount,
    fee,
    date,
    category,
    load,
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
      createdAt: new Date(),
      updatedAt: new Date(),
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
      load: { type: "string", optional: true },
      payment: { type: "string", optional: false },
      userId: "string",
      updatedAt: {
        type: "date",
        default: () => new Date(),
      },
    },
  };
}

export class CapitalTransactions extends Realm.Object {
  static generate({ description, amount, date, userId }) {
    return {
      _id: new Realm.BSON.ObjectId(),
      description,
      amount: +amount,
      date,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      category: "string",
      userId: "string",
      updatedAt: {
        type: "date",
        default: () => new Date(),
      },
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
      createdAt: new Date(),
      updatedAt: new Date(),
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
      updatedAt: {
        type: "date",
        default: () => new Date(),
      },
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
      updatedAt: {
        type: "date",
        default: () => new Date(),
      },
    },
  };
}

// const config = {
//   schema: [GcashTransactions],
//   schemaVersion: 3,
// };
// // pass the configuration object with the updated 'schemaVersion' to
// // createRealmContext()
// const { RealmProvider } = createRealmContext(config);
