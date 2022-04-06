import { Product, Sale } from "@prisma/client";
import axios from "axios";
import { useQuery } from "react-query";
import Item from "./item";

interface ProductListProps {
  kind: "favs" | "sales" | "purchases";
}
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
export default function ProductList({ kind }: ProductListProps) {
  const { data } = useQuery<ProductListResponse>(["productList", kind], () =>
    axios.get(`/api/users/me/${kind}`).then((res) => res.data)
  );
  return data ? (
    <>
      {data[kind]?.map((record) => (
        <Item
          id={record.product.id}
          key={record.product.id}
          title={record.product.name}
          price={record.product.price}
          hearts={record.product._count.fav}
        />
      ))}
    </>
  ) : null;
}
