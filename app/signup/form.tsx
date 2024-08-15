"use client";

import { useState } from "react";
import axiosInstance from "../utils/axios-config";
import { toast, Toaster } from "sonner";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import useAuthStore from "@/app/stores/authStore";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { checkAuth } = useAuthStore();

  const onSubmit = async () => {
    console.log("onsubmit");
    try {
      let credentials = { email, password };
      const response = await axiosInstance.post('/api/auth/signup', credentials);
      console.log('response: ', response);
      if (response.status === 200) {
        // Assuming the response contains the token
        const { token } = response.data;
        // Save the token in the cookie
        document.cookie = `token=${token}; path=/;`;
        await checkAuth();
        toast.success('Register successful');
        router.push('/'); 
      } else {
        const error = response.data;
        toast.error(`Register failed: ${error.message}`);
      }
    } catch (error) {
      toast.error('An error occurred during register.');
      console.error('Register error:', error);
    }
  };

  return (
    <>
      <Toaster />
      <form className="flex flex-col gap-2 mx-auto max-w-md mt-10">
        <div>
          <h1 className="mb-5 mt-5">Register</h1>
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
            Register
          </Button>
        </div>
      </form>
    </>
  );
}
