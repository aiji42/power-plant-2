import { productsFromM } from "~/libs/products/mgs.server";
import { useLoaderData } from "@remix-run/react";
import { Grid, GridItem, Box } from "@chakra-ui/react";

export const loader = async () => {
  return await productsFromM(1);
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <Box w="100%" p={2}>
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        {data.map(({ image_path: src, name }) => (
          <GridItem key={src} w="100%">
            <img src={src} alt={name} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
