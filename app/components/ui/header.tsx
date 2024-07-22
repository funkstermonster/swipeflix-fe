"use client";

import useAuthStore from "@/app/stores/authStore";
import { Button } from "@nextui-org/button";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu } from "@nextui-org/navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const { user, isSignedIn, signOut, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      await checkAuth();
      setLoading(false);
    };

    authenticate();
  }, [checkAuth]);

  useEffect(() => {
    console.log('is signed in: ', isSignedIn);
  }, [isSignedIn]);

  return (
    <Navbar className="dark">
      <NavbarContent>
        <NavbarBrand>
          <p className="font-bold text-inherit">Swipeflix</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        {!isSignedIn && (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/signin">Sign In</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
        {isSignedIn && (
          <>
          <NavbarItem>
            <Button onClick={signOut} variant="flat" color="primary">
              Log out
            </Button>
          </NavbarItem>

          <NavbarItem>
            <Link href="/swipe">Swipe</Link>
          </NavbarItem>
          </>
        )}
      </NavbarContent>
      <NavbarMenu></NavbarMenu>
    </Navbar>
  );
}
