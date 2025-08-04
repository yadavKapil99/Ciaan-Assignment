import axios from 'axios';
import url from '../constant';

export const getUserPosts = async () => {
  try {
    const response = await axios.get(`${url}/posts/`, { withCredentials: true });
    if (response.data.success) {
      return { success: true, posts: response.data.posts };
    } else {
      return { success: false, message: "Failed to fetch posts." };
    }
  } catch (error) {
    console.error("Fetch posts error:", error);
    return { success: false, message: "Server error" };
  }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await axios.get(`${url}/users/userId/${userId}`, { withCredentials: true });
    if (response.data.success) {
      return { success: true, user: response.data.user };
    } else {
      return { success: false, message: "Failed to fetch user details." };
    }
  } catch (error) {
    console.error("Fetch user details error:", error);
    return { success: false, message: "Server error" };
  }
};
