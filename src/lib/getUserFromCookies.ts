
"use server"
import { cookies } from 'next/headers';
export async function getUserFromCookies() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user');     // assuming you store `user` as JSON string
  const roleCookie = cookieStore.get('role');     // assuming you store `role` separately

  if (!userCookie || !roleCookie) return null;

  try {
    const user = JSON.parse(userCookie.value);  // safely parse JSON
    const role = roleCookie.value;

    return { user, role }
  } catch (e) {
    return null;
  }
}
