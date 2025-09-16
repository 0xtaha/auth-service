// MongoDB initialization script
db = db.getSiblingDB('auth-app');

// Create collections
db.createCollection('users');
db.createCollection('logs');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.logs.createIndex({ timestamp: -1 });
db.logs.createIndex({ level: 1 });
db.logs.createIndex({ userId: 1 });

print('Database initialized successfully');