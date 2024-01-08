import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydatabase.db');

// Function to initialize the database
const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS gcash (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, date TEXT, amount NUMERIC, category TEXT CHECK (category IN ('cashin', 'cashout', 'load', 'others')));",
      [],
      () => {
        console.log('Database initialized');
      },
      error => {
        console.error('Error initializing database', error);
      }
    );

  });
};

const insertRecord=(data)=>{
  const {description, date, amount, type} = data;
  if(!description || !date || !amount || !type){
    return false;
  }
  db.transaction(tx => {
    tx.executeSql(
      "INSERT INTO gcash (description, date, amount, type) VALUES (?,?,?,?);",
      [description, date, amount, type],
      () => {
        console.log('Insertion successful');
      },
      error => {
        console.error('Error inserting new record', error);
      }
    );

  });
}
const getAllRecords = () => {
  db.transaction(tx => {
    tx.executeSql("SELECT * FROM gcash;", [], (_, { rows }) =>{
      console.log('Query successful');
      console.log(rows);
      return rows;
    })
  })
}
export { db, initDatabase, insertRecord, getAllRecords };
