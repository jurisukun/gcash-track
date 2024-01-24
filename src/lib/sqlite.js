import { format } from "date-fns";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("mydatabase.db");

// Function to initialize the database
const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS gtrack (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT NOT NULL, date TEXT NOT NULL, amount NUMERIC  NOT NULL, fee NUMERIC NOT NULL, category TEXT  NOT NULL CHECK (category IN ('Cash in', 'Cash out', 'Load', 'Others')), payment TEXT  NOT NULL CHECK (payment IN ('PHP', 'Gcash')), load TEXT);",
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

const themeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS themesdb (id INTEGER PRIMARY KEY AUTOINCREMENT, userId TEXT NOT NULL, isDarkMode TEXT NOT NULL);",
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

const getTheme = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM themesdb WHERE userId = ?;",
        [userId],
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

const updateTheme = (userId, isDarkmode) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE themesdb SET isDarkmode = ? WHERE userId = ?;",
        [isDarkmode, userId],
        () => {
          resolve("success");
        },
        (error) => {
          console.error("error", error);
          reject(error);
        }
      );
    });
  });
};

const insertRecord = (data) => {
  return new Promise((resolve, reject) => {
    const { description, date, amount, category, fee, payment } = data;
    if (!description || !date || !amount || !category || !fee || !payment) {
      reject("Please fill all fields");
    }
    let sql;
    let params;
    let formatteddate = date.toString();
    if (category === "Load") {
      const { load } = data;
      sql =
        "INSERT INTO gtrack (description, date, amount, category, fee, load, payment) VALUES (?,?,?,?,?,?,?);";
      params = [
        description,
        formatteddate,
        +amount,
        category,
        +fee,
        load,
        payment,
      ];
    } else {
      sql =
        "INSERT INTO gtrack (description, date, amount, category, fee,payment) VALUES (?,?,?,?,?,?);";
      params = [description, formatteddate, +amount, category, +fee, payment];
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
    const { description, date, amount, category, fee, id, payment } = data;
    if (
      !description ||
      !date ||
      !amount ||
      !category ||
      !fee ||
      !id ||
      !payment
    ) {
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
        "UPDATE gtrack SET description = ?, date = ?, amount = ?, category = ?, fee = ?, load = ?, payment=? WHERE id = ?;";
      params = [description, date, +amount, category, +fee, load, payment, id];
    } else {
      sql =
        "UPDATE gtrack SET description = ?, date = ?, amount = ?, category = ?, fee = ?, load = ? , payment=? WHERE id = ?;";
      params = [description, date, +amount, category, +fee, "", payment, id];
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
            console.log("Query successful", rows);
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
export {
  db,
  initDatabase,
  insertRecord,
  editRecord,
  getAllRecords,
  themeDatabase,
  getTheme,
  updateTheme,
};
