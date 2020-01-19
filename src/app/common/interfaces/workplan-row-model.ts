export interface WorkplanRowModel {
  unid: string | null;
  login: string | null;
  editDate: {
    startDate: string | null;
    endDate: string | null;
  };
  cause: string | null;
}
