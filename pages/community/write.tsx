import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import Button from "../../components/button";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";
import { Post } from "@prisma/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useCoords from "@libs/client/useCoords";

interface WriteForm {
  question: string;
}
interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const { register, handleSubmit } = useForm<WriteForm>();
  const router = useRouter();
  const [post, { loading, datas }] = useMutation<WriteResponse>("/api/posts");
  const onValid = (data: WriteForm) => {
    if (loading) return;
    post({ ...data, latitude, longitude });
  };
  useEffect(() => {
    if (datas && datas.ok) {
      router.push(`/community/${datas.post.id}`);
    }
  }, [datas, router]);
  return (
    <Layout canGoBack title="Write Post">
      <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
        <TextArea
          register={register("question", { required: true, minLength: 5 })}
          required
          placeholder="Ask a question!"
        />
        <Button text={loading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
