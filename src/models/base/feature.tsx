import { Role } from "./role";

export interface Feature {
  id: number;
  name: string;
  description: string;
  roles: Array<Role>;
  numberAccount: number;
  numberOrganization: number;
}

export const convertResponseToFeature = (response: any) => ({
  id: response.id,
  name: response.name,
  description: response.description,
  roles: response.roles,
  numberAccount: response.number_account,
  numberOrganization: response.number_organization,
});
