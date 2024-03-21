import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabase('tasks.db');

export const dropTasksTable = () => {
  console.log('drop all');
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DROP TABLE IF EXISTS tasks',
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(new Error("Failed to drop tasks table: " + error.message));
        }
      );
    });
  });
};


export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS \
      tasks(\
        id INTEGER PRIMARY KEY AUTOINCREMENT,\
        name TEXT, \
        starttime DATETIME, \
        endtime TEXT, \
        repeatday INTEGER, \
        status INTEGER, \
        isnotification INTEGER \
        )'
    );
  });
};

export const loadNonCompletionTasks = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks WHERE status = 0',
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          reject(new Error("Failed to load tasks: " + error.message));
        }
      );
    });
  });
};

export const loadCompletedTasks = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks WHERE status = 1',
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          reject(new Error("Failed to load tasks: " + error.message));
        }
      );
    });
  });
};

export const loadTask = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM tasks WHERE id = ?`,
        [id],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          reject(new Error("Failed to delete a task: " + error.message));
        }
      );
    });
  });
};

export const deleteSelectedTask = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM tasks WHERE id = ?',
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(new Error("Failed to delete a task: " + error.message));
        }
      );
    });
  });
};

export const addTasks = (values) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        INSERT INTO tasks (name, starttime, endtime, repeatday, status, isnotification)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        values,
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(new Error("Failed to add a task: " + error.message));
        }
      );
    });
  });
};

export const updateCurrentTask = (values) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
      UPDATE tasks \
      SET name = ?, starttime = ?, endtime = ?, repeatday = ?, status = ? , isnotification = ?\
      WHERE id = ?
    `,
        values,
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(new Error("Failed to update task: " + error.message));
        }
      );
    });
  });
};

export const changeTaskStatus = (values) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        UPDATE tasks \
        SET status = ? \
        WHERE id = ?
        `,
        values,
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(new Error("Failed to change status: " + error.message));
        }
      );
    });
  });
};