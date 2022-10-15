import { Link, useLoaderData, useLocation } from "@remix-run/react";
import {
  Grid,
  GridItem,
  Box,
  Slide,
  CircularProgress,
  Center,
  Flex,
  Link as ChakraLink,
  Text,
  Icon,
  Image,
  Input,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { GrStackOverflow, GrSearch } from "react-icons/gr";
import { route } from "routes-gen";
import { useSwipeToNext } from "~/hooks/useSwipeToNext";
import { loader } from "~/routes/__authed/stock.$page";
import { color } from "~/libs/status/utils";
import { ChangeEvent, Fragment, ReactNode, useReducer, useRef } from "react";
import { useSwipeToBeside } from "~/hooks/useSwipeToBeside";

export function ListPage() {
  const data = useLoaderData<typeof loader>();
  const { handler, swiping } = useSwipeToNext(data.nextTo);

  return (
    <SwipeBeside>
      <Box p={2} {...handler}>
        <Toolbar />
        <Grid templateColumns="repeat(3, 1fr)" gap={2}>
          {data.items.map(
            ({ image_path: src, name, sku: code, casts, status }) => (
              <Link key={code} to={route("/product/:code", { code })}>
                <GridItem w="100%" minH={48} position="relative">
                  <Image src={src} alt={name} w="full" loading="lazy" />
                  <Text fontSize="2xs" noOfLines={2}>
                    {name}
                  </Text>
                  <Text fontSize="3xs" noOfLines={1} color="teal.200">
                    {casts.join("/")}
                  </Text>
                  {status && (
                    <Icon
                      as={FaCircle}
                      color={color(status)}
                      top={-2}
                      left={-2}
                      position="absolute"
                      fontSize="md"
                    />
                  )}
                </GridItem>
              </Link>
            )
          )}
        </Grid>
        <Slide direction="bottom" in={swiping}>
          <Center mb={24}>
            <CircularProgress isIndeterminate color="teal.300" />
          </Center>
        </Slide>
      </Box>
    </SwipeBeside>
  );
}

const Toolbar = () => {
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
        <form
          action={route("/product/:code", { code: value })}
          style={{ display: "contents" }}
        >
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

const SwipeBeside = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { handler, swiping } = useSwipeToBeside(
    location.pathname.startsWith("/mgs")
      ? [
          route("/stock/:page", { page: "1" }),
          route("/fana/:page", { page: "1" }),
        ]
      : location.pathname.startsWith("/fana")
      ? [
          route("/mgs/:page", { page: "1" }),
          route("/fanc/:page", { page: "1" }),
        ]
      : location.pathname.startsWith("/fanc")
      ? [
          route("/fana/:page", { page: "1" }),
          route("/stock/:page", { page: "1" }),
        ]
      : [
          route("/fanc/:page", { page: "1" }),
          route("/mgs/:page", { page: "1" }),
        ]
  );

  return (
    <Box position="relative">
      <div {...handler}>{children}</div>
      <Slide direction="left" in={swiping === "Right"} style={{ zIndex: 10 }}>
        <Icon
          position="absolute"
          top="50%"
          color="teal.300"
          fontSize="3xl"
          as={BsFillArrowLeftCircleFill}
        />
      </Slide>
      <Slide direction="right" in={swiping === "Left"} style={{ zIndex: 10 }}>
        <Icon
          position="absolute"
          top="50%"
          right={0}
          color="teal.300"
          fontSize="3xl"
          as={BsFillArrowRightCircleFill}
        />
      </Slide>
    </Box>
  );
};
