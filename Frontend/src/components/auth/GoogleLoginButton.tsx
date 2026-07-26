"use client";

import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function GoogleLoginButton() {
  const handleSuccess = async (credentialResponse: any) => {
    try {
      const response = await axios.post(``);
    } catch (error) {}
  };
}
