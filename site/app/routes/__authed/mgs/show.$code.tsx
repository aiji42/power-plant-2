import { DataFunctionArgs } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { productFromMGS } from "~/libs/poduct/mgs.server";
import { useLoaderData } from "@remix-run/react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useReducer } from "react";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/mgs/show/:code"];
  const product = await productFromMGS(code);

  return {
    product,
  };
};

export default () => {
  const data = useLoaderData<typeof loader>();
  const [showFull, toggle] = useReducer((s) => !s, false);
  return (
    <Box w="full">
      <Box
        h={80}
        w="full"
        bgSize="cover"
        style={{
          backgroundImage: `url('${data.product.imageUrls[0]}')`,
        }}
      />
      <Box py={6} px={4}>
        <Text
          as="h1"
          noOfLines={showFull ? undefined : 3}
          fontSize={"xl"}
          color="white"
          fontWeight="bold"
          onClick={toggle}
        >
          {data.product.title}
        </Text>
      </Box>
    </Box>
  );
};
