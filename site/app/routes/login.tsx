import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticator, supabaseStrategy } from "~/libs/auth/auth.server";
import { Form } from "@remix-run/react";
import { route } from "routes-gen";
import {
  Flex,
  Stack,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

export const loader: LoaderFunction = async ({ request }) =>
  supabaseStrategy.checkSession(request, {
    successRedirect: route("/"),
  });

export const action: ActionFunction = async ({ request }) =>
  authenticator.authenticate("sb", request, {
    successRedirect: route("/"),
    failureRedirect: route("/login"),
  });

export default function LoginPage() {
  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg="gray.800">
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Box rounded={"lg"} bg="gray.700" boxShadow={"lg"} p={8}>
          <Form method="post">
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" name="email" />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password" />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Form>
        </Box>
      </Stack>
    </Flex>
  );
}
