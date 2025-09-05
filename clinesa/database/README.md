# CLINESA Database Setup

This directory contains the SQL migrations and setup files for the CLINESA medical practice management system.

## Files

- `001_initial_schema.sql` - Creates all tables, indexes, and triggers
- `002_row_level_security.sql` - Sets up RLS policies for multi-tenancy
- `003_sample_data.sql` - Inserts sample data for development and testing

## Setup Instructions

### 1. Execute the migrations in order

In your Supabase SQL Editor, execute the files in the following order:

1. **001_initial_schema.sql** - Creates the complete database schema with triggers
2. **002_row_level_security.sql** - Sets up security policies for multi-tenancy
3. **003_sample_data.sql** - *(Optional)* Adds sample data for testing

**⚠️ Important Notes:**
- Execute each file completely before proceeding to the next one
- The schema includes validation triggers for data integrity
- Sample data is optional but recommended for development

### 2. Generate TypeScript Types (Optional)

After setting up the database, you can generate updated TypeScript types:

```bash
supabase gen types typescript --project-id your-project-id --schema public > src/types/database.types.ts
```

### 3. Environment Variables

Make sure your `.env.local` file contains the correct Supabase credentials:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Schema Overview

### Core Tables

- **organizations** - Multi-tenant organizations (clinics/hospitals)
- **users** - System users with roles (admin, doctor, nurse, receptionist)
- **patients** - Patient records with complete medical information
- **appointments** - Medical appointments with scheduling details
- **medical_records** - Patient visit records and treatments
- **medical_history** - Patient medical history (allergies, conditions, etc.)

### Key Features

- **Multi-tenancy**: All tables include `organization_id` for data isolation
- **Row Level Security**: Ensures users only access their organization's data
- **Audit Trail**: All tables include `created_at` and `updated_at` timestamps
- **Soft Deletes**: Records are marked as inactive instead of being deleted
- **Data Validation**: Triggers ensure doctors have correct roles for appointments
- **Auto-timestamps**: Automatic `updated_at` updates on record changes
- **HIPAA Compliance**: Designed with healthcare data privacy in mind

### Sample Data

The sample data includes:
- 1 sample organization (Clínica San Rafael)
- 5 sample users with different roles
- 3 sample patients with complete profiles
- Sample appointments and medical records

### User Roles and Permissions

- **Admin**: Full access to all features and user management
- **Doctor**: Can manage patients, appointments, and medical records
- **Nurse**: Can view/update patients and medical records (limited)
- **Receptionist**: Can manage patients and appointments (no medical records)

## Security Notes

- All queries are protected by Row Level Security (RLS)
- Users can only access data from their organization
- Sensitive medical data has additional access restrictions
- Authentication is handled by Supabase Auth

## Development Notes

- Patient numbers are auto-generated (PAT-0001, PAT-0002, etc.)
- All dates are stored as timestamps with timezone
- Medical data uses JSONB for flexible structured storage
- Indexes are optimized for common query patterns