import * as z from "zod";

export const CreateWorkspaceFormSchema = z.object({
  workspaceName: z.string().describe("Workspace Name").min(3, "Too short! Pick a good name"),
  logo: z.any(),
});
