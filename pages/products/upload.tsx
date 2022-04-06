import useMutation from "@libs/client/useMutation";
import { Product } from "@prisma/client";
import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  photo: FileList;
}
interface UploadProductMutation {
  ok: boolean;
  product: Product;
}
const Upload: NextPage = () => {
  const [photoPreview, setPhotoPreview] = useState("");
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const [uploadProduct, { loading, datas }] =
    useMutation<UploadProductMutation>("/api/products");
  const onValid = async ({
    description,
    name,
    photo,
    price,
  }: UploadProductForm) => {
    if (loading) return;
    if (photo && photo.length > 0) {
      const { uploadURL } = await axios
        .get("/api/files")
        .then((res) => res.data);
      const form = new FormData();
      form.append("file", photo[0], name);
      const {
        result: { id },
      } = await axios.post(uploadURL, form).then((res) => res.data);
      uploadProduct({ description, name, photoId: id, price });
    } else {
      uploadProduct({ description, name, price });
    }
  };
  useEffect(() => {
    if (datas?.ok) {
      router.push(`/products/${datas.product.id}`);
    }
  }, [datas, router]);
  const photo = watch("photo");
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);
  return (
    <Layout canGoBack title="Upload Product">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div>
          {photoPreview ? (
            <img
              src={photoPreview}
              className="w-full  text-gray-600 h-48 rounded-md"
            />
          ) : (
            <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                {...register("photo")}
                accept="image/*"
                className="hidden"
                type="file"
              />
            </label>
          )}
        </div>
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="number"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
          required
        />
        <Button text={loading ? "loading..." : "Upload item"} />
      </form>
    </Layout>
  );
};

export default Upload;
