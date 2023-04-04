const { v4 } = require('uuid');
const { Poll, User } = require('../db/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize');

exports.create = (req, res, next) => {
    if (req.body.title === undefined || req.body.options === undefined || req.body.double === undefined || req.body.multiple === undefined || req.body.multipleMax === undefined || req.body.user === undefined) {
        const message = 'Des données sont manquantes.';
        return res.status(401).json({ message });
    }

    User.findByPk(req.body.user)
        .then(user => {
            let userId = null;

            if (user === null && req.body.user !== null) {
                const message = "Aucun utilisateur trouvé.";
                return res.status(404).json({ message });
            }
            if (req.body.user !== null) {
                userId = user.id;
            }

            const id = v4();

            const poll = new Poll({
                id,
                userId,
                title: req.body.title,
                options: req.body.options,
                votePer: req.body.double,
                multipleOption : req.body.multiple,
                multipleMax : req.body.multipleMax,
            });

            poll.save()
                .then(() => {
                    const message = 'Sondage bien créé.';
                    if (userId === null) {
                        res.status(201).json({ message, data: id, log: false })
                    } else {
                        res.status(201).json({ message, data: id })
                    }
                })
                .catch(error => {
                    if (error instanceof ValidationError) {
                        return res.status(401).json({ message: error.message, data: error }); 
                    }
                    if (error instanceof UniqueConstraintError) {
                        return res.status(401).json({ message: error.message, data: error });
                    }
                    res.status(500).json({ message: "Une erreur est survenue lors de la création de l'utilisateur.", error });
                });
        })
        .catch(error => res.status(500).json({ message: error }));
};