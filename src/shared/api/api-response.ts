export type ApiResponse<Data> =
  { success: true; data: Data } | { success: false; error: { code: string; message: string } };
