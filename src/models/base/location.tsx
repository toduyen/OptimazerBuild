import { convertResponseToOrganization, Organization } from "models/base/organization";

export interface Location {
  id: number;
  name: string;
  code: string;
  type: string;
  organization: Organization | null;
  numberCamera: number;
  numberEmployee: number;
}

export const convertResponseToLocation = (response: any) => ({
  id: response.id,
  name: response.name,
  code: response.code,
  type: response.type,
  organization: response.organization ? convertResponseToOrganization(response.organization) : null,
  numberCamera: response.number_camera,
  numberEmployee: response.number_employee,
});
