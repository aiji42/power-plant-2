import {
  Link,
  PrefetchPageLinks,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
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
import { GrStackOverflow, GrSearch } from "react-icons/gr";
import { route } from "routes-gen";
import { useSwipeToNext } from "~/hooks/useSwipeToNext";
import { loader } from "~/routes/__authed/stock.$page";
import { color } from "~/libs/status/utils";
import { ChangeEvent, Fragment, useReducer, useRef } from "react";

export function ListPage() {
  const data = useLoaderData<typeof loader>();
  const { handler, swiping } = useSwipeToNext(data.nextTo);

  return (
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
                <Text fontSize="2xs" noOfLines={1} color="teal.200">
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
      <PrefetchPageLinks page={data.nextTo} />
    </Box>
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
