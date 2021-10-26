module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
            id: {
                type: DataTypes.CHAR(12),
                primaryKey: true
            },
            password: {
                type: DataTypes.STRING(255)
            }
     
        },
        {
            createdAt: false,
            updatedAt: false,
            tableName: "users"
        });
};
