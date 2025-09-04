import "dotenv/config";
import { DB } from "../src/config/db";
import { User } from "../src/models/User";

import { hashSync } from "bcryptjs";
import { faker } from "@faker-js/faker";

(async () => {
  await DB.connect();

  await Promise.all([
    User.deleteMany({}),
    // Department.deleteMany({}),
    // Nurse.deleteMany({}),
    // ShiftTemplate.deleteMany({}),
    // ConfigRules.deleteMany({}),
  ]);

  await User.create({
    email: "admin@hospital.local",
    passwordHash: hashSync("password", 10),
    role: "admin",
    active: true,
  });

  //   const departments = await Department.insertMany([
  //     { name: "ICU",        code: "ICU", minStaffPerShift: 3 },
  //     { name: "Emergency",  code: "ER",  minStaffPerShift: 4 },
  //     { name: "Pediatrics", code: "PED", minStaffPerShift: 3 },
  //   ]);

  //   await ShiftTemplate.create({ name: "Day 07-19",   startHour: 7,  endHour: 19, durationHours: 12 });
  //   await ShiftTemplate.create({ name: "Night 19-07", startHour: 19, endHour: 7,  durationHours: 12 });

  //   await ConfigRules.create({});

  //   const users = await User.insertMany(
  //     Array.from({ length: 30 }).map(() => ({
  //       email: faker.internet.email().toLowerCase(),
  //       passwordHash: hashSync("password", 10),
  //       role: "nurse",
  //       active: true,
  //     }))
  //   );

  //   await Nurse.insertMany(users.map((u, i) => {
  //     const dept = departments[i % departments.length];
  //     return {
  //       userId: u._id,
  //       name: faker.person.fullName(),
  //       departmentId: dept._id,
  //       grade: faker.helpers.arrayElement(["RN", "SRN", "EN"]),
  //       skills: faker.helpers.arrayElements(["ICU","PEDS","ER","Dialysis","Theatre"], { min: 1, max: 3 }),
  //       consecutiveNightShifts: faker.number.int({ min: 0, max: 5 }),
  //       sickLeavesLast3Months: faker.number.int({ min: 0, max: 4 }),
  //       totalHoursWorkedThisWeek: faker.number.int({ min: 30, max: 70 }),
  //       daysOffBetweenShifts: faker.number.int({ min: 0, max: 2 }),
  //     };
  //   }));

//   console.log("Seeded admin, departments, nurses, templates, rules.");
  console.log("Seeded admin, departments, nurses, templates, rules.");
  process.exit(0);
})();
