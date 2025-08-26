"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("SuperAdmin", [
      {
        name: "Super Admin",
        email: "superadmin@katralinfo.com",
        password: "12345",
        role:'superadmin'
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("SuperAdmin", {
      email: "superadmin@katralinfo.com",
    });
  },
};
