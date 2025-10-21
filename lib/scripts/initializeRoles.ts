/**
 * Script to initialize system roles for an organization
 * This should be run when a new organization is created
 */

import connectDB from '@/lib/db/mongodb';
import { initializeSystemRoles } from '@/lib/services/roleService';

export async function initializeOrganizationRoles(organizationId: string): Promise<void> {
  try {
    await connectDB();
    await initializeSystemRoles(organizationId);
    console.log(`System roles initialized for organization: ${organizationId}`);
  } catch (error) {
    console.error('Failed to initialize system roles:', error);
    throw error;
  }
}

// If running as a standalone script
if (require.main === module) {
  const organizationId = process.argv[2];

  if (!organizationId) {
    console.error('Usage: ts-node initializeRoles.ts <organizationId>');
    process.exit(1);
  }

  initializeOrganizationRoles(organizationId)
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
