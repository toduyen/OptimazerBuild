import { convertResponseToOrganization, Organization } from "./organization";
import { Role } from "./role";
import { convertResponseToMetadata, Metadata } from "./metadata";
import { Location } from "./location";

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  avatar: Metadata | null;
  organization: Organization | null;
  location: Location | null;
  roles: Array<Role>;
  parentUser: User | null;
  status: string;
}

export const convertResponseToUser = (response: any) => ({
  id: response.id,
  fullName: response.fullname,
  username: response.username,
  email: response.email,
  avatar: response.avatar ? convertResponseToMetadata(response.avatar) : null,
  organization: convertResponseToOrganization(response.organization),
  location: response.location,
  roles: response.roles,
  parentUser: response.parent_user
    ? {
        id: response.parent_user.id,
        fullName: response.parent_user.fullname,
        username: response.parent_user.username,
        email: response.parent_user.email,
        avatar: response.parent_user.avatar,
        roles: response.parent_user.roles,
      }
    : null,
  status: response.status,
});
