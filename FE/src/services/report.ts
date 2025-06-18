import instance from "@/utils/request";

export const apiReport = async (formData: FormData): Promise<void> => {
  await instance.post("/reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
