export interface SubjectItem {
  idSubject: number;
  clave: string;
  nombre: string;
  creditos: number;
  status?: number;
}

export type SubjectsData = SubjectItem[];

export interface CreateSubjectPayload {
  clave: string;
  nombre: string;
  creditos: number;
}

export interface UpdateSubjectPayload extends CreateSubjectPayload {
  idSubject: number;
  status?: number;
}
