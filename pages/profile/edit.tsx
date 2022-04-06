import useUser from "@libs/client/useUser";
import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, UseMutationResult } from "react-query";

import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";

interface EditProfileForm {
  // [key: string] : string
  email?: string;
  phone?: string;
  name?: string;
  avatar?: FileList;
  formErrors?: string;
}
const EditProfile: NextPage = () => {
  const [avatarPreview, setAvatarPreview] = useState("");
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<EditProfileForm>();
  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);
  useEffect(() => {
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
    if (user?.name) setValue("name", user.name);
    if (user?.avatar)
      setAvatarPreview(
        `https://imagedelivery.net/FxBuAcNZC9hoWuotWmomWA/${user.avatar}/avatar`
      );
  }, [setValue, user]);
  interface EditResponse {
    ok: boolean;
    error?: string;
  }

  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (isLoading) return;
    if (email === "" && phone === "" && name === "")
      return setError("formErrors", { message: "One part is required" });
    {
      /* <form
     action="INSERT_UPLOAD_URL_HERE"
     method="post"
     enctype="multipart/form-data"
   >
     <input type="file" id="myFile" name="file" />
     <input type="submit" />
   </form> */
    }
    if (avatar && avatar.length > 0) {
      const { uploadURL } = await axios
        .get("/api/files")
        .then((res) => res.data);
      const form = new FormData();
      form.append("file", avatar[0]);
      const {
        result: { id },
      } = await axios.post(uploadURL, form).then((res) => res.data);
      console.log(id, "Data");

      mutate({ email, phone, name, avatar: id });
    } else {
      mutate({ email, phone, name });
    }
  };
  const { mutate, data, isLoading } = useMutation<
    EditResponse,
    any,
    EditProfileForm
  >((data) => axios.post("/api/users/me", data).then((res) => res.data));
  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("formErrors", { message: data.error });
    }
  }, [data, errors, setError]);

  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className="w-14 h-14 rounded-full bg-slate-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          required={false}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          required={false}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          required={false}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors.formErrors ? (
          <span className="my-2 text-red-600 block font-bold">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button isLoading={isLoading} text="Update profile" />
      </form>
    </Layout>
  );
};

export default EditProfile;
