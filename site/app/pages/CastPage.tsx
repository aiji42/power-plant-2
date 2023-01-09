import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/__authed/cast.$cast";
import {
  Box,
  Center,
  Heading,
  Image,
  List,
  ListItem,
  Link as ChakraLink,
  Flex,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { Toolbar } from "~/components/Toolbar";
import { ProductCard } from "~/components/ProductCard";

export const CastPage = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <Box p={2}>
      <Toolbar />
      <Heading as="h1" textAlign="center">
        {data.cast?.name}
      </Heading>
      <Flex mt={2} gap={4}>
        <Image rounded={"md"} src={data.cast?.imageURL?.large} w={40} h={40} />
        <Center>
          <List spacing={3}>
            {data.links.map((link) => (
              <ListItem key={link}>
                <ChakraLink
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="teal.300"
                >
                  <Icon as={BsFillPersonLinesFill} color="teal.300" mr={2} />
                  {new URL(link).hostname}
                </ChakraLink>
              </ListItem>
            ))}
          </List>
        </Center>
      </Flex>
      <Grid templateColumns="repeat(3, 1fr)" gap={2} mt={8}>
        {data.items.map((item) => (
          <GridItem
            key={item.sku}
            w="100%"
            minH={48}
            position="relative"
            mb={2}
          >
            <ProductCard {...item} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};
