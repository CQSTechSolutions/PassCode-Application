import * as SQLite from 'expo-sqlite';

// Open the database
const db = SQLite.openDatabaseAsync('accounts.db');

// Initialize database
export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // Create Revenues table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS revenues (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source TEXT NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          gross_profit REAL NOT NULL
        )`,
        [],
        () => {},
        (_, error): boolean => {
          console.error('Error creating revenues table', error);
          reject(error);
          return false;
        }
      );

      // Create Expenses table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          description TEXT
        )`,
        [],
        () => {},
        (_, error): boolean => {
          console.error('Error creating expenses table', error);
          reject(error);
          return false;
        }
      );

      // Create Provisions table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS provisions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          status TEXT NOT NULL
        )`,
        [],
        () => {},
        (_, error): boolean => {
          console.error('Error creating provisions table', error);
          reject(error);
          return false;
        }
      );

      // Create Advances table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS advances (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          type TEXT NOT NULL
        )`,
        [],
        () => {},
        (_, error): boolean => {
          console.error('Error creating advances table', error);
          reject(error);
          return false;
        }
      );

      // Create Liabilities table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS liabilities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          dueDate TEXT NOT NULL,
          type TEXT NOT NULL
        )`,
        [],
        () => {},
        (_, error): boolean => {
          console.error('Error creating liabilities table', error);
          reject(error);
          return false;
        }
      );

      // Create Clients table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS clients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          company TEXT,
          address TEXT,
          joinedDate TEXT
        )`,
        [],
        () => {},
        (_, error): boolean => {
          console.error('Error creating clients table', error);
          reject(error);
          return false;
        }
      );

      // Create Projects table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          client TEXT NOT NULL,
          startDate TEXT NOT NULL,
          endDate TEXT,
          status TEXT NOT NULL,
          budget REAL,
          description TEXT
        )`,
        [],
        () => {},
        (_, error): boolean => {
          console.error('Error creating projects table', error);
          reject(error);
          return false;
        }
      );
    }, 
    (error) => {
      console.error('Transaction error:', error);
      reject(error);
    },
    () => {
      console.log('Database initialized successfully');
      resolve();
    });
  });
};

// Insert sample data if tables are empty
export const insertSampleData = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // Check if revenues table is empty and insert sample data if needed
      tx.executeSql(
        'SELECT COUNT(*) as count FROM revenues',
        [],
        (_, { rows }) => {
          if (rows.item(0).count === 0) {
            tx.executeSql(
              `INSERT INTO revenues (source, amount, date, gross_profit) VALUES 
               ('Client Project', 50000, '2023-10-15', 35000),
               ('Consulting', 30000, '2023-10-20', 25000)`,
              [],
              () => console.log('Sample revenues inserted'),
              (_, error): boolean => {
                console.error('Error inserting sample revenues', error);
                return false;
              }
            );
          }
        }
      );

      // Check if expenses table is empty and insert sample data if needed
      tx.executeSql(
        'SELECT COUNT(*) as count FROM expenses',
        [],
        (_, { rows }) => {
          if (rows.item(0).count === 0) {
            tx.executeSql(
              `INSERT INTO expenses (category, amount, date, description) VALUES 
               ('Office Supplies', 5000, '2023-10-10', 'Monthly office supplies'),
               ('Software Subscriptions', 10000, '2023-10-05', 'Annual software licenses')`,
              [],
              () => console.log('Sample expenses inserted'),
              (_, error): boolean => {
                console.error('Error inserting sample expenses', error);
                return false;
              }
            );
          }
        }
      );

      // Check if provisions table is empty and insert sample data if needed
      tx.executeSql(
        'SELECT COUNT(*) as count FROM provisions',
        [],
        (_, { rows }) => {
          if (rows.item(0).count === 0) {
            tx.executeSql(
              `INSERT INTO provisions (title, amount, date, status) VALUES 
               ('Tax Provision', 15000, '2023-10-01', 'Active'),
               ('Insurance Provision', 8000, '2023-11-15', 'Pending')`,
              [],
              () => console.log('Sample provisions inserted'),
              (_, error): boolean => {
                console.error('Error inserting sample provisions', error);
                return false;
              }
            );
          }
        }
      );

      // Check if advances table is empty and insert sample data if needed
      tx.executeSql(
        'SELECT COUNT(*) as count FROM advances',
        [],
        (_, { rows }) => {
          if (rows.item(0).count === 0) {
            tx.executeSql(
              `INSERT INTO advances (title, amount, date, type) VALUES 
               ('Client XYZ Advance', 25000, '2023-09-15', 'Received'),
               ('Vendor ABC Advance', 12000, '2023-10-20', 'Paid')`,
              [],
              () => console.log('Sample advances inserted'),
              (_, error): boolean => {
                console.error('Error inserting sample advances', error);
                return false;
              }
            );
          }
        }
      );

      // Check if liabilities table is empty and insert sample data if needed
      tx.executeSql(
        'SELECT COUNT(*) as count FROM liabilities',
        [],
        (_, { rows }) => {
          if (rows.item(0).count === 0) {
            tx.executeSql(
              `INSERT INTO liabilities (title, amount, dueDate, type) VALUES 
               ('Bank Loan', 250000, '2024-06-30', 'Long-term'),
               ('Vendor Payment', 45000, '2023-11-15', 'Short-term')`,
              [],
              () => console.log('Sample liabilities inserted'),
              (_, error): boolean => {
                console.error('Error inserting sample liabilities', error);
                return false;
              }
            );
          }
        }
      );

      // Check if clients table is empty and insert sample data if needed
      tx.executeSql(
        'SELECT COUNT(*) as count FROM clients',
        [],
        (_, { rows }) => {
          if (rows.item(0).count === 0) {
            tx.executeSql(
              `INSERT INTO clients (name, email, phone, company, address, joinedDate) VALUES 
               ('John Smith', 'john.smith@abccorp.com', '+1-555-123-4567', 'ABC Corporation', '123 Business Ave, New York, NY 10001', '2023-01-15'),
               ('Sarah Johnson', 'sarah.j@xyzindustries.com', '+1-555-987-6543', 'XYZ Industries', '456 Corporate Blvd, Chicago, IL 60601', '2023-03-22'),
               ('Michael Brown', 'michael@localbusiness.com', '+1-555-456-7890', 'Local Business', '789 Main St, Boston, MA 02108', '2023-05-10'),
               ('Emily Davis', 'emily@techstart.io', '+1-555-789-0123', 'Tech Start', '321 Innovation Way, San Francisco, CA 94107', '2023-07-08')`,
              [],
              () => console.log('Sample clients inserted'),
              (_, error): boolean => {
                console.error('Error inserting sample clients', error);
                return false;
              }
            );
          }
        }
      );

      // Check if projects table is empty and insert sample data if needed
      tx.executeSql(
        'SELECT COUNT(*) as count FROM projects',
        [],
        (_, { rows }) => {
          if (rows.item(0).count === 0) {
            tx.executeSql(
              `INSERT INTO projects (name, client, startDate, endDate, status, budget, description) VALUES 
               ('Website Redesign', 'ABC Corporation', '2023-09-01', '2023-12-31', 'in-progress', 75000, 'Complete redesign of corporate website'),
               ('Mobile App Development', 'XYZ Industries', '2023-10-15', '2024-03-31', 'planning', 120000, 'Development of iOS and Android mobile applications'),
               ('SEO Optimization', 'Local Business', '2023-08-15', '2023-11-15', 'completed', 25000, 'Search engine optimization campaign')`,
              [],
              () => console.log('Sample projects inserted'),
              (_, error): boolean => {
                console.error('Error inserting sample projects', error);
                return false;
              }
            );
          }
        }
      );
    },
    (error) => {
      console.error('Sample data transaction error:', error);
      reject(error);
    },
    () => {
      console.log('Sample data inserted successfully');
      resolve();
    });
  });
};

// REVENUES OPERATIONS
export const getRevenuesFromDB = () => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM revenues ORDER BY date DESC',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error): boolean => {
          console.error('Error fetching revenues', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const addRevenueToDB = (revenue: { source: string; amount: number; date: string; gross_profit: number }) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO revenues (source, amount, date, gross_profit) VALUES (?, ?, ?, ?)',
        [revenue.source, revenue.amount, revenue.date, revenue.gross_profit],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error): boolean => {
          console.error('Error adding revenue', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updateRevenueInDB = (id: number, revenue: { source: string; amount: number; date: string; gross_profit: number }) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE revenues SET source = ?, amount = ?, date = ?, gross_profit = ? WHERE id = ?',
        [revenue.source, revenue.amount, revenue.date, revenue.gross_profit, id],
        () => {
          resolve();
        },
        (_, error): boolean => {
          console.error('Error updating revenue', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteRevenueFromDB = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM revenues WHERE id = ?',
        [id],
        () => {
          resolve();
        },
        (_, error): boolean => {
          console.error('Error deleting revenue', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// EXPENSES OPERATIONS
export const getExpensesFromDB = () => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM expenses ORDER BY date DESC',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error): boolean => {
          console.error('Error fetching expenses', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const addExpenseToDB = (expense: { category: string; amount: number; date: string; description: string }) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO expenses (category, amount, date, description) VALUES (?, ?, ?, ?)',
        [expense.category, expense.amount, expense.date, expense.description],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error): boolean => {
          console.error('Error adding expense', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updateExpenseInDB = (id: number, expense: { category: string; amount: number; date: string; description: string }) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE expenses SET category = ?, amount = ?, date = ?, description = ? WHERE id = ?',
        [expense.category, expense.amount, expense.date, expense.description, id],
        () => {
          resolve();
        },
        (_, error): boolean => {
          console.error('Error updating expense', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteExpenseFromDB = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM expenses WHERE id = ?',
        [id],
        () => {
          resolve();
        },
        (_, error): boolean => {
          console.error('Error deleting expense', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// FINANCIAL SUMMARY OPERATIONS
export const getFinancialSummary = () => {
  return new Promise<{totalRevenue: number, totalExpenses: number, netProfit: number}>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT SUM(gross_profit) as totalRevenue FROM revenues',
        [],
        (_, { rows }) => {
          const totalRevenue = rows.item(0).totalRevenue || 0;
          
          tx.executeSql(
            'SELECT SUM(amount) as totalExpenses FROM expenses',
            [],
            (_, { rows }) => {
              const totalExpenses = rows.item(0).totalExpenses || 0;
              const netProfit = totalRevenue - totalExpenses;
              
              resolve({
                totalRevenue,
                totalExpenses,
                netProfit
              });
            },
            (_, error): boolean => {
              console.error('Error getting expenses sum', error);
              reject(error);
              return false;
            }
          );
        },
        (_, error): boolean => {
          console.error('Error getting revenues sum', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// CLIENTS OPERATIONS
export const getClientsFromDB = () => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM clients ORDER BY name',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error): boolean => {
          console.error('Error fetching clients', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const addClientToDB = (client: { name: string; email: string; phone: string; company: string; address: string; joinedDate: string }) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO clients (name, email, phone, company, address, joinedDate) VALUES (?, ?, ?, ?, ?, ?)',
        [client.name, client.email, client.phone, client.company, client.address, client.joinedDate],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error): boolean => {
          console.error('Error adding client', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updateClientInDB = (id: number, client: { name: string; email: string; phone: string; company: string; address: string; joinedDate: string }) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE clients SET name = ?, email = ?, phone = ?, company = ?, address = ?, joinedDate = ? WHERE id = ?',
        [client.name, client.email, client.phone, client.company, client.address, client.joinedDate, id],
        () => {
          resolve();
        },
        (_, error): boolean => {
          console.error('Error updating client', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteClientFromDB = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM clients WHERE id = ?',
        [id],
        () => {
          resolve();
        },
        (_, error): boolean => {
          console.error('Error deleting client', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// PROJECTS OPERATIONS
export const getProjectsFromDB = () => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM projects ORDER BY startDate DESC',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error): boolean => {
          console.error('Error fetching projects', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const addProjectToDB = (project: { name: string; client: string; startDate: string; endDate: string; status: string; budget: number; description: string }) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO projects (name, client, startDate, endDate, status, budget, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [project.name, project.client, project.startDate, project.endDate, project.status, project.budget, project.description],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error): boolean => {
          console.error('Error adding project', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updateProjectInDB = (id: number, project: { name: string; client: string; startDate: string; endDate: string; status: string; budget: number; description: string }) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE projects SET name = ?, client = ?, startDate = ?, endDate = ?, status = ?, budget = ?, description = ? WHERE id = ?',
        [project.name, project.client, project.startDate, project.endDate, project.status, project.budget, project.description, id],
        () => {
          resolve();
        },
        (_, error): boolean => {
          console.error('Error updating project', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteProjectFromDB = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM projects WHERE id = ?',
        [id],
        () => {
          resolve();
        },
        (_, error): boolean => {
          console.error('Error deleting project', error);
          reject(error);
          return false;
        }
      );
    });
  });
}; 