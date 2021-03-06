import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Code,
  Divider,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Cookies from "cookies";
import CryptoJS from "crypto-js";
import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [url, setUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("...");
  const [urls, setUrls] = useState([]);
  const [length, setLength] = useState(8);
  const toast = useToast();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [selectedItem, setSelectedItem] = useState("");

  // Generate the slide marks for the URL length slider [8 - 16 - 24 - 32 - 40 - 48 - 56 - 64]
  const sliderMarks = [];
  for (var x = 8; x <= 64; x += 8) {
    sliderMarks.push(
      <SliderMark
        key={x}
        value={x}
        marginTop="2rem"
        marginLeft="-2.5"
        fontSize="sm"
      >
        {x}
      </SliderMark>
    );
  }

  // Generate the shorten URL via APIs
  async function generateUrl() {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        length,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      setGeneratedUrl(json.generatedUrl);

      getUrls();

      toast({
        title: "Link created!",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Invalid URL provided",
        description: "Provide a valid URL and retry...",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  // Delete genrated URL via APIs
  async function deleteURL() {
    const res = await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: selectedItem,
      }),
    });

    if (res.ok) {
      getUrls(false);

      toast({
        title: "Link deleted successfully!",
        description:
          "The link has been removed, new opens will return an 404 page",
        status: "success",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  // Copy a text to the clipboard
  function copyToClipboard(text?: string) {
    navigator.clipboard.writeText(text || generatedUrl);

    toast({
      title: "Link copied!",
      status: "success",
      position: "top",
      duration: 2000,
      isClosable: true,
    });
  }

  // Get all URLs generated
  async function getUrls(timeout?: boolean) {
    const res = await fetch("/api/get");
    if (res.ok) {
      const json = await res.json();
      setUrls(json.urls);

      if (timeout || true) {
        setTimeout(() => {
          getUrls();
        }, 2000);
      }
    }
  }

  async function logout() {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      toast({
        title: "Logged out successfull!",
        description: "Redirecting to the login page...",
        status: "success",
        isClosable: true,
        duration: 2000,
        position: "top",
      });

      setTimeout(() => {
        router.push("/dashboard/login");
      }, 1000);
    }
  }

  // Fetch URLs on render
  useEffect(() => {
    getUrls();
  }, []);

  return (
    <>
      <Head>
        <title>Shh URL - Dashboard</title>
      </Head>
      <Stack spacing="4rem" padding="2rem">
        <Stack>
          <Heading>Shhh URL</Heading>
          <HStack>
            <Heading size="sm">A simple self-hosted url shortner</Heading>
            <Button size="sm" colorScheme="red" onClick={logout}>
              Logout
            </Button>
          </HStack>
        </Stack>

        <Stack spacing={4}>
          <InputGroup size="md">
            <Input
              paddingRight="7rem"
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
            <InputRightElement width="6rem">
              <Button
                height="1.75rem"
                size="sm"
                marginRight="1rem"
                onClick={() =>
                  url != ""
                    ? generateUrl()
                    : toast({
                        title: "No url provided",
                        description: "Provide an url to generated a new one",
                        status: "error",
                        position: "top",
                        duration: 5000,
                        isClosable: true,
                      })
                }
              >
                Generate
              </Button>
            </InputRightElement>
          </InputGroup>

          <Stack spacing="1rem" direction="row">
            <Heading size="sm">Suffix Length</Heading>
            <Slider
              defaultValue={length}
              min={8}
              max={64}
              step={8}
              onChangeEnd={(e) => setLength(e)}
            >
              {sliderMarks}
              <SliderTrack bg="blue.100">
                <Box position="relative" right={10} />
                <SliderFilledTrack bg="blue.400" />
              </SliderTrack>
              <SliderThumb boxSize={6} />
            </Slider>
          </Stack>
        </Stack>

        <Divider />

        <Code
          cursor={generatedUrl != "..." ? "pointer" : "default"}
          padding="1rem"
          borderRadius="10px"
          colorScheme="blue"
          onClick={() => (generatedUrl != "..." ? copyToClipboard() : null)}
        >
          {generatedUrl}
        </Code>

        <Divider />

        <TableContainer>
          <Heading size="md">URLs</Heading>
          <Table size="md">
            <Thead>
              <Tr>
                <Th>Original URL</Th>
                <Th>Generated URL</Th>
                <Th isNumeric>Open Times</Th>
                <Th textAlign="right">Remove</Th>
              </Tr>
            </Thead>
            <Tbody>
              {urls.map((u: any, i: number) => (
                <Tr key={i}>
                  <Td>{u.url}</Td>
                  <Td
                    cursor="pointer"
                    onClick={() => copyToClipboard(u.generatedUrl)}
                  >
                    {u.generatedUrl}
                  </Td>
                  <Td isNumeric>{u.openTimes}</Td>
                  <Td textAlign="right">
                    <DeleteIcon
                      cursor="pointer"
                      color="red.500"
                      onClick={() => {
                        setSelectedItem(u._id);
                        onOpen();
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Total shorten URLs -{urls.length}</Th>
                <Th></Th>
                <Th isNumeric>
                  Total Open Times -{" "}
                  {urls.reduce((accumulator: number, u: any) => {
                    return accumulator + u.openTimes;
                  }, 0)}
                </Th>
                <Th></Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef as any}
          onClose={onClose}
        >
          <AlertDialogOverlay zIndex="6000">
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete URL
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef as any} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    deleteURL().then(() => {
                      setSelectedItem("");
                      onClose();
                    });
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Stack>
    </>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const cookies = Cookies(context.req, context.res);
  const token = cookies.get("token");

  if (token) {
    const decrypted = CryptoJS.AES.decrypt(token, process.env.SECRET as string);
    if (
      decrypted.toString(CryptoJS.enc.Utf8) == (process.env.PASSWORD as string)
    ) {
      return {
        props: {},
      };
    }
  }

  return {
    redirect: {
      destination: "/dashboard/login",
      permanent: false,
    },
  };
}
