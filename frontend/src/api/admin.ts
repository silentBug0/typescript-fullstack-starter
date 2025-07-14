import { toast } from 'react-toastify';
import axios from './axios';
import type { AxiosError } from 'axios';

export const promoteUser = async(id: number, role: 'admin' | 'user', token: string) => {
  try {
    await axios.patch(`/users/${id}/role`, {
      role,
    }, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Include JWT here
      },
    });

    
    toast.success(`Role changed to ${role}`);
    return true;
  } catch (err: unknown) {
    console.log("❌ Error changing role:", err);
    const error = err as AxiosError<{ message: string }>;
    const message = error?.response?.data?.message ?? "❌ Error changing role";
    console.log("❌ Error changing role:", message);

    toast.error(message);
  }
}

export const deleteUser = (id: number, token: string) =>
  axios.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Include JWT here
    }
  });
