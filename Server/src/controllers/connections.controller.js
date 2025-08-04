import { User } from "../models/user.model.js";
import { Connection } from "../models/connections.model.js";

export const makeConnection = async (req, res) => {
  try {
    const userId = req.user._id;
    const { connectedTo } = req.body;

    if (!connectedTo) {
      return res.status(400).json({ success: false, message: "Target user not provided" });
    }

    if (userId.toString() === connectedTo) {
      return res.status(400).json({
        success: false,
        message: "You cannot connect with yourself",
      });
    }

    const existingConnection = await Connection.findOne({ userId, connectedTo });

    if (existingConnection) {
      await Connection.deleteOne({ _id: existingConnection._id });

      await User.findByIdAndUpdate(userId, {
        $pull: { connections: connectedTo },
      });
      await User.findByIdAndUpdate(connectedTo, {
        $pull: { connections: userId },
      });

      return res.status(200).json({
        success: true,
        message: "Connection removed successfully",
        connected: false,
      });
    }

    const newConnection = new Connection({ userId, connectedTo });
    await newConnection.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: connectedTo },
    });
    await User.findByIdAndUpdate(connectedTo, {
      $addToSet: { connections: userId },
    });

    return res.status(201).json({
      success: true,
      message: "Connection made successfully",
      connected: true,
    });
  } catch (error) {
    console.error("Error handling connection:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Target user ID not provided" });
    }

    const connections = await Connection.find({ userId }).populate('connectedTo', 'userName email profilePicture');

    if (!connections || connections.length === 0) {
      return res.status(404).json({ success: false, message: "No connections found for this user" });
    }

    return res.status(200).json({
      success: true,
      connections: connections.map(conn => conn.connectedTo),
    });
  } catch (error) {
    console.error("Error fetching user connections:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
