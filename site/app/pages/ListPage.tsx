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
} from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa";
import { GrStackOverflow } from "react-icons/gr";
import { route } from "routes-gen";
import { useSwipeToNext } from "~/hooks/useSwipeToNext";
import { loader } from "~/routes/__authed/stock.$page";
import { color } from "~/libs/status/utils";
import { Fragment } from "react";

export function ListPage() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const { handler, swiping } = useSwipeToNext(data.nextTo);

  return (
    <Box w="100%" p={2} {...handler}>
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
          <Input w={40} rounded="3xl" bg="gray.200" />
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
                    color={color(status, 500)}
                    top={1}
                    right={1}
                    position="absolute"
                    fontSize="md"
                    boxShadow="base"
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
