import connectDB from '@/lib/db/mongodb';
import Role, { IRole, IPermission } from '@/lib/db/models/Role';
import User from '@/lib/db/models/User';
import { getSystemRolePermissions, mergePermissions } from '@/lib/utils/permissions';
import mongoose from 'mongoose';

/**
 * Service for managing roles and permissions
 */

export interface CreateRoleInput {
  organizationId: string;
  name: string;
  description?: string;
  permissions: IPermission[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissions?: IPermission[];
  isActive?: boolean;
}

/**
 * Get user's effective permissions
 * Combines system role permissions with custom role permissions
 */
export async function getUserPermissions(
  userId: string,
  organizationId: string
): Promise<IPermission[]> {
  await connectDB();

  const user = await User.findOne({
    _id: userId,
    organizationId,
    isActive: true,
  }).lean();

  if (!user) {
    throw new Error('User not found');
  }

  // If user has a custom role, fetch it
  let customPermissions: IPermission[] | undefined;
  if (user.roleId) {
    const customRole = await Role.findOne({
      _id: user.roleId,
      organizationId,
      isActive: true,
    }).lean();

    if (customRole) {
      customPermissions = customRole.permissions;
    }
  }

  // Merge system role permissions with custom permissions
  return mergePermissions(user.role, customPermissions);
}

/**
 * Create a new role
 */
export async function createRole(input: CreateRoleInput): Promise<IRole> {
  await connectDB();

  const role = await Role.create({
    organizationId: new mongoose.Types.ObjectId(input.organizationId),
    name: input.name,
    description: input.description,
    permissions: input.permissions,
    isSystem: false,
  });

  return role;
}

/**
 * Get role by ID
 */
export async function getRoleById(
  roleId: string,
  organizationId: string
): Promise<IRole | null> {
  await connectDB();

  const role = await Role.findOne({
    _id: roleId,
    organizationId,
  }).lean();

  return role;
}

/**
 * Get all roles for an organization
 */
export async function getRolesByOrganization(
  organizationId: string,
  includeSystem: boolean = true
): Promise<IRole[]> {
  await connectDB();

  const query: any = { organizationId };
  
  if (!includeSystem) {
    query.isSystem = false;
  }

  const roles = await Role.find(query).sort({ name: 1 }).lean();

  return roles;
}

/**
 * Update a role
 */
export async function updateRole(
  roleId: string,
  organizationId: string,
  input: UpdateRoleInput
): Promise<IRole | null> {
  await connectDB();

  const role = await Role.findOne({
    _id: roleId,
    organizationId,
  });

  if (!role) {
    throw new Error('Role not found');
  }

  if (role.isSystem) {
    throw new Error('System roles cannot be modified');
  }

  if (input.name !== undefined) role.name = input.name;
  if (input.description !== undefined) role.description = input.description;
  if (input.permissions !== undefined) role.permissions = input.permissions;
  if (input.isActive !== undefined) role.isActive = input.isActive;

  await role.save();

  return role;
}

/**
 * Delete a role
 */
export async function deleteRole(
  roleId: string,
  organizationId: string
): Promise<void> {
  await connectDB();

  const role = await Role.findOne({
    _id: roleId,
    organizationId,
  });

  if (!role) {
    throw new Error('Role not found');
  }

  if (role.isSystem) {
    throw new Error('System roles cannot be deleted');
  }

  // Check if any users are assigned this role
  const usersWithRole = await User.countDocuments({
    roleId: role._id,
    organizationId,
  });

  if (usersWithRole > 0) {
    throw new Error(
      `Cannot delete role. ${usersWithRole} user(s) are assigned to this role.`
    );
  }

  await Role.deleteOne({ _id: roleId });
}

/**
 * Assign a custom role to a user
 */
export async function assignRoleToUser(
  userId: string,
  roleId: string,
  organizationId: string
): Promise<void> {
  await connectDB();

  const role = await Role.findOne({
    _id: roleId,
    organizationId,
    isActive: true,
  });

  if (!role) {
    throw new Error('Role not found');
  }

  const user = await User.findOne({
    _id: userId,
    organizationId,
  });

  if (!user) {
    throw new Error('User not found');
  }

  user.roleId = role._id as mongoose.Types.ObjectId;
  await user.save();
}

/**
 * Remove custom role from a user (revert to system role only)
 */
export async function removeRoleFromUser(
  userId: string,
  organizationId: string
): Promise<void> {
  await connectDB();

  const user = await User.findOne({
    _id: userId,
    organizationId,
  });

  if (!user) {
    throw new Error('User not found');
  }

  user.roleId = undefined;
  await user.save();
}

/**
 * Initialize default system roles for an organization
 */
export async function initializeSystemRoles(
  organizationId: string
): Promise<void> {
  await connectDB();

  const systemRoles = ['admin', 'manager', 'employee', 'user'];

  for (const roleName of systemRoles) {
    const existingRole = await Role.findOne({
      organizationId,
      name: roleName,
      isSystem: true,
    });

    if (!existingRole) {
      await Role.create({
        organizationId: new mongoose.Types.ObjectId(organizationId),
        name: roleName,
        description: `System ${roleName} role`,
        permissions: getSystemRolePermissions(roleName),
        isSystem: true,
      });
    }
  }
}
