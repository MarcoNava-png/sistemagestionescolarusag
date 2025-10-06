import { apiFetch } from "@/lib/fetcher"
import { Student } from "../types";

export const getStudents = (page: number = 1, pageSize: number = 20) => {
    return apiFetch<Student>("/estudiantes?page=" + page + "&pageSize=" + pageSize);
}