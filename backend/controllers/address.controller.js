import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const addressSchema = z.object({
  city: z.string().min(1, "You have to provide your city"),
  house_no: z.string().min(1, "Please enter your house no "),
  pin_no: z.string().min(1, "Please enter your current PIN NO "),
  state: z.string().min(1, "You have to provide your State Name"),
  is_primary: z.string(),
});

async function handleNewAddress(req, res) {
  try {
    const body = addressSchema.parse(req.body);
    const userId = parseInt(req.user.id);
    // console.log(body.is_primary);
    
    if (typeof body.is_primary === "string") {
      if (body.is_primary.toLowerCase() === "true") {
        body.is_primary = true;
      } else if (body.is_primary.toLowerCase() === "false") {
        body.is_primary = false;
        
        
      } else {
        throw new Error(
          "This is a Invalid Boolean value, kindly use 'true' or 'false' "
        );
      }
    }
    console.log(body.is_primary);
   if (body.is_primary) {
  // clear old primary first
  await prisma.address.updateMany({
    where: { user_id: userId, is_primary: true },
    data: { is_primary: false }
  });
}


    const newAddress = await prisma.address.create({
      data: {
        city: body.city,
        state: body.state,
        house_no: body.house_no,
        pin_no: body.pin_no,
        user_id: userId,
        is_primary: body.is_primary,
      },
      include: { user: true },
    });

    if (!newAddress) {
      return res.status(200).json({
        message: "Failde to add new address",
      });
    }

    return res.status(201).json({
      message: "Successfully inserted new address",
      Address: newAddress,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error during adding new address : ${err.message}`,
    });
  }
}

async function handleGetAllAddress(req, res) {
  try {
    const Address = await prisma.address.findMany({
      include: { user: true },
    });

    if (!Address) {
      return res.status(200).json({
        message: "Failed to get address",
      });
    }

    return res.status(200).json({
      message: "Successfully get all address",
      data: Address,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error during fetching all address : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

const cityschema = z.object({
  city: z.string().min(1, "You have to provide your city"),
});
async function handleGetAllUserByCity(req, res) {
  try {
    const body = cityschema.parse(req.body);

    const Users = await prisma.user.findMany({
      where: {
        address: {
          some: { city: body.city },
        },
      },
      include: { address: true },
    });

    if (Users.length === 0) {
      return res.status(400).json({
        message: "Sorry No user found with that city",
      });
    }

    return res.status(200).json({
      message: "Successfully get all user",
      data: Users,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error during fetching all address : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleGetUserAddress(req, res) {
  try {
    const userId = parseInt(req.user.id);

    const address = await prisma.address.findMany({
      where: { user_id: userId },
      include: { user: true },
    });

    if (address.length === 0) {
      return res.status(400).json({
        message: "No recored found of this user",
      });
    }

    return res.status(200).json({
      message: "Successfully get the user address details",
      data: address,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error during fetching all address : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Get the address of a specific user by Admin
const userSchema = z.object({
  id: z.string().min(1, "You have to provide the ID to get the user Address "),
});
async function handleGetUserAddressByUserIdByAdmin(req, res) {
  try {
    const body = userSchema.parse(req.body);
    const Id = parseInt(body.id);

    const userAddress = await prisma.address.findMany({
      where: {
        user: { id: Id },
      },
      include: { user: true },
    });

    if (userAddress.length === 0) {
      return res.status(400).json({
        message: "The user is not found",
      });
    }

    return res.status(200).json({
      message: "User address fetched successfully",
      data: userAddress,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error during fetching user address : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}
export {
  handleNewAddress as addNewAddress,
  handleGetAllAddress as getAlluserAddress,
  handleGetAllUserByCity as getAllUserByCityName,
  handleGetUserAddress as getUserAddress,
  handleGetUserAddressByUserIdByAdmin as getUserAddressByAdmin,
};
