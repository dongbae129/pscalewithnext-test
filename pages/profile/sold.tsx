import ProductList from "@components/product-list";
import { Product, Sale } from "@prisma/client";
import axios from "axios";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import Item from "../../components/item";
import Layout from "../../components/layout";

interface ProductWithCount extends Product {
  _count: {
    fav: number;
  };
}
interface SoldWithProduct extends Sale {
  product: ProductWithCount;
}
interface ProductListResponse {
  [key: string]: SoldWithProduct[];
}
const Sold: NextPage = () => {
  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductList kind="sales" />
      </div>
    </Layout>
  );
};

export default Sold;
