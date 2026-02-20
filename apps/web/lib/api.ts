import type { Work } from "@repo/shared";
import {auth} from "./auth-client";

const API_URL = "http://localhost:4000/api";

export const registerUser = async (name: string, email: string, password: string) => {
  const res = await auth.signUp.email({
    name,
    email,
    password,
  });
  if(res.error){
    throw new Error(res.error.message);
  }
  return res;
};

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await auth.signIn.email({
      email,
      password,
    });
    if (res.error) {
      throw new Error(res.error.message);
    }
   return res;
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Failed to login");
  }
};

export const logoutUser = async () => {
  try {
    const res = await auth.signOut();
  } catch (error) {
    console.error("Error logging out:", error);
    throw new Error("Failed to logout");
  }
};
export const fetchWorks = async (): Promise<Work[]> => {
  const res = await fetch(API_URL,{
    credentials: "include",
  });

  if (res.status === 401) {
    // User is not authenticated, return empty array or redirect to login
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to fetch works");
  }
  const data = await res.json();

  return data;
};

export const addWork = async (data: Omit<Work, "id" | "createdAt">) => {
  const res = await fetch(`${API_URL}/add`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) {
    throw new Error("Please login to add work");
  }
  if (!res.ok) throw new Error("Failed to add work");
  return res.json();
};

export const updateWork = async (id: string, updates: Partial<Work>) => {
  const res = await fetch(`${API_URL}/update/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (res.status === 401) {
    throw new Error("Please login to update work");
  }
  if (!res.ok) throw new Error("Failed to update work");
  return res.json();
};

export const deleteWork = async (id: string) => {
  const res = await fetch(`${API_URL}/delete/${id}`, {
    credentials: "include",
    method: "DELETE",
  });
  if (res.status === 401) {
    throw new Error("Please login to delete work");
  }
  if (!res.ok) throw new Error("Failed to delete work");
};
