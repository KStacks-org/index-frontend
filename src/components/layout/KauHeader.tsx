import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Moon, Sun, Menu, GraduationCap, Calendar } from "lucide-react";
import { RamadanToggle } from "./RamadanToggle";

function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function KauHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // State to close sheet on navigation

  return (
    <header className="bg-background border-b border-border py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* --- LEFT SIDE: Logo --- */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none group"
        onClick={() => navigate({ to: "/" })}
      >
        <img
          src="/index-logo-light.svg"
          alt="Index logo"
          className="h-8 w-8 object-contain transition-transform group-hover:scale-105 dark:hidden"
        />
        <img
          src="/index-logo-dark.svg"
          alt="Index logo"
          className="h-8 w-8 object-contain transition-transform group-hover:scale-105 hidden dark:block"
        />
        <div className="font-bold text-2xl tracking-tight text-foreground">
          Index
        </div>
      </div>

      {/* --- RIGHT SIDE: Actions --- */}
      <nav className="flex items-center gap-3">
        {/* DESKTOP LINKS (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-6 mr-2">
          <Link
            to="/planner"
            className="flex items-center font-medium text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors"
            activeProps={{
              className: "text-green-600 dark:text-green-400 font-semibold",
            }}
          >
            <span>Schedule Planner</span>
          </Link>
        </div>

        {/* Theme Toggle (Visible on all screens) */}
        <ModeToggle />
        <RamadanToggle />

        {/* MOBILE MENU (Visible only on mobile) */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="text-left border-b pb-4 mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <img
                    src="/index-logo-light.svg"
                    alt="Index logo"
                    className="h-6 w-6 dark:hidden"
                  />
                  <img
                    src="/index-logo-dark.svg"
                    alt="Index logo"
                    className="h-6 w-6 hidden dark:block"
                  />
                  <span>Menu</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 ml-auto mr-auto w-[90%]">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-2 py-2 text-lg font-medium hover:bg-muted transition-colors"
                  activeProps={{
                    className: "bg-muted text-green-600 dark:text-green-400",
                  }}
                >
                  <GraduationCap className="h-5 w-5" />
                  Search Courses
                </Link>

                <Link
                  to="/planner"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-2 py-2 text-lg font-medium hover:bg-muted transition-colors"
                  activeProps={{
                    className: "bg-muted text-green-600 dark:text-green-400",
                  }}
                >
                  <Calendar className="h-5 w-5" />
                  Schedule Planner
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
