const { v4 } = require('uuid');
const { User } = require('../db/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ValidationError, UniqueConstraintError } = require('sequelize');

/**
 * create one account
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.sign = (req, res, next) => {
    if (req.body.email === undefined || req.body.password === undefined) {
        const message = 'Des données sont manquantes.';
        return res.status(401).json({ message });
    }
    
    if (!req.body.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)) {
        const message = "Le mot de passe doit contenir minimun 1 lettre 1 chiffre 1 lettre majuscule et 8 caractères.";
        return res.status(401).json({ message });
    } else if (req.body.password === "") {
        const message = "Le mot de passe ne doit pas être vide.";
        return res.status(401).json({ message });
    } 

    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user !== null) {
                const message = "Un compte est déjà lié à cet email.";
                return res.status(401).json({ message });
            }

            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const user = new User({
                        id: v4(),
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
                    });

                    user.save()
                        .then(() => {
                            const message = "Utilisateur bien créer.";
                            res.status(201).json({ message });
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

/**
 * log one user
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.login = (req, res, next) => {
    if (req.body.email === undefined || req.body.password === undefined) {
        const message = 'Des données sont manquantes.';
        return res.status(401).json({ message });
    }
    
    if (!req.body.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)) {
        const message = "Le mot de passe doit contenir minimun 1 lettre 1 chiffre 1 lettre majuscule et 8 caractères.";
        return res.status(401).json({ message });
    } else if (!req.body.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
        const message = "L' email n'a pas un format valide.";
        return res.status(401).json({ message });
    } else if (req.body.password === "" || req.body.email === "") {
        const message = "Le mot de passe et l'email ne doivent pas être vides.";
        return res.status(401).json({ message });
    }

    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user === null) {
                const message = "Aucun utilisateur trouvé.";
                return res.status(404).json({ message });
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        const message = "Le mot de passe est incorrect.";
                        return res.status(401).json({ message });
                    }

                    const message = "Utilisateur connecté.";
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            { userId: user.id },
                            '' + process.env.VUE_APP_JWT_PRIVATE_KEY + '',
                            { expiresIn: '24h' }
                        ),
                        message,
                        username: user.username,
                    });
                })
                .catch(error => res.status(500).json({ message: error }));
        })
        .catch(error => res.status(500).json({ message: error }));
};