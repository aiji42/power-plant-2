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

const Context = createContext<
  SerializeFrom<typeof bookmarkLoader> & {
    handlers: {
      addDownloadTask: (url: string) => void;
      addCompressTask: (mediaId: string) => void;
      addBookmark: () => void;
      deleteBookmark: () => void;
      deleteMedia: (id: string) => void;
      connectCast: (name: string) => void;
      disconnectCast: (name: string) => void;
    };
    isBookmarking: boolean;
    optimist: boolean;
  }
>({
  bookmark: null,
  randomCode: "",
  handlers: {
    addDownloadTask: () => {},
    addCompressTask: () => {},
    addBookmark: () => {},
    deleteBookmark: () => {},
    deleteMedia: () => {},
    connectCast: () => {},
    disconnectCast: () => {},
  },
  isBookmarking: false,
  optimist: false,
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
      fetcher.submit(
        { action: "addDownloadTask", url },
        { action, method: "patch" }
      );
    },
    [fetcher.submit, action]
  );
  const addCompressTask = useCallback(
    (mediaId: string) => {
      fetcher.submit(
        { action: "addCompressTask", mediaId },
        { action, method: "patch" }
      );
    },
    [fetcher.submit, action]
  );
  const deleteMedia = useCallback(
    (id: string) => {
      fetcher.submit(
        { action: "deleteMedia", id },
        { action, method: "patch" }
      );
    },
    [fetcher.submit, action]
  );
  const connectCast = useCallback(
    (name: string) => {
      fetcher.submit(
        { action: "connectCast", name },
        { action, method: "patch" }
      );
    },
    [fetcher.submit, action]
  );
  const disconnectCast = useCallback(
    (name: string) => {
      fetcher.submit(
        { action: "disconnectCast", name },
        { action, method: "patch" }
      );
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
      ) ||
      ["Waiting", "Running"].includes(
        fetcher.data?.bookmark?.compressTasks?.[0]?.status ?? ""
      )
    ) {
      const id = setInterval(refreshBookmark, 10000);
      return () => clearInterval(id);
    }
  }, [
    fetcher.data?.bookmark?.downloadTasks?.[0]?.status,
    fetcher.data?.bookmark?.compressTasks?.[0]?.status,
    refreshBookmark,
  ]);

  return (
    <Context.Provider
      value={{
        bookmark: fetcher.data?.bookmark ?? null,
        randomCode: fetcher.data?.randomCode ?? "",
        handlers: {
          addDownloadTask,
          addCompressTask,
          addBookmark,
          deleteBookmark,
          deleteMedia,
          connectCast,
          disconnectCast,
        },
        isBookmarking:
          fetcher.submission?.method === "POST"
            ? true
            : fetcher.submission?.method === "DELETE"
            ? false
            : !!fetcher.data?.bookmark,
        optimist: fetcher.state !== "idle",
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useBookmarkProvider = () => {
  return useContext(Context);
};
