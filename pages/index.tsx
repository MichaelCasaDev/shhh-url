import {
  Button,
  Code,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [url, setUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("...");
  const [urls, setUrls] = useState([]);
  const toast = useToast();

  async function generateUrl() {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      setGeneratedUrl(json.generatedUrl);

      getUrls();

      toast({
        title: "Link created!",
        description: "Check the generated link at the bottom of the screen",
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
  }

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

  async function getUrls() {
    const res = await fetch("/api/get");
    if (res.ok) {
      const json = await res.json();
      setUrls(json.urls);

      setTimeout(() => {
        getUrls();
      }, 2000);
    }
  }

  useEffect(() => {
    getUrls();
  }, []);

  return (
    <div className="container">
      <Heading>Shhh URL</Heading>
      <Heading size="sm">A simple self-hosted url shortner</Heading>
      <InputGroup size="md" margin="2rem 0">
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
            mr="1rem"
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

      <Code
        cursor={generatedUrl != "..." ? "pointer" : "default"}
        padding="1rem"
        margin="2rem 0"
        borderRadius="10px"
        onClick={() => (generatedUrl != "..." ? copyToClipboard() : null)}
      >
        {generatedUrl}
      </Code>

      <TableContainer margin="2rem 0">
        <Heading size="md">URLs</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Original URL</Th>
              <Th>Generated URL</Th>
              <Th isNumeric>Open Times</Th>
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
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Home;
