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
  GridItem,
  Text,
  Grid,
} from "@chakra-ui/react";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { route } from "routes-gen";
import { FaCircle } from "react-icons/fa";
import { color } from "~/libs/status/utils";
import { Link } from "@remix-run/react";

export const CastPage = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <Box p={4}>
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
        {data.items.map(
          ({ image_path: src, name, sku: code, casts, status }) => (
            <Link key={code} to={route("/product/:code", { code })}>
              <GridItem w="100%" minH={48} position="relative">
                <Image src={src} alt={name} w="full" loading="lazy" />
                <Text fontSize="2xs" noOfLines={2}>
                  {name}
                </Text>
                <Text fontSize="3xs" noOfLines={1} color="teal.200">
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
    </Box>
  );
};
