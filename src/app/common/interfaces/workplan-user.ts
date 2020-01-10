export interface WorkplanUser {
  login: string;
  name: string;
  firstName: string;
  lastName: string;
  workgroup: string[];
  absence: {
    unid: string;
    dateOfBeginning: string;
    dateOfClosing: string;
    cause: string;
    involvement: number
    deputyLogin?: string;
  }[];
}
