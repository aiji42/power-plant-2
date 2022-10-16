import { Link, useLoaderData, useLocation } from "@remix-run/react";
import {
  Grid,
  GridItem,
  Box,
  Slide,
  CircularProgress,
  Center,
  Text,
  Icon,
  Image,
} from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa";
import { route } from "routes-gen";
import { useSwipeToNext } from "~/hooks/useSwipeToNext";
import { loader } from "~/routes/__authed/stock.$page";
import { color } from "~/libs/status/utils";
import { ReactNode, useEffect } from "react";
import { useDataRefresh } from "remix-utils";
import { SwipeBesideNavi } from "~/components/SwipeBesideNavi";
import { Toolbar } from "~/components/Toolbar";

export function ListPage() {
  const data = useLoaderData<typeof loader>();
  useRefreshForTaskStatus();

  return (
    <SwipeBeside>
      <SwipeNext nextTo={data.nextTo}>
        <Box p={2}>
          <Toolbar />
          <Grid templateColumns="repeat(3, 1fr)" gap={2}>
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
      </SwipeNext>
    </SwipeBeside>
  );
}

const useRefreshForTaskStatus = () => {
  const data = useLoaderData<typeof loader>();
  const { refresh } = useDataRefresh();
  useEffect(() => {
    if (
      data.items.some(({ status }) =>
        ["Waiting", "Running"].includes(status ?? "")
      )
    ) {
      const interval = setInterval(refresh, 10000);
      return () => clearInterval(interval);
    }
  }, [refresh, data.items]);
};

const SwipeBeside = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { leftTo, rightTo } = location.pathname.startsWith("/mgs")
    ? {
        leftTo: route("/stock/:page", { page: "1" }),
        rightTo: route("/fana/:page", { page: "1" }),
      }
    : location.pathname.startsWith("/fana")
    ? {
        leftTo: route("/mgs/:page", { page: "1" }),
        rightTo: route("/fanc/:page", { page: "1" }),
      }
    : location.pathname.startsWith("/fanc")
    ? {
        leftTo: route("/fana/:page", { page: "1" }),
        rightTo: route("/stock/:page", { page: "1" }),
      }
    : {
        leftTo: route("/fanc/:page", { page: "1" }),
        rightTo: route("/mgs/:page", { page: "1" }),
      };

  return (
    <SwipeBesideNavi leftTo={leftTo} rightTo={rightTo}>
      {children}
    </SwipeBesideNavi>
  );
};

const SwipeNext = ({
  nextTo,
  children,
}: {
  nextTo: string;
  children: ReactNode;
}) => {
  const { handler, swiping } = useSwipeToNext(nextTo);

  return (
    <Box {...handler}>
      {children}
      <Slide direction="bottom" in={swiping}>
        <Center mb={24}>
          <CircularProgress isIndeterminate color="teal.300" />
        </Center>
      </Slide>
    </Box>
  );
};
