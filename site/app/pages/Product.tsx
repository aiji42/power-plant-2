import { useLoaderData } from "@remix-run/react";
import { useReducer } from "react";
import { Box, Image, List, ListItem, Stack, Text } from "@chakra-ui/react";
import { loader } from "~/routes/__authed/mgs/show.$code";

export const Product = () => {
  const data = useLoaderData<typeof loader>();
  const [showFull, toggle] = useReducer((s) => !s, false);
  return (
    <Box w="full" p={2}>
      <Image
        rounded={"md"}
        src={data.product.imageUrls[0]}
        fit={"cover"}
        align={"center"}
        w={"100%"}
        h="320px"
        objectPosition={"right top"}
      />
      <Stack my={6} px={4} spacing={6}>
        <Box>
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
        <Box>
          <List spacing={2}>
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                メーカー:
              </Text>{" "}
              {data.product.maker}
            </ListItem>
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                レーベル:
              </Text>{" "}
              {data.product.label || "-"}
            </ListItem>
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                シリーズ:
              </Text>{" "}
              {data.product.series || "-"}
            </ListItem>
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                キャスト:
              </Text>{" "}
              {data.product.cast?.join(", ") || "-"}
            </ListItem>
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                ジャンル:
              </Text>{" "}
              {data.product.genres?.join(", ")}
            </ListItem>
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                再生時間:
              </Text>{" "}
              {data.product.length}m
            </ListItem>
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                リリース日:
              </Text>{" "}
              {data.product.releasedAt}
            </ListItem>
          </List>
        </Box>
      </Stack>
      <Stack spacing={2}>
        {data.product.sample && (
          <video
            width="100%"
            height="auto"
            src={data.product.sample}
            controls
          />
        )}
        {data.product.imageUrls.map((image) => (
          <Image src={image} key={image} loading="lazy" />
        ))}
      </Stack>
    </Box>
  );
};
