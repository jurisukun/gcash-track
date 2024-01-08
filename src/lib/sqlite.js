import * as SQLite from "expo-sqlite";
import { format } from "date-fns";

const db = SQLite.openDatabase("mydatabase.db");

// Function to initialize the database
const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, date TEXT, amount NUMERIC, category TEXT CHECK (category IN ('Cash in', 'Cash out', 'Load', 'Others')));",
      [],
      () => {
        console.log("Database initialized");
      },
      (error) => {
        console.error("Error initializing database", error);
      }
    );
  });
};

const insertRecord = (data) => {
  return new Promise((resolve, reject) => {
    const { description, date, amount, category } = data;
    if (!description || !date || !amount || !category) {
      return false;
    }
    console.log("data", data);
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO transactions (description, date, amount, category) VALUES (?,?,?,?);",
        [description, format(date, "MMM dd, yyyy"), +amount, category],
        () => {
          console.log("Insertion successful");
          resolve("success");
        },
        (error) => {
          console.error("Error inserting new record", error);
          reject(error);
        }
      );
    });
  });
};

const getAllRecords = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM transactions;",
        [],
        (_, { rows }) => {
          if (rows) {
            console.log("Query successful");
            resolve(rows?._array);
          }
        },
        (error) => {
          console.error("Error querying database", error);
          reject(error);
        }
      );
    });
  });
};
export { db, initDatabase, insertRecord, getAllRecords };
