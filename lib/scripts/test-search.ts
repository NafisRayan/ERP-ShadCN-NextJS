/**
 * Test script for search functionality
 * This script demonstrates how to use the search service
 * 
 * Note: This is for demonstration purposes only
 * In production, use proper testing frameworks
 */

import { SearchService } from '@/lib/services/search.service';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/db/models/Product';
import Customer from '@/lib/db/models/Customer';
import SalesOrder from '@/lib/db/models/SalesOrder';
import Employee from '@/lib/db/models/Employee';
import mongoose from 'mongoose';

async function testSearchFunctionality() {
  try {
    console.log('🔍 Testing Search Functionality...\n');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to database\n');

    // Create a test organization ID
    const testOrgId = new mongoose.Types.ObjectId();

    // Create sample data for testing
    console.log('📝 Creating sample data...');

    const product = await Product.create({
      organizationId: testOrgId,
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'This is a test product for search functionality',
      category: 'Electronics',
      unit: 'pcs',
      costPrice: 100,
      sellingPrice: 150,
      reorderLevel: 10,
      isActive: true,
    });

    const customer = await Customer.create({
      organizationId: testOrgId,
      type: 'company',
      name: 'Test Customer Inc',
      email: 'test@customer.com',
      phone: '+1234567890',
      company: 'Test Company',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'Test Country',
      },
      paymentTerms: 30,
      isActive: true,
    });

    const employee = await Employee.create({
      organizationId: testOrgId,
      employeeId: 'EMP-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phone: '+1234567890',
      dateOfBirth: new Date('1990-01-01'),
      hireDate: new Date('2020-01-01'),
      department: 'Sales',
      jobTitle: 'Sales Manager',
      salary: 50000,
      employmentType: 'full-time',
      status: 'active',
      address: {
        street: '456 Test Ave',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'Test Country',
      },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1234567891',
      },
    });

    console.log('✅ Sample data created\n');

    // Wait for indexes to be created
    console.log('⏳ Waiting for text indexes...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 1: Search for products
    console.log('🔍 Test 1: Searching for "Test Product"...');
    const productResults = await SearchService.globalSearch(
      'Test Product',
      testOrgId.toString(),
      { entityTypes: ['product'] }
    );
    console.log(`   Found ${productResults.totalCount} product(s)`);
    console.log(`   Results:`, productResults.groupedResults.products);
    console.log('');

    // Test 2: Search for customers
    console.log('🔍 Test 2: Searching for "Test Customer"...');
    const customerResults = await SearchService.globalSearch(
      'Test Customer',
      testOrgId.toString(),
      { entityTypes: ['customer'] }
    );
    console.log(`   Found ${customerResults.totalCount} customer(s)`);
    console.log(`   Results:`, customerResults.groupedResults.customers);
    console.log('');

    // Test 3: Search for employees
    console.log('🔍 Test 3: Searching for "John"...');
    const employeeResults = await SearchService.globalSearch(
      'John',
      testOrgId.toString(),
      { entityTypes: ['employee'] }
    );
    console.log(`   Found ${employeeResults.totalCount} employee(s)`);
    console.log(`   Results:`, employeeResults.groupedResults.employees);
    console.log('');

    // Test 4: Global search
    console.log('🔍 Test 4: Global search for "Test"...');
    const globalResults = await SearchService.globalSearch(
      'Test',
      testOrgId.toString()
    );
    console.log(`   Found ${globalResults.totalCount} total result(s)`);
    console.log(`   Products: ${globalResults.groupedResults.products.length}`);
    console.log(`   Customers: ${globalResults.groupedResults.customers.length}`);
    console.log(`   Employees: ${globalResults.groupedResults.employees.length}`);
    console.log('');

    // Test 5: Autocomplete
    console.log('🔍 Test 5: Autocomplete for "Test"...');
    const autocomplete = await SearchService.getAutocompleteSuggestions(
      'Test',
      testOrgId.toString(),
      5
    );
    console.log(`   Found ${autocomplete.length} suggestion(s)`);
    console.log(`   Suggestions:`, autocomplete.map(s => s.title));
    console.log('');

    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await Product.deleteMany({ organizationId: testOrgId });
    await Customer.deleteMany({ organizationId: testOrgId });
    await Employee.deleteMany({ organizationId: testOrgId });
    console.log('✅ Test data cleaned up\n');

    console.log('✅ All tests completed successfully!');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testSearchFunctionality()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { testSearchFunctionality };
