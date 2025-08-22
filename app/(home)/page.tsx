import { getCurrentUser } from "@/lib/session";
import { UserInfo } from "@/types/user";
import HomePage from "./homePage";

export default async function Page() {
  const user = (await getCurrentUser()) as UserInfo;

  return <HomePage user={user} />;
}
