import useUser from "@libs/client/useUser";
import { Message, Stream } from "@prisma/client";
import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Updater } from "react-query/types/core/utils";
import Layout from "../../components/layout";
import MessageComp from "../../components/message";

interface StreamMessage {
  id: number;
  message: string;
  user: {
    avatar?: string;
    id: number;
  };
}
interface StreamWithMessages extends Stream {
  messages: StreamMessage[];
}
interface StreamDetailResponse {
  ok: boolean;
  stream: StreamWithMessages;
}
interface MessageForm {
  message: string;
}
interface MessageResponse {
  ok: boolean;
  message: Message;
  error?: string;
}
const Stream: NextPage = () => {
  const { user } = useUser();
  const queryclient = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { data, refetch } = useQuery<StreamDetailResponse>(
    "streamDetail",
    () => axios.get(`/api/streams/${router.query.id}`).then((res) => res.data),
    {
      enabled: !!router.query.id,
    }
  );
  const {
    mutate,
    data: sendMessageData,
    isLoading,
  } = useMutation<MessageResponse, any, MessageForm>(
    (message) =>
      axios
        .post(`/api/streams/${router.query.id}/messages`, message)
        .then((res) => res.data),
    {
      onSuccess: () => {
        // console.log(data, "Data");/
        refetch();
        // queryclient.setQueryData("streamDetail", (prev: any) => ({
        //   ...prev,
        //   stream: {
        //     ...prev.stream,
        //     messages: [
        //       ...prev.stream.messages,
        //       {
        //         id: messageData?.createdMessage?.id,
        //         message: messageData?.createdMessage?.message,
        //       },
        //     ],
        //   },
        // }));
      },
      // onSuccess: () => refetch(),
      // onMutate: () => {
      //   queryclient.setQueryData("streamDetail", (prev: any) => ({
      //     ...prev,
      //     stream: {
      //       ...prev.stream,
      //       messages: [
      //         ...prev.stream.messages,
      //         {
      //           id: sendMessageData?.createdMessage?.id,
      //           message: sendMessageData?.createdMessage?.message,
      //         },
      //       ],
      //     },
      //   }));
      // },
    }
  );
  const onValid = (form: MessageForm) => {
    if (isLoading) return;
    mutate(form);
    reset();
  };
  return (
    <Layout canGoBack>
      <div className="py-10 px-4  space-y-4">
        <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            ${data?.stream?.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {data?.stream.messages.map((message) => (
              <MessageComp
                key={message.id}
                message={message.message}
                reversed={message.user?.id === user?.id ? true : false}
              />
            ))}
          </div>
          <div className="fixed py-2 bg-white bottom-0 inset-x-0">
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex relative max-w-md items-center  w-full mx-auto"
            >
              <input
                {...register("message", { required: true })}
                type="text"
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stream;
