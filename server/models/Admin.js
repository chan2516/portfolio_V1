import { DataTypes } from 'sequelize';

export function defineAdminModels(db) {
  const User = db.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { is: /^[a-z0-9][a-z0-9._-]{2,63}$/ } },
    passwordHash: { type: DataTypes.STRING, allowNull: false, validate: { is: /^[a-f0-9]{32}:[a-f0-9]{128}$/ } },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin', validate: { isIn: [['owner', 'admin']] } },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, { tableName: 'Users' });
  const Session = db.define('AdminSession', {
    tokenHash: { type: DataTypes.STRING, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  });
  return { User, Session };
}
