"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("SuperAdmin", [
      {
        name: "Super Admin",
        email: "superadmin@example.com",
        password: "12345",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("SuperAdmin", {
      email: "superadmin@example.com",
    });
  },
};
