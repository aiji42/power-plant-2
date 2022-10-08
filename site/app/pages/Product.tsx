import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useReducer } from "react";
import {
  Box,
  Image,
  List,
  ListItem,
  Stack,
  Text,
  Skeleton,
  Tag,
  TagLabel,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { loader } from "~/routes/__authed/mgs/show.$code";
import { loader as castsLoader } from "~/routes/__authed/api/casts.$code";
import { route } from "routes-gen";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { SerializeFrom } from "@remix-run/node";

export const Product = () => {
  const data = useLoaderData<typeof loader>();
  const [showFull, toggle] = useReducer((s) => !s, false);
  const fetcher = useFetcher<SerializeFrom<typeof castsLoader>>();
  useEffect(() => {
    fetcher.load(route("/api/casts/:code", { code: data.product.code }));
  }, [fetcher.load, data.product.code]);

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
        <Flex justify="end">
          <Icon as={BsBookmark} boxSize={6} color="teal.300" />
        </Flex>
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
        {fetcher.type !== "done" && <Skeleton borderRadius="full" height={8} />}
        {fetcher.type === "done" && fetcher.data && (
          <Box lineHeight={2.25}>
            {fetcher.data.casts.map((c) => (
              <Tag
                key={c.name}
                size="lg"
                colorScheme="red"
                borderRadius="full"
                mr={1}
              >
                <TagLabel>{c.name}</TagLabel>
              </Tag>
            ))}
          </Box>
        )}
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
