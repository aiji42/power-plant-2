import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useReducer, useRef } from "react";
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
  Spacer,
} from "@chakra-ui/react";
import { loader } from "~/routes/__authed/mgs/show.$code";
import { loader as castsLoader } from "~/routes/__authed/api/casts.$code";
import { route } from "routes-gen";
import { SerializeFrom } from "@remix-run/node";
import { BookmarkButton } from "~/components/BookmarkButton";
import { BiLinkExternal, BiPlayCircle } from "react-icons/bi";

export const Product = () => {
  const data = useLoaderData<typeof loader>();
  const [showFull, toggle] = useReducer((s) => !s, false);
  const castFetcher = useFetcher<SerializeFrom<typeof castsLoader>>();
  useEffect(() => {
    castFetcher.load(route("/api/casts/:code", { code: data.product.code }));
  }, [castFetcher.load, data.product.code]);

  const ref = useRef<HTMLVideoElement>(null);

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
        <Flex>
          {data.product.sample && (
            <Box>
              <Icon
                as={BiPlayCircle}
                boxSize={6}
                mr={4}
                onClick={() => ref.current?.play()}
              />
              <video
                ref={ref}
                width={0}
                height={0}
                src={data.product.sample}
                controls
              />
            </Box>
          )}
          <Spacer />
          <a href={data.product.url} target="_blank" rel="noopener noreferrer">
            <Icon as={BiLinkExternal} boxSize={6} mr={4} />
          </a>
          <BookmarkButton code={data.product.code} />
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
        {castFetcher.type !== "done" && (
          <Skeleton borderRadius="full" height={8} />
        )}
        {castFetcher.type === "done" && castFetcher.data && (
          <Box lineHeight={2.25}>
            {castFetcher.data.casts.map((c) => (
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
        {data.product.imageUrls.map((image) => (
          <Image src={image} key={image} loading="lazy" />
        ))}
      </Stack>
    </Box>
  );
};
