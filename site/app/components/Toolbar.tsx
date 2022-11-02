import { Link, useLocation } from "@remix-run/react";
import { ChangeEvent, Fragment, useReducer, useRef } from "react";
import {
  Box,
  Center,
  Flex,
  Icon,
  IconButton,
  Input,
  Spacer,
} from "@chakra-ui/react";
import { route } from "routes-gen";
import { GrSearch, GrStackOverflow } from "react-icons/gr";
import { Link as ChakraLink } from "@chakra-ui/layout";

export const Toolbar = () => {
  const location = useLocation();
  const ref = useRef<HTMLInputElement>(null);
  const [expand, handler] = useReducer((s: boolean, b: boolean) => {
    if (ref.current && b) ref.current.focus();
    return b;
  }, false);
  const [value, onChange] = useReducer(
    (s: string, e: ChangeEvent<HTMLInputElement>) => e.target.value,
    ""
  );
  const action = value.trim().match(/^[a-zA-Z0-9-_]+$/)
    ? route("/product/:code", { code: value.trim() })
    : route("/cast/:cast", { cast: value.trim() });

  return (
    <Box
      boxShadow="dark-lg"
      m={1}
      mb={4}
      p={4}
      top={1}
      position="sticky"
      rounded="md"
      bgColor="gray.900"
      zIndex={10}
    >
      <Flex justify="space-between">
        <form action={action} style={{ display: "contents" }}>
          <Input
            ref={ref}
            w={expand ? 48 : 0}
            opacity={expand ? 100 : 0}
            onBlur={() => handler(false)}
            rounded="3xl"
            colorScheme="whiteAlpha"
            transition="0.2s linear"
            onChange={onChange}
          />
        </form>
        <IconButton
          mx={4}
          left={0}
          position="absolute"
          rounded="3xl"
          aria-label="Search"
          icon={<GrSearch />}
          opacity={!expand ? 100 : 0}
          onClick={() => handler(true)}
          colorScheme="telegram"
          transition="0.2s linear"
        />
        <Spacer />
        <Spacer />
        <Spacer />
        {(["mgs", "fana", "fanc"] as const).map((c) => (
          <Fragment key={c}>
            <Center>
              <ChakraLink
                as={Link}
                to={route(`/${c}/:page`, { page: "1" })}
                prefetch="render"
                color={
                  location.pathname.startsWith(`/${c}`)
                    ? "teal.300"
                    : "gray.300"
                }
              >
                {c}
              </ChakraLink>
            </Center>
            <Spacer />
          </Fragment>
        ))}
        <Center>
          <ChakraLink
            as={Link}
            to={route("/stock/:page", { page: "1" })}
            color={
              location.pathname.startsWith("/stock") ? "teal.300" : "gray.300"
            }
          >
            <Icon mt={2} as={GrStackOverflow} />
          </ChakraLink>
        </Center>
      </Flex>
    </Box>
  );
};
