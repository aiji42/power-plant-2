import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useTransition,
} from "@remix-run/react";
import { withEmotionCache } from "@emotion/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ServerStyleContext, ClientStyleContext } from "~/styles/context";
import { ReactNode, useContext, useEffect } from "react";
import { ProgressBar } from "~/components/ProgressBar";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Power plant 2",
  viewport: "width=device-width,initial-scale=1",
});

export let links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
    },
  ];
};

const theme = {
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
};

interface DocumentProps {
  children: ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    const transition = useTransition();

    return (
      <html lang="ja" style={{ colorScheme: "dark" }}>
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
          {transition.state === "loading" && <ProgressBar />}
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <ChakraProvider theme={extendTheme(theme)}>
        <Outlet />
      </ChakraProvider>
    </Document>
  );
}
