import { prisma } from "../utils/prisma.js";

async function seedRoles(req, res) {
  try {
    const roles = ["ADMIN", "SELLER", "USER"];

    for (const role of roles) {
      await prisma.user_role.upsert({
        where: { role },
        update: {},
        create: { role },
      });
    }

    console.log("Roles inserted successfully!");
    return res.status(200).json({ msg: "Data inserted" });
  } catch (error) {
    console.error("Error seeding roles:", error);
    return res.status(500).json({ error: "Failed to insert roles" });
  } finally {
    await prisma.$disconnect();
  }
}

export { seedRoles as UserRoleInsert };
