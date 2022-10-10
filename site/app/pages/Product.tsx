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
  Link,
} from "@chakra-ui/react";
import { loader } from "~/routes/__authed/mgs/show.$code";
import { loader as castsLoader } from "~/routes/__authed/api/casts.$code";
import { route } from "routes-gen";
import { SerializeFrom } from "@remix-run/node";
import { BookmarkButton } from "~/components/BookmarkButton";
import { BiLinkExternal, BiPlayCircle } from "react-icons/bi";
import { TorrentPanel } from "~/components/TorrentPanel";
import { DownloadTasksPanel } from "~/components/DownloadTasksPanel";

export const Product = () => {
  const data = useLoaderData<typeof loader>();
  const [showFull, toggle] = useReducer((s) => !s, false);
  const castFetcher = useFetcher<SerializeFrom<typeof castsLoader>>();
  useEffect(() => {
    castFetcher.load(route("/api/casts/:code", { code: data.product.code }));
  }, [castFetcher.load, data.product.code]);

  const ref = useRef<HTMLVideoElement>(null);

  return (
    <Box w="full" p={2} position="relative">
      <Image
        rounded={"md"}
        src={data.product.imageUrls[0]}
        fit={"cover"}
        align={"center"}
        w={"100%"}
        h="320px"
        objectPosition={"right top"}
      />
      <Box position="absolute" top={6} right={6}>
        <Link href={data.product.url} target="_blank" rel="noopener noreferrer">
          <Icon as={BiLinkExternal} boxSize={8} color="teal.200" />
        </Link>
      </Box>
      <Stack my={6} px={4} spacing={6}>
        <Flex>
          <Spacer />
          <DownloadTasksPanel code={data.product.code} mr={4} />
          {data.product.sample && (
            <Box>
              <Icon
                as={BiPlayCircle}
                boxSize={8}
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
          <TorrentPanel code={data.product.code} mr={4} />
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
                mr={2}
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
                リリース日:
              </Text>{" "}
              {data.product.releasedAt}
            </ListItem>
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                SKU:
              </Text>{" "}
              {data.product.code}
            </ListItem>
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
