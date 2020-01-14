import { DictionaryRecord } from './dictionary-record';

export interface Dictionary {
  type: string;
  records: DictionaryRecord[];
}
