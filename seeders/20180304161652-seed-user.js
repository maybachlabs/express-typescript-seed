'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User', [
        {
            id: '87cf44fe-cc1f-4fa7-a936-d15dbb122bcc',
            firstName: 'Test',
            lastName: 'Admin',
            email: 'test.admin@gmail.com',
            password: '$2a$10$xYkomxBysjVimxtP7flrTee/iiueeZp5e/FRmu9NKyTpeLpS7O43a',
            role: 'admin',
            creationDate: '1986-07-16 04:05:06',
            updatedOn: '1999-01-08 04:05:06'
        },
        {
            id: '436e49ad-3b04-40d6-b8da-f6d26f45ed17',
            firstName: 'Test',
            lastName: 'Member',
            email: 'test.member@gmail.com',
            password: '$2a$10$xYkomxBysjVimxtP7flrTee/iiueeZp5e/FRmu9NKyTpeLpS7O43a',
            role: 'member',
            creationDate: '1988-01-08 04:05:06',
            updatedOn: '1999-01-08 04:05:06'
        }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {});
  }
};
