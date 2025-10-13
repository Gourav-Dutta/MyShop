import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const addressSchema = z.object({
  city: z.string().min(1, "You have to provide your city"),
  house_no: z.string().min(1, "Please enter your house no "),
  pin_no: z.string().min(1, "Please enter your current PIN NO "),
  state: z.string().min(1, "You have to provide your State Name"),
  is_primary: z.string(),
  shop_line: z.string().optional()
});

async function handleNewAddress(req, res) {
  try {
    const body = addressSchema.parse(req.body);
    const userId = parseInt(req.user.id);
    

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
    
    if (body.is_primary) {
      await prisma.address.updateMany({          // Check if any address is primary that make it false
        where: { user_id: userId, is_primary: true },
        data: { is_primary: false },
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
        shop_line: body.shop_line 
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

// Get the address based on userId and AddressId:

async function handleGetAddressOnAddId(req, res) {
  const userId = parseInt(req.user.id);
  const addId = parseInt(req.params.addId);

  const myAddress = await prisma.address.findMany({
    where: { id: addId, user_id: userId },
  });

  if (myAddress.length === 0) {
    return res.status(200).json({
      msg: "No addresss found",
    });
  }

  return res.status(200).json({
    msg: "Address founded successfully",
    data: myAddress,
  });
}

// To update address :

async function handleUpdateAddress(req, res) {
  const userId = parseInt(req.user.id);
  const addId = parseInt(req.params.addId);

  const { house_no, city, state, pin_no, shop_line } = req.body;
  const body = {};
  if (house_no) body.house_no = house_no;
  if (city) body.city = city;
  if (state) body.state = state;
  if (pin_no) body.pin_no = pin_no;
  if (shop_line) body.shop_line = shop_line;
 

  const updateAddress = await prisma.address.updateMany({
    where: { id: addId, user_id: userId },
    data: { ...body },
  });

  if (updateAddress.count === 0) {
    return res.status(200).json({
      msg: "Address not updated",
    });
  }

  return res.status(200).json({
    msg: "Address update successfully",
    data: updateAddress,
  });
}

// Update the address is_primary :

async function handleUpdateAddesssIs_Primary(req, res) {
  try {
    const userId = parseInt(req.user.id);
   

    const addId = parseInt(req.body.addId);
    let is_primary = req.body.is_primary ?? req.body.is_primary;
    

    if (typeof is_primary === "string") {   
      if (is_primary.toLowerCase() === "true") {
        is_primary = true;
      } else if (is_primary.toLowerCase() === "false") {
        is_primary = false;
      } else {
        throw new Error(
          "This is a Invalid Boolean value, kindly use 'true' or 'false' "
        );
      }
    }
    
    is_primary = Boolean(is_primary);
    
    if (is_primary) {
      await prisma.address.updateMany({
        where: { user_id: userId, is_primary: true },
        data: { is_primary: false },
      });
    }

    const updateValue = await prisma.address.updateMany({
      where: { id: addId, user_id: userId },
      data: { is_primary: is_primary },
    });

    if (updateValue.count === 0) {
      return res.status(200).json({
        message: "Failde to update the Primary option",
      });
    }

    return res.status(201).json({
      message: "Successfully update the Primary option",
      Address: updateValue,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error during update address : ${err.message}`,
    });
  }
}
export {
  handleNewAddress as addNewAddress,
  handleGetAllAddress as getAlluserAddress,
  handleGetAllUserByCity as getAllUserByCityName,
  handleGetUserAddress as getUserAddress,
  handleGetUserAddressByUserIdByAdmin as getUserAddressByAdmin,
  handleGetAddressOnAddId as GetAddressOnAddIdUserId,
  handleUpdateAddress as UpdateAddress,
  handleUpdateAddesssIs_Primary as updateAddressIs_Primary,
};
