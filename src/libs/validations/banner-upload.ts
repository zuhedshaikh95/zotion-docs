import * as z from "zod";

export const BannerUploadSchema = z.object({
  bannerUrl: z.any().describe("Banner Image"),
});
