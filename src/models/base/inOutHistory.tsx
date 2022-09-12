import { Camera } from "./camera";
import { Employee } from "./employee";
import { Metadata } from "./metadata";

export interface InOutHistory {
  id: number;
  type: string;
  image: Metadata | null;
  time: string;
  camera: Camera;
  employee: Employee;
  status: string;
}
