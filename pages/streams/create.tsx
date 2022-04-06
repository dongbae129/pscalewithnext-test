import { Stream } from "@prisma/client";
import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";

interface CreateForm {
  name: string;
  price: string;
  description: string;
}
interface CreateResponse {
  ok: boolean;
  stream: Stream;
  error?: string;
}
const Create: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<CreateForm>();
  const onValid = (form: CreateForm) => {
    if (isLoading) return;
    mutate(form);
  };
  const { mutate, data, isLoading } = useMutation<
    CreateResponse,
    any,
    CreateForm
  >((formData) => axios.post("/api/streams", formData).then((res) => res.data));
  useEffect(() => {
    if (data && data.ok) router.push(`/streams/${data.stream.id}`);
  }, [data, router]);
  return (
    <Layout canGoBack title="Go Live">
      <form onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true, valueAsNumber: true })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
        />
        <Button isLoading={isLoading} text="Go live" />
      </form>
    </Layout>
  );
};

export default Create;
