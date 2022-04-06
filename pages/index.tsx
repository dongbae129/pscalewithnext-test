import useUser from "@libs/client/useUser";
import { Product } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useQuery } from "react-query";
import FloatingButton from "../components/floating-button";
import Item from "../components/item";
import Layout from "../components/layout";

interface ProductWithFav extends Product {
  _count: {
    fav: number;
  };
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithFav[];
}
const Home: NextPage = () => {
  // useUser();
  // const { user, isLoading } = useUser();
  const { data, isLoading } = useQuery<ProductsResponse>("products", () =>
    fetch("/api/products").then((res) => res.json())
  );
  if (isLoading) return <strong>Loading....</strong>;
  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products?.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            image={product.image}
            hearts={product._count.fav}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;
