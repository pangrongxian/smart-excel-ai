import { HomeLayoutProps } from "@/types/layout";

export const HomeLayout = ({ children, user }: HomeLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full">
        <div className="flex flex-col items-center text-center space-y-6 w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
