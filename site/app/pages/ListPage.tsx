import { Link, useLoaderData } from "@remix-run/react";
import { Grid, GridItem, Box, Link as ChakraLink } from "@chakra-ui/react";
import { ProductList } from "~/libs/products/priducts";
import { route } from "routes-gen";

export function ListPage() {
  const data = useLoaderData<{ items: ProductList; nextTo: string }>();

  return (
    <Box w="100%" p={2}>
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        {data.items.map(({ image_path: src, name, sku: code }) => (
          <Link key={code} to={route("/mgs/show/:code", { code })}>
            <GridItem w="100%">
              <img src={src} alt={name} loading="lazy" />
            </GridItem>
          </Link>
        ))}
      </Grid>
      <ChakraLink as={Link} to={data.nextTo}>
        Next
      </ChakraLink>
    </Box>
  );
}
