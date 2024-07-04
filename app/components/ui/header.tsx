"use client";

import { Button } from "@nextui-org/button";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu } from "@nextui-org/navbar";
import Link from "next/link";

export default function Header() {


  return (
    <Navbar className="dark">
      <NavbarContent>
        <NavbarBrand>
          <p className="font-bold text-inherit">Swipeflix</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">


            <NavbarItem className="hidden lg:flex">
              <Link href="/signin">Sign In</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
      </NavbarContent>
      <NavbarMenu></NavbarMenu>
    </Navbar>
  );
}
