import { productsFromMSG } from "~/libs/products/mgs.server";
import { useLoaderData } from "@remix-run/react";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import { DataFunctionArgs } from "@remix-run/node";
import { RouteParams } from "routes-gen";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { page } = params as RouteParams["/mgs/:page"];
  return await productsFromMSG(Number(page));
};

export default function IndexPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <Box w="100%" p={2}>
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        {data.map(({ image_path: src, name }) => (
          <GridItem key={src} w="100%">
            <img src={src} alt={name} loading="lazy" />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
