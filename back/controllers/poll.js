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
            let arr = [];
            
            for (let i = 0; i < req.body.options.length; i++) {
                arr.push('0');
            }

            const poll = new Poll({
                id,
                userId,
                title: req.body.title,
                options: req.body.options,
                results: arr,
                usersIp: [],
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

exports.getOne = (req, res, next) => {
    Poll.findByPk(req.params.id)
        .then(poll => {
            if (poll === null) {
                const message = "Aucun sondage trouvé.";
                return res.status(404).json({ message });
            }

            User.findByPk(poll.userId)
                .then(user => {
                    let username = null;

                    if (user !== null) {
                        username = user.username;
                    }

                    const message = "Un sondage a bien été trouvé.";
                    res.status(200).json({ message, data: poll, username });
                })
                .catch(error => res.status(500).json({ message: error }));
        })
        .catch(error => res.status(500).json({ message: error }));
};

exports.vote = (req, res, next) => {
    Poll.findByPk(req.params.id)
        .then(poll => {
            if (poll === null) {
                const message = "Aucun sondage trouvé.";
                return res.status(404).json({ message });
            }
            User.findByPk(req.body.userId)
                .then(user => {
                    if (user === null && poll.votePer === "account") {
                        const message = "Aucun utilisateur trouvé.";
                        return res.status(404).json({ message });
                    }
                    if (req.body.value === undefined) {
                        const message = "Valeur manquante.";
                        return res.status(401).json({ message });
                    }
                    if (poll.votePer === "ip" && poll.usersIp.includes(req.body.ip)) {
                        const message = "Un vote est déjà lié à cette adresse IP.";
                        return res.status(403).json({ message });
                    }
                    if (poll.votePer === "account" && poll.usersIp.includes(req.body.userId)) {
                        const message = "Un vote est déjà lié à ce compte.";
                        return res.status(403).json({ message });
                    }
                    if (poll.options[req.body.value] !== req.body.content) {
                        const message = "La valeur ne correspond pas.";
                        return res.status(401).json({ message });
                    }
                    if (poll.votePer === "ip") {
                        let ipArr = poll.usersIp;
                        
                        if (ipArr.length === 1 && ipArr[0] === "") {
                            ipArr[0] = req.body.ip;
                        } else {
                            ipArr.push(req.body.ip);
                        }

                        poll.usersIp = ipArr;
                    } else if (poll.votePer === "account") {
                        let idArr = poll.usersIp;
                        
                        if (idArr.length === 1 && idArr[0] === "") {
                            idArr[0] = req.body.userId;
                        } else {
                            idArr.push(req.body.userId);
                        }

                        poll.usersIp = idArr;
                    }
                    
                    let arr = [];
                    
                    for (let i = 0; i < poll.results.length; i++) {
                        console.log(i);
                        if ((req.body.value.indexOf(i) >= 0) === true) {
                            const val = parseInt(poll.results[i]) + 1;
                            arr.push(val.toString());    
                        } else {
                            arr.push(poll.results[i]);
                        }             
                    }

                    poll.results = arr;
                    poll.save()
                    .then(() => {
                        const message = "Vote bien pris en compte.";
                        res.status(200).json({ message, results: arr });
                    })
                    .catch(error => res.status(500).json({ message: error }));
                })
                .catch(error => res.status(500).json({ message: error }));
        })
        .catch(error => res.status(500).json({ message: error }));
};

exports.getAll = (req, res, next) => {
    Poll.findAll({ where : { userId: req.params.id } })
        .then(polls => {
            if (polls === null || polls.length === 0) {
                const message = "Aucun sondage trouvé.";
                return res.status(404).json({ message });
            }
            
            const message = "Des sondages ont été trouvés.";
            res.status(200).json({ message, data: polls });
        })
        .catch(error => res.status(500).json({ message: error }));
};

exports.acceptTemp = (req, res, next) => {
    console.log(req.body, req.params.id);
    Poll.findByPk(req.params.id)
        .then(poll => {
            if (poll === null) {
                const message = "Aucun sondage trouvé.";
                return res.status(404).json({ message });
            }
            User.findByPk(req.body.userId)
                .then(user => {
                    if (user === null) {
                        const message = "Aucun utilisateur trouvé.";
                        return res.status(404).json({ message });
                    }
                    
                    poll.userId = user.id;

                    poll.save()
                        .then(() => {
                            const message = "Sondage bien modifié.";
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
                .catch(error => res.status(500).json({ message: error }));
        })
        .catch(error => res.status(500).json({ message: error }));
};

exports.deleteTemp = (req, res, next) => {
    Poll.findByPk(req.params.id)
        .then(poll => {
            if (poll === null) {
                const message = "Aucun sondage trouvé.";
                return res.status(404).json({ message });
            }

            Poll.destroy({ where: { id: req.params.id } })
                .then(() => {
                    const message = "sondage supprimé.";
                    res.status(201).json({ message });
                })
                .catch(error => res.status(500).json({ message: error }));
        })
        .catch(error => res.status(500).json({ message: error }));
};