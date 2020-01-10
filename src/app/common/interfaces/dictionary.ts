import { DictionaryRecord } from './dictionary_record';

export interface Dictionary {
  type: string;
  records: DictionaryRecord[];
}
