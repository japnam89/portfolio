import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSession,
} from "@/lib/admin-auth";
import AdminLogin from "./AdminLogin";
import NewPostForm from "./NewPostForm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function NewPost() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isValidAdminSession(token)) {
    return <AdminLogin />;
  }

  return <NewPostForm />;
}
