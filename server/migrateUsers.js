import { DataTypes, Op } from 'sequelize';

// Preserve existing accounts and sessions when moving to the Users table.
// Table names are fixed constants, never supplied by a request.
export async function migrateUsers(db) {
  const query = db.getQueryInterface();
  const tables = await query.showAllTables();
  if (tables.includes('AdminUsers') && !tables.includes('Users')) {
    await query.renameTable('AdminUsers', 'Users');
  } else if (tables.includes('AdminUsers') && tables.includes('Users')) {
    // A development hot reload can create Users before the rename runs.
    // Merge records first, repair the session foreign key, then retire the old table.
    await db.transaction(async transaction => {
      const legacy = await query.select(null, 'AdminUsers', { transaction });
      for (const row of legacy) {
        const existing = await db.models.User.findOne({ where: { [Op.or]: [{ id: row.id }, { username: row.username }] }, transaction });
        if (existing) {
          if (existing.id !== row.id || existing.username !== row.username || existing.passwordHash !== row.passwordHash || existing.role !== row.role || existing.active !== Boolean(row.active)) throw Error('Conflicting legacy user accounts require manual reconciliation.');
        } else {
          await db.models.User.create(row, { transaction });
        }
      }
      if (tables.includes('AdminSessions')) {
        await query.changeColumn('AdminSessions', 'userId', { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' } }, { transaction });
      }
      await query.dropTable('AdminUsers', { transaction });
    });
  }
}
