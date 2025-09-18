import { getCurrentUser } from "@/lib/session";
import { UserInfo } from "@/types/user";
import GalleryPage from "./galleryPage";

export default async function Page() {
  const user = (await getCurrentUser()) as UserInfo;

  return <GalleryPage user={user} />;
}