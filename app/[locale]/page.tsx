import { getCurrentUser } from "@/lib/session";
import { UserInfo } from "@/types/user";
import HomePage from "../(home)/homePage";

export default async function LocalePage() {
  const user = (await getCurrentUser()) as UserInfo;

  return <HomePage user={user} />;
}