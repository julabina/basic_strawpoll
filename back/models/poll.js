module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Poll', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: {msg: "L'id ne doit pas etre vide."},
                notNull: {msg: "L'id est une propriétée requise."}
            }
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {msg: "Le titre ne doit pas etre vide."},
                notNull: {msg: "Le titre est une propriétée requise."},
                is: {
                    args : /^[\w éèêëàâäîïçù\,\.\?\!\€\$\"\'\-\(\)]*$/i ,
                    msg: "Format d'email non valide."
                }
            }
        },
        options: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                return this.getDataValue('options').split(',')
            },
            set(options) {
                this.setDataValue('options', options.join())
            }
        },
        results: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                return this.getDataValue('results').split(',')
            },
            set(results) {
                this.setDataValue('results', results.join())
            }
        },
        votePer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        multipleOption: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        multipleMax: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },{
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });
};