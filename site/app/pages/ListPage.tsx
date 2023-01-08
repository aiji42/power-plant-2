import { useLoaderData, useLocation } from "@remix-run/react";
import { Grid, Box, Slide, CircularProgress, Center } from "@chakra-ui/react";
import { route } from "routes-gen";
import { useSwipeToNext } from "~/hooks/useSwipeToNext";
import { loader } from "~/routes/__authed/stock.$page";
import { ReactNode, useEffect } from "react";
import { useDataRefresh } from "remix-utils";
import { SwipeBesideNavi } from "~/components/SwipeBesideNavi";
import { Toolbar } from "~/components/Toolbar";
import { ProductCard } from "~/components/ProductCard";

export function ListPage() {
  const data = useLoaderData<typeof loader>();
  useRefreshForTaskStatus();

  return (
    <SwipeBeside>
      <SwipeNext nextTo={data.nextTo}>
        <Box py={2} px={1}>
          <Toolbar />
          <Grid templateColumns="repeat(3, 1fr)" gap={1}>
            {data.items.map((item) => (
              <ProductCard key={item.sku} {...item} />
            ))}
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
      data.items.some(({ downloadStatus }) =>
        ["Waiting", "Running"].includes(downloadStatus ?? "")
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
