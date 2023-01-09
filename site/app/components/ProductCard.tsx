import { route } from "routes-gen";
import { Box, GridItem, Icon, Image, Tag, Text } from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa";
import { color } from "~/libs/status/utils";
import humanFormat from "human-format";
import { Link } from "@remix-run/react";
import { ProductList } from "~/libs/products/priducts";

export const ProductCard = ({
  image_path: src,
  name,
  sku: code,
  casts,
  downloadStatus,
  compressStatus,
  mediaSize,
}: ProductList[number]) => {
  return (
    <Link key={code} to={route("/product/:code", { code })}>
      <GridItem w="100%" minH={48} position="relative" mb={2}>
        <Box position="relative">
          <Image src={src} alt={name} w="full" loading="lazy" />
          {downloadStatus && !mediaSize && (
            <Icon
              as={FaCircle}
              color={color(downloadStatus)}
              top={-2}
              left={-2}
              position="absolute"
              fontSize="md"
            />
          )}
          {mediaSize && (
            <Tag
              size="sm"
              variant="solid"
              bottom={0}
              right={0}
              position="absolute"
              bg={compressStatus ? color(compressStatus, 500) : "gray.500"}
            >
              {humanFormat(Number(mediaSize), { unit: "B" })}
            </Tag>
          )}
        </Box>
        <Text fontSize="3xs" noOfLines={1}>
          {name}
        </Text>
        <Text fontSize="3xs" noOfLines={1} color="teal.200">
          {casts.join("/")}
        </Text>
      </GridItem>
    </Link>
  );
};
