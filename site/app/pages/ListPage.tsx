import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { Grid, GridItem, Box, Link as ChakraLink } from "@chakra-ui/react";
import { ProductList } from "~/libs/products/priducts";
import { route } from "routes-gen";

export function ListPage() {
  const data = useLoaderData<{ items: ProductList; nextTo: string }>();
  const location = useLocation();

  return (
    <Box w="100%" p={2}>
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
      <Box mb={8}>
        <ChakraLink as={Link} to={data.nextTo}>
          Next
        </ChakraLink>
      </Box>
    </Box>
  );
}
