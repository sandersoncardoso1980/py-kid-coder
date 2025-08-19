import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-bg">
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}