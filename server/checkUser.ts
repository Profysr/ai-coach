import { currentUser } from "@clerk/nextjs/server";
import { db } from "../lib/prisma";

export const checkUser = async () => {
  const user = await currentUser();

  console.log("Running CheckUser");

  if (!user) {
    return {
      success: false,
      message: "User has been Unauthenticated",
      user: undefined,
    };
  }
  try {
    const isLoggedIn = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });
    if (isLoggedIn) {
      return {
        success: true,
        message: "User is Authenticated already",
        user: isLoggedIn,
      };
    }

    const name = `${user.firstName} ${user.lastName}`;
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name,
        imageUrl: user.imageUrl,
      },
    });

    return {
      success: true,
      message: "User has been saved to database",
      user: newUser,
    };
  } catch (error) {
    return {
      success: false,
      message: `Unable to find User in Db ${
        error instanceof Error ? error.message : String(error)
      }`,
      user: null,
    };
  }
};
