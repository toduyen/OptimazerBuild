import { Role } from "../models/base/role";
import { User } from "../models/base/user";
import {
  MODULE_AREA_RESTRICTION_TYPE,
  MODULE_BEHAVIOR_TYPE,
  MODULE_TIME_KEEPING_TYPE,
  ROLE_AREA_RESTRICTION_ADMIN,
  ROLE_AREA_RESTRICTION_USER,
  ROLE_BEHAVIOR_ADMIN,
  ROLE_BEHAVIOR_USER,
  ROLE_SUPER_ADMIN,
  ROLE_SUPER_ADMIN_ORGANIZATION,
  ROLE_TIME_KEEPING_ADMIN,
  ROLE_TIME_KEEPING_USER,
} from "../constants/app";

const isTimeKeepingModule = () => {
  const module = localStorage.getItem("module");
  if (module) {
    return module === MODULE_TIME_KEEPING_TYPE;
  }
  return false;
};

const isAreaRestrictionModule = () => {
  const module = localStorage.getItem("module");
  if (module) {
    return module === MODULE_AREA_RESTRICTION_TYPE;
  }
  return false;
};

const isBehaviorModule = () => {
  const module = localStorage.getItem("module");
  if (module) {
    return module === MODULE_BEHAVIOR_TYPE;
  }
  return false;
};

const isSuperAdmin = (currentUser: User): boolean => currentUser?.parentUser === null;

const isSuperAdminOrganization = (currentUser: User): boolean => {
  if (currentUser.parentUser) {
    return (
      currentUser.parentUser.roles.filter((role: Role) => role.name === ROLE_SUPER_ADMIN).length > 0
    );
  }
  return false;
};

const isTimeKeepingAdmin = (currentUser: User): boolean => {
  if (currentUser.parentUser) {
    return (
      currentUser.parentUser.roles.filter((role: Role) => role.name === ROLE_TIME_KEEPING_ADMIN)
        .length > 0 &&
      currentUser.roles.filter((role: Role) => role.name === ROLE_TIME_KEEPING_ADMIN).length > 0 &&
      isTimeKeepingModule()
    );
  }
  return false;
};

const isTimeKeepingUser = (currentUser: User): boolean => {
  if (currentUser.parentUser) {
    return (
      currentUser.roles.filter((role: Role) => role.name === ROLE_TIME_KEEPING_USER).length > 0 &&
      isTimeKeepingModule()
    );
  }
  return false;
};
const isAreaRestrictionAdmin = (currentUser: User): boolean => {
  if (currentUser.parentUser) {
    return (
      currentUser.parentUser.roles.filter((role: Role) => role.name === ROLE_AREA_RESTRICTION_ADMIN)
        .length > 0 &&
      currentUser.roles.filter((role: Role) => role.name === ROLE_AREA_RESTRICTION_ADMIN).length >
        0 &&
      isAreaRestrictionModule()
    );
  }
  return false;
};

const isAreaRestrictionUser = (currentUser: User): boolean => {
  if (currentUser.parentUser) {
    return (
      currentUser.roles.filter((role: Role) => role.name === ROLE_AREA_RESTRICTION_USER).length >
        0 && isAreaRestrictionModule()
    );
  }
  return false;
};

const isBehaviorAdmin = (currentUser: User): boolean => {
  if (currentUser.parentUser) {
    return (
      currentUser.parentUser.roles.filter((role: Role) => role.name === ROLE_BEHAVIOR_ADMIN)
        .length > 0 &&
      currentUser.roles.filter((role: Role) => role.name === ROLE_BEHAVIOR_ADMIN).length > 0 &&
      isBehaviorModule()
    );
  }
  return false;
};

const isBehaviorUser = (currentUser: User): boolean => {
  if (currentUser.parentUser) {
    return (
      currentUser.roles.filter((role: Role) => role.name === ROLE_BEHAVIOR_USER).length > 0 &&
      isBehaviorModule()
    );
  }
  return false;
};

const hasRole = (currentUser: User, roles: Array<string>) =>
  (roles.includes(ROLE_SUPER_ADMIN) && isSuperAdmin(currentUser)) ||
  (roles.includes(ROLE_SUPER_ADMIN_ORGANIZATION) && isSuperAdminOrganization(currentUser)) ||
  (roles.includes(ROLE_TIME_KEEPING_ADMIN) && isTimeKeepingAdmin(currentUser)) ||
  (roles.includes(ROLE_TIME_KEEPING_USER) && isTimeKeepingUser(currentUser)) ||
  (roles.includes(ROLE_AREA_RESTRICTION_ADMIN) && isAreaRestrictionAdmin(currentUser)) ||
  (roles.includes(ROLE_AREA_RESTRICTION_USER) && isAreaRestrictionUser(currentUser)) ||
  (roles.includes(ROLE_BEHAVIOR_ADMIN) && isBehaviorAdmin(currentUser)) ||
  (roles.includes(ROLE_BEHAVIOR_USER) && isBehaviorUser(currentUser));

const hasRoleModule = (currentUser: User, module: string) => {
  if (currentUser.parentUser) {
    return (
      (currentUser.parentUser.roles.filter((role: Role) => role.name === ROLE_TIME_KEEPING_ADMIN)
        .length > 0 &&
        currentUser.roles.filter((role: Role) => role.name === ROLE_TIME_KEEPING_ADMIN).length >
          0 &&
        module === MODULE_TIME_KEEPING_TYPE) ||
      (currentUser.roles.filter((role: Role) => role.name === ROLE_TIME_KEEPING_USER).length > 0 &&
        module === MODULE_TIME_KEEPING_TYPE) ||
      (currentUser.parentUser.roles.filter(
        (role: Role) => role.name === ROLE_AREA_RESTRICTION_ADMIN
      ).length > 0 &&
        currentUser.roles.filter((role: Role) => role.name === ROLE_AREA_RESTRICTION_ADMIN).length >
          0 &&
        module === MODULE_AREA_RESTRICTION_TYPE) ||
      (currentUser.roles.filter((role: Role) => role.name === ROLE_AREA_RESTRICTION_USER).length >
        0 &&
        module === MODULE_AREA_RESTRICTION_TYPE) ||
      (currentUser.parentUser.roles.filter((role: Role) => role.name === ROLE_BEHAVIOR_ADMIN)
        .length > 0 &&
        currentUser.roles.filter((role: Role) => role.name === ROLE_BEHAVIOR_ADMIN).length > 0 &&
        module === MODULE_BEHAVIOR_TYPE) ||
      (currentUser.roles.filter((role: Role) => role.name === ROLE_BEHAVIOR_USER).length > 0 &&
        module === MODULE_BEHAVIOR_TYPE)
    );
  }
  return false;
};

const hasMultiRole = (user: User) => {
  let count = 0;
  if (hasRoleModule(user, MODULE_TIME_KEEPING_TYPE)) {
    count++;
  }
  if (hasRoleModule(user, MODULE_AREA_RESTRICTION_TYPE)) {
    count++;
  }
  if (hasRoleModule(user, MODULE_BEHAVIOR_TYPE)) {
    count++;
  }

  return count > 1;
};

export {
  hasRole,
  isSuperAdmin,
  isSuperAdminOrganization,
  isTimeKeepingAdmin,
  isTimeKeepingUser,
  isAreaRestrictionAdmin,
  isAreaRestrictionUser,
  isAreaRestrictionModule,
  isTimeKeepingModule,
  isBehaviorAdmin,
  isBehaviorUser,
  isBehaviorModule,
  hasRoleModule,
  hasMultiRole,
};
