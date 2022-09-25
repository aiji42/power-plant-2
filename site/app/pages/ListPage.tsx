import { useLoaderData } from "@remix-run/react";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import { ProductList } from "~/libs/products/priducts";
import { useEffect, useState } from "react";

export function ListPage() {
  const data = useLoaderData<ProductList>();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box w="100%" p={2}>
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        {data.map(({ image_path: src, name }) => (
          <GridItem key={src} w="100%">
            <img
              src={src}
              alt={name}
              style={{
                width: "100%",
                height: mounted
                  ? ((window.innerWidth - 32) / 3) * (118 / 83)
                  : ((375 - 32) / 3) * (118 / 83),
                objectFit: "cover",
                objectPosition: "100% 100%",
              }}
              loading="lazy"
            />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
