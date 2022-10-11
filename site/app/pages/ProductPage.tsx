import { useLoaderData } from "@remix-run/react";
import { useReducer } from "react";
import {
  Box,
  Image,
  List,
  ListItem,
  Stack,
  Text,
  Flex,
  Icon,
  Spacer,
  Link,
} from "@chakra-ui/react";
import { loader } from "~/routes/__authed/product.$code";
import { BookmarkButton } from "~/components/BookmarkButton";
import { BiLinkExternal } from "react-icons/bi";
import { DownloadButton } from "~/components/DownloadButton";
import { Casts } from "~/components/Casts";
import { BookmarkProvider } from "~/components/BookmarkProvider";
import { MediaButton } from "~/components/MediaButton";

export const ProductPage = () => {
  const data = useLoaderData<typeof loader>();
  const [showFull, toggle] = useReducer((s) => !s, false);

  return (
    <BookmarkProvider code={data.product.code}>
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
        <Stack my={6} px={4} spacing={3}>
          <Flex>
            <Link
              href={data.product.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon as={BiLinkExternal} boxSize={8} />
            </Link>
            <Spacer />
            <MediaButton sample={data.product.sample} mr={4} />
            <DownloadButton code={data.product.code} mr={4} />
            <BookmarkButton />
          </Flex>
          <Box>
            <Text
              as="h1"
              noOfLines={showFull ? undefined : 3}
              fontSize={"lg"}
              color="white"
              fontWeight="bold"
              onClick={toggle}
            >
              {data.product.title}
            </Text>
          </Box>
          <Casts code={data.product.code} />
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
          {data.product.imageUrls.map((image, i) => (
            <Image src={image} key={image + i} loading="lazy" />
          ))}
        </Stack>
      </Box>
    </BookmarkProvider>
  );
};
