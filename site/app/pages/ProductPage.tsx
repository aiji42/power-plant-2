import { useLoaderData } from "@remix-run/react";
import { ReactNode, useReducer } from "react";
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
  IconButton,
} from "@chakra-ui/react";
import { loader } from "~/routes/__authed/product.$code";
import { BookmarkButton } from "~/components/BookmarkButton";
import { BiLinkExternal, BiClipboard, BiCheck } from "react-icons/bi";
import { DownloadButton } from "~/components/DownloadButton";
import { Casts } from "~/components/Casts";
import {
  BookmarkProvider,
  useBookmarkProvider,
} from "~/components/BookmarkProvider";
import { MediaButton } from "~/components/MediaButton";
import { TaskButton } from "~/components/TasksButton";
import { route } from "routes-gen";
import { SwipeBesideNavi } from "~/components/SwipeBesideNavi";
import { Toolbar } from "~/components/Toolbar";
import { PlayButton } from "~/components/PlayButton";

export const ProductPage = () => {
  const data = useLoaderData<typeof loader>();
  const [showFull, toggle] = useReducer((s) => !s, false);
  const [copied, copy] = useReducer(() => {
    navigator.clipboard.writeText(data.product.code);
    return true;
  }, false);

  return (
    <BookmarkProvider code={data.product.code}>
      <SwipeBeside>
        <Box w="full" p={2}>
          <Toolbar />
          <Box position="relative">
            <Image
              rounded={"md"}
              src={data.product.imageUrls[0]}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h="320px"
              objectPosition={"right top"}
            />
            {(data.product.media ?? data.product.sample) && (
              <Box
                position="absolute"
                h={16}
                w={16}
                top={0}
                bottom={0}
                left={0}
                right={0}
                margin="auto"
              >
                <PlayButton
                  w="100%"
                  h="100%"
                  fontSize={88}
                  shadow="md"
                  rounded="full"
                  color="telegram.200"
                  backdropFilter="auto"
                  backdropBlur="4px"
                  src={data.product.media ?? data.product.sample ?? ""}
                />
              </Box>
            )}
          </Box>
          <Stack my={6} px={4} spacing={3}>
            <Flex>
              <Link
                href={data.product.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon as={BiLinkExternal} fontSize="2xl" />
              </Link>
              <Spacer />
              <TaskButton mr={4} />
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
                  <IconButton
                    aria-label="Copy"
                    icon={
                      <Icon
                        as={copied ? BiCheck : BiClipboard}
                        color={copied ? "teal.300" : undefined}
                      />
                    }
                    onClick={copy}
                    bg="inherit"
                  />
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
                  {data.product.length || "-"}
                  {data.product.length && "m"}
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
      </SwipeBeside>
    </BookmarkProvider>
  );
};

const SwipeBeside = ({ children }: { children: ReactNode }) => {
  const { randomCode } = useBookmarkProvider();

  return (
    <SwipeBesideNavi
      rightTo={
        randomCode ? route("/product/:code", { code: randomCode }) : undefined
      }
    >
      {children}
    </SwipeBesideNavi>
  );
};
