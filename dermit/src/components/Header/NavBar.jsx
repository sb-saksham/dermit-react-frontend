import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { startCase } from "lodash";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar shouldHideOnScroll isBordered>
      <NavbarBrand>
        <NavbarItem>
          <Link color="foreground" to="/">
            <p className="font-bold text-inherit text-3xl">DermIT</p>
          </Link>
        </NavbarItem>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link color="foreground" to="/diagnose/survey">
            Diagnose
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link to="#" aria-current="page">
            How it works?
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link color="foreground" to="/contact">
            Contact
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link color="foreground" to="#">
            Privacy
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {!user ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link to="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" to="#" variant="flat">
                Sign Up NW
              </Button>
            </NavbarItem>
          </>
        ) : (
          <>
            <div className="flex justify-center gap-4">
              <Link to={"/user-dashboard"}>
                <div className="bg-blue-300 border-2 border-blue-800 rounded-full w-10 h-10 flex items-center justify-center">
                  <p className="text-2xl font-bold text-blue-800">
                    {startCase(user.username)[0]}
                  </p>
                </div>
              </Link>
            </div>
            <NavbarItem>
              <Button
                as={Link}
                color="danger"
                to="/"
                onClick={logout}
                variant="flat"
              >
                Logout
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
