"use client";

import { toast, Toaster } from "sonner";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import axiosInstance from "../utils/axios-config"; // Ensure this path is correct

export default function SignInForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    console.log("onsubmit");
    try {
      let credentials = {
        email: email,
        password: password
      }
      const response = await axiosInstance.post('/api/auth/signin', credentials);
      console.log('response: ', response);
      if (response.status === 200) {
        const user = response.data;
        // Handle successful login (e.g., save token, redirect, etc.)
        toast.success('Login successful');
        console.log('User:', user);
      } else {
        const error = response.data;
        toast.error(`Login failed: ${error.message}`);
      }
    } catch (error) {
      toast.error('An error occurred during login.');
      console.error('Login error:', error);
    }
  };

  return (
    <>
      <Toaster/>
      <form className="flex flex-col gap-2 mx-auto max-w-md mt-10">
        <div>
          <h1 className="mb-5 mt-5">Login</h1>
          <Input
            className="mb-5"
            type="email"
            label="Email"
            value={email}
            onValueChange={setEmail}
          />
          <Input
            className="mb-5"
            type="password"
            label="Password"
            value={password}
            onValueChange={setPassword}
          />
          <Button className="text-center mb-5" color="primary" onClick={onSubmit}>
            Login
          </Button>
        </div>
      </form>
    </>
  );
}
