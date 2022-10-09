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
} from "@chakra-ui/react";
import { route } from "routes-gen";
import { useSwipeToNext } from "~/hooks/useSwipeToNext";
import { loader } from "~/routes/__authed/mgs/$page";

export function ListPage() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const { handler, swiping } = useSwipeToNext(data.nextTo);

  return (
    <Box w="100%" p={2} {...handler}>
      <Flex mx={4} my={4}>
        {(["mgs", "fana", "fanc"] as const).map((c) => (
          <ChakraLink
            key={c}
            as={Link}
            to={route(`/${c}/:page`, { page: "1" })}
            fontSize="xl"
            mr={4}
            color={
              location.pathname.startsWith(`/${c}`) ? "teal.300" : "gray.300"
            }
          >
            {c.toUpperCase()}
          </ChakraLink>
        ))}
      </Flex>
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        {data.items.map(({ image_path: src, name, sku: code, casts }) => (
          <Link
            key={code}
            to={
              location.pathname.startsWith("/mgs")
                ? route("/mgs/show/:code", { code })
                : location.pathname.startsWith("/fana")
                ? route("/fana/show/:code", { code })
                : route("/fanc/show/:code", { code })
            }
          >
            <GridItem w="100%" minH={48}>
              <img src={src} alt={name} loading="lazy" />
              <Text fontSize="3xs" noOfLines={2}>
                {name}
              </Text>
              <Text fontSize="3xs" noOfLines={1} color="teal.200">
                {casts.join("/")}
              </Text>
            </GridItem>
          </Link>
        ))}
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
