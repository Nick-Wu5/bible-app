# Authentication System & Cloud Migration Strategy

## Current Implementation

### Local Authentication (SQLite)

- **Phone-based authentication**: Users register/login with phone numbers
- **Local storage**: All data stored in SQLite database on device
- **Auto-login**: First user in database is automatically logged in (for development)

### User Model

```typescript
interface User {
  id: string;
  name: string;
  phone: string;
  denomination?: string;
  preferredTranslation: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Authentication Flow

1. **App Start**: Check for existing users in database
2. **Login**: Enter phone number → find user → set as current user
3. **Register**: Enter name, phone, denomination, translation → create user → auto-login
4. **Logout**: Clear current user state

## Cloud Migration Strategy

### Database Service Abstraction

The app uses a `IDatabaseService` interface that abstracts database operations:

```typescript
interface IDatabaseService {
  // User operations
  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  getUserByPhone(phone: string): Promise<User | null>;
  updateUser(userId: string, updates: Partial<User>): Promise<void>;

  // Verse operations
  addVerse(
    verse: Omit<Verse, "id" | "createdAt" | "updatedAt">
  ): Promise<Verse>;
  getVersesByUser(userId: string): Promise<Verse[]>;
  // ... more methods
}
```

### Migration Steps

#### 1. Create Cloud Service Implementation

```typescript
// services/FirebaseService.ts
export class FirebaseService implements IDatabaseService {
  // Implement all interface methods using Firebase
}

// services/SupabaseService.ts
export class SupabaseService implements IDatabaseService {
  // Implement all interface methods using Supabase
}
```

#### 2. Update Factory Function

```typescript
// services/DatabaseService.ts
export function getDatabaseService(): IDatabaseService {
  const useCloudDatabase = process.env.USE_CLOUD_DB === "true";

  if (useCloudDatabase) {
    return new FirebaseService(); // or SupabaseService
  } else {
    return new SQLiteService();
  }
}
```

#### 3. Add Authentication Providers

```typescript
// Enhanced User model for cloud
interface User {
  // ... existing fields
  email?: string;
  authProvider?: "local" | "firebase" | "apple" | "google";
  lastSyncAt?: Date;
}
```

### Recommended Cloud Services

#### Firebase (Recommended)

- **Pros**: Easy setup, good free tier, real-time sync
- **Cons**: Vendor lock-in, pricing at scale
- **Best for**: Quick MVP, real-time features

#### Supabase

- **Pros**: Open source, PostgreSQL, generous free tier
- **Cons**: Newer platform, smaller community
- **Best for**: Open source preference, SQL expertise

#### AWS Amplify

- **Pros**: Enterprise-grade, highly scalable
- **Cons**: Complex setup, AWS knowledge required
- **Best for**: Enterprise apps, existing AWS infrastructure

## Migration Checklist

### Phase 1: Preparation

- [x] Abstract database operations with interface
- [x] Use factory pattern for service selection
- [x] Design user model for cloud compatibility
- [ ] Add environment configuration
- [ ] Set up cloud project (Firebase/Supabase)

### Phase 2: Implementation

- [ ] Create cloud service implementation
- [ ] Add authentication providers (email, social)
- [ ] Implement data sync between local and cloud
- [ ] Add offline support with local caching

### Phase 3: Testing & Deployment

- [ ] Test cloud authentication flow
- [ ] Test data synchronization
- [ ] Test offline functionality
- [ ] Deploy with feature flags

### Phase 4: Rollout

- [ ] Enable cloud database for new users
- [ ] Migrate existing user data
- [ ] Monitor performance and errors
- [ ] Gradually deprecate local-only mode

## Security Considerations

### Local Storage

- SQLite database is device-specific
- No cross-device sync
- Data lost if device is reset

### Cloud Storage

- Implement proper authentication
- Use secure API keys
- Add data encryption
- Implement user permissions
- Add rate limiting

## Performance Considerations

### Local Storage Performance

- Fast queries
- No network dependency
- Limited by device storage

### Cloud Storage Performance

- Network latency
- Requires internet connection
- Scalable storage
- Real-time sync capabilities

## Next Steps

1. **Choose cloud provider** (Firebase recommended for MVP)
2. **Set up cloud project** and get API keys
3. **Implement cloud service** following the interface
4. **Add authentication providers** (email, Apple, Google)
5. **Test thoroughly** before user migration
6. **Deploy with feature flags** for gradual rollout
