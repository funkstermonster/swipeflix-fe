"use client";

import { toast, Toaster } from "sonner";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import axiosInstance from "../utils/axios-config";
import { useRouter } from 'next/navigation';
import useAuthStore from "@/app/stores/authStore";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { checkAuth } = useAuthStore();

  const onSubmit = async () => {
    console.log("onsubmit");
    try {
      let credentials = { email, password };
      const response = await axiosInstance.post('/api/auth/signin', credentials);
      console.log('response: ', response);
      if (response.status === 200) {
        await checkAuth();
        toast.success('Login successful');
        router.push('/');
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
      <Toaster />
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
