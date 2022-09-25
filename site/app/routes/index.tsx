import { productsFromM } from "~/libs/products/mgs.server";
import { useLoaderData } from "@remix-run/react";
import { Heading } from "@chakra-ui/react";

export const loader = async () => {
  return await productsFromM(1);
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  console.log(data);

  return (
    <div>
      <Heading as="h2">Welcome to Remix</Heading>
    </div>
  );
}
