const cron = require('node-cron');
const { Poll } = require('../db/sequelize');

const removeTempExp = () => {

    cron.schedule('0 22 * * *', () => {
       
        Poll.findAll({ where : { userId: null } })
            .then(polls => {
                if (polls !== null && polls.length > 0) {
                    const currentDate = Math.floor(Date.now() / 1000);

                    polls.forEach(el => {
                        const createdDate = Date.parse(el.createdAt) / 1000;
                        const expTime = currentDate - createdDate;

                        if (expTime > 85000) {
                            Poll.destroy({ where: { id: el.id } });
                        }
                    });
                }
            }) 
            
    });
};


module.exports = { removeTempExp };