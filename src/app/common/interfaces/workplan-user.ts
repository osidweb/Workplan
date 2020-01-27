export interface WorkplanUser {
  login: string;
  name: string;
  workgroup: string;
  absence: {
    unid: string;
    dateOfBeginning: string;
    dateOfClosing: string;
    cause: string;
  }[];
  employmentDate: string;
  dismissDate?: string;
}
