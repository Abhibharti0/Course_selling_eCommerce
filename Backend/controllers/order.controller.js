import { Order } from "../models/order.model.js";
import User from "../models/user.model.js";
import Purchase from "../models/purchase.model.js";

export const orderData = async (req, res) => {
  try {
    const userId = req.userId;   // from token middleware
    const { courseId, paymentId, amount, status } = req.body;

    // get email from DB instead of frontend
    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ errors: "User not found" });

    const order = await Order.create({
      email: user.email,
      userId,
      courseId,
      paymentId,
      amount,
      status,
    });

    await Purchase.create({
      userId,
      courseId,
      purchaseDate: new Date(),
    });

    return res.status(201).json({
      message: "Order saved successfully",
      order,
    });

  } catch (err) {
    console.log("Order error:", err);
    return res.status(500).json({ errors: "Order creation failed" });
  }
};
