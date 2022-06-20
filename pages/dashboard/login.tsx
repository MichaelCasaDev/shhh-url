import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Page() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function login() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    });

    if (res.ok) {
      toast({
        title: "Login successfull!",
        description: "Redirecting to the admin dashboard...",
        status: "success",
        isClosable: true,
        duration: 2000,
        position: "top",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      toast({
        title: "Invalid password!",
        description: "Input a valid password and retry...",
        status: "error",
        isClosable: true,
        duration: 2000,
        position: "top",
      });
    }
  }

  return (
    <>
      <Head>
        <title>Shh URL - Login</title>
      </Head>
      <Center height="100vh">
        <Stack padding="2rem 10%">
          <Text>Input the correct password to access the dashboard</Text>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button onClick={login}>Login</Button>
        </Stack>
      </Center>
    </>
  );
}
