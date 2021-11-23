module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
            id: {
                type: DataTypes.CHAR(20),
                primaryKey: true
            },
            password: {
                type: DataTypes.STRING(20)
            },
            names: {
                type: DataTypes.STRING(5)
            },
            email: {
                type: DataTypes.STRING(20)
            },
            img: {
                type: DataTypes.CHAR(255)
            },
     
        },
        {
            createdAt: false,
            updatedAt: false,
            tableName: "users"
        });
};
