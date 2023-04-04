module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: {msg: "L'id ne doit pas etre vide."},
                notNull: {msg: "L'id est une propriétée requise."}
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {msg: "Le pseudo ne doit pas etre vide."},
                notNull: {msg: "Le pseudo est une propriétée requise."},
                is: {
                    args : /^[\w]*$/i ,
                    msg: "Le pseudo ne doit contenir que des lettres ou des chiffres."
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "Un compte est déja lié à cet email."
            },
            validate: {
                notEmpty: {msg: "L'email ne doit pas etre vide."},
                notNull: {msg: "L'email est une propriétée requise."},
                is: {
                    args : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i ,
                    msg: "Format d'email non valide."
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Le mot de passe ne doit pas être vide." }
            }
        },
    },{
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });
};