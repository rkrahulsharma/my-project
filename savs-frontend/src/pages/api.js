import axios from 'axios';

export const approveUser = async (userId, role, approverRole, approverCollege = '', approverDepartment = '') => {
  try {
    const response = await axios.post("http://localhost:5000/api/approve", {
      id: userId,
      role,
      approverRole,
      approverCollege,
      approverDepartment
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};
