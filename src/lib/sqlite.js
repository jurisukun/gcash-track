import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("mydatabase.db");

// Function to initialize the database
const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS gtrack (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, date TEXT, amount NUMERIC, fee NUMERIC, category TEXT CHECK (category IN ('Cash in', 'Cash out', 'Load', 'Others')), load TEXT);",
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
    const { description, date, amount, category, fee } = data;
    if (!description || !date || !amount || !category || !fee) {
      reject("Please fill all fields");
    }
    let sql;
    let params;
    if (category === "Load") {
      const { load } = data;
      sql =
        "INSERT INTO gtrack (description, date, amount, category, fee, load) VALUES (?,?,?,?,?,?);";
      params = [description, date, +amount, category, +fee, load];
    } else {
      sql =
        "INSERT INTO gtrack (description, date, amount, category, fee) VALUES (?,?,?,?,?);";
      params = [description, date, +amount, category, +fee];
    }
    console.log(sql, params);
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, { insertId }) => {
          console.log(insertId);
          console.log("Insertion successful");
          resolve(insertId);
        },
        (error) => {
          console.error("Error inserting new record", error);
          reject(error);
        }
      );
    });
  });
};

const editRecord = (data) => {
  return new Promise((resolve, reject) => {
    const { description, date, amount, category, fee, id } = data;
    if (!description || !date || !amount || !category || !fee || !id) {
      reject("Please fill all fields");
    }
    let sql;
    let params;
    if (category === "Load") {
      const { load } = data;
      if (!load) {
        reject("Please select network");
      }
      sql =
        "UPDATE gtrack SET description = ?, date = ?, amount = ?, category = ?, fee = ?, load = ? WHERE id = ?;";
      params = [description, date, +amount, category, +fee, load, id];
    } else {
      sql =
        "UPDATE gtrack SET description = ?, date = ?, amount = ?, category = ?, fee = ?, load = ? WHERE id = ?;";
      params = [description, date, +amount, category, +fee, "", id];
    }

    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        () => {
          console.log("Update successful");
          resolve("success");
        },
        (error) => {
          console.error("Error updating new record", error);
          reject(error);
        }
      );
    });
  });
};

export const getRecordsBCategory = (category) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM gtrack WHERE category = ?;",
        [category],
        (_, { rows }) => {
          if (rows) {
            console.log("Query successful");
            resolve(rows?._array);
          } else {
            reject("No records found");
          }
        }
      );
    });
  });
};

const getAllRecords = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM gtrack;",
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
export { db, initDatabase, insertRecord, editRecord, getAllRecords };
