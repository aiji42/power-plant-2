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
} from "@chakra-ui/react";
import { ProductList } from "~/libs/products/priducts";
import { route } from "routes-gen";
import { useSwipeToNext } from "~/hooks/useSwipeToNext";

export function ListPage() {
  const data = useLoaderData<{ items: ProductList; nextTo: string }>();
  const location = useLocation();
  const { handler, swiping } = useSwipeToNext(data.nextTo);

  return (
    <Box w="100%" p={2} {...handler}>
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        {data.items.map(({ image_path: src, name, sku: code }) => (
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
            </GridItem>
          </Link>
        ))}
      </Grid>
      <Slide direction="bottom" in={swiping}>
        <Center>
          <CircularProgress isIndeterminate color="teal.300" />
        </Center>
      </Slide>
      <PrefetchPageLinks page={data.nextTo} />
    </Box>
  );
}
