import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useFetcher } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/node";
import { loader as bookmarkLoader } from "~/routes/__authed/api/bookmark.$code";
import { route } from "routes-gen";
import { clearInterval } from "timers";

const Context = createContext<
  SerializeFrom<typeof bookmarkLoader> & {
    handlers: {
      addDownloadTask: (url: string) => void;
      addBookmark: () => void;
      deleteBookmark: () => void;
    };
    isBookmarking: boolean;
  }
>({
  bookmark: null,
  handlers: {
    addDownloadTask: () => {},
    addBookmark: () => {},
    deleteBookmark: () => {},
  },
  isBookmarking: false,
});

export const BookmarkProvider = ({
  code,
  children,
}: {
  code: string;
  children: ReactNode;
}) => {
  const fetcher = useFetcher<SerializeFrom<typeof bookmarkLoader>>();
  const action = route("/api/bookmark/:code", { code });
  const refreshBookmark = useCallback(() => {
    fetcher.load(action);
  }, [fetcher.load, action]);
  const addDownloadTask = useCallback(
    (url: string) => {
      fetcher.submit({ url }, { action, method: "patch" });
    },
    [fetcher.submit, action]
  );
  const addBookmark = useCallback(() => {
    fetcher.submit({}, { action, method: "post" });
  }, [fetcher.submit, action]);
  const deleteBookmark = useCallback(() => {
    fetcher.submit({}, { action, method: "delete" });
  }, [fetcher.submit, action]);

  useEffect(() => {
    refreshBookmark();
  }, [code, refreshBookmark]);

  useEffect(() => {
    if (
      ["Waiting", "Running"].includes(
        fetcher.data?.bookmark?.downloadTasks?.[0]?.status ?? ""
      )
    ) {
      const id = setInterval(refreshBookmark, 10000);
      return () => clearInterval(id);
    }
  }, [fetcher.data?.bookmark?.downloadTasks?.[0]?.status, refreshBookmark]);

  return (
    <Context.Provider
      value={{
        bookmark: fetcher.data?.bookmark ?? null,
        handlers: { addDownloadTask, addBookmark, deleteBookmark },
        isBookmarking:
          fetcher.submission?.method === "POST"
            ? true
            : fetcher.submission?.method === "DELETE"
            ? false
            : !!fetcher.data?.bookmark,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useBookmarkProvider = () => {
  return useContext(Context);
};
