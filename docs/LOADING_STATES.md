# Loading States Implementation Guide

This document provides guidelines for implementing loading states across the EasyCo application.

## Overview

Loading states improve user experience by:
- Providing visual feedback during data fetching
- Reducing perceived wait time with skeleton screens
- Preventing user confusion about whether the app is working
- Maintaining layout stability (no content jumping)

## Available Skeleton Components

### 1. Form Skeletons
- `ProfileEditFormSkeleton` - For profile edit pages
- `FormSectionSkeleton` - For compact form sections
- `MultiStepFormSkeleton` - For multi-step forms with progress

### 2. Card Skeletons
- `PropertyCardSkeleton` / `PropertyCardsGridSkeleton` - For property listings
- `ApplicationCardSkeleton` / `ApplicationCardsGridSkeleton` - For applications
- `ProfileCardSkeleton` / `ProfileCardsGridSkeleton` - For user profiles
- `GroupCardSkeleton` / `GroupCardsGridSkeleton` - For groups

### 3. List Skeletons
- `ConversationListSkeleton` - For message conversations
- `NotificationListSkeleton` - For notifications
- `MessageThreadSkeleton` - For message threads

### 4. Dashboard Skeletons
- `DashboardStatCardSkeleton` / `DashboardStatsGridSkeleton` - For dashboard stats

## Hooks for Loading States

### 1. `usePageLoading()`
For pages that only load data (no forms):
```tsx
import { usePageLoading } from '@/lib/hooks/use-page-loading';
import { ProfileEditFormSkeleton } from '@/components/ProfileEditFormSkeleton';

export default function ProfilePage() {
  const { isLoading, error, execute } = usePageLoading();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    execute(async () => {
      const data = await fetchProfile();
      setProfile(data);
    });
  }, []);

  if (isLoading) return <ProfileEditFormSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{/* Your page content */}</div>;
}
```

### 2. `useFormSubmit()`
For pages with forms that submit data:
```tsx
import { useFormSubmit } from '@/lib/hooks/use-page-loading';

export default function FormPage() {
  const { isSubmitting, submit } = useFormSubmit();

  const handleSubmit = async () => {
    await submit(async () => {
      await saveData(formData);
      router.push('/success');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

### 3. `usePageLoadingAndSubmit()`
For pages that both load and submit data:
```tsx
import { usePageLoadingAndSubmit } from '@/lib/hooks/use-page-loading';

export default function EditPage() {
  const {
    isLoading,
    isSubmitting,
    loadData,
    submitForm,
    isBusy
  } = usePageLoadingAndSubmit();

  useEffect(() => {
    loadData(async () => {
      const data = await fetchData();
      setData(data);
    });
  }, []);

  const handleSubmit = async () => {
    await submitForm(async () => {
      await saveData(formData);
    });
  };

  if (isLoading) return <ProfileEditFormSkeleton />;

  return (
    <form>
      <button disabled={isBusy}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

## Implementation Patterns

### Pattern 1: Simple Data Loading
```tsx
// Before
export default function MyPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await fetchData();
      setData(result);
    }
    load();
  }, []);

  return <div>{/* content */}</div>;
}

// After
export default function MyPage() {
  const { isLoading, execute } = usePageLoading();
  const [data, setData] = useState(null);

  useEffect(() => {
    execute(async () => {
      const result = await fetchData();
      setData(result);
    });
  }, []);

  if (isLoading) return <ProfileEditFormSkeleton />;

  return <div>{/* content */}</div>;
}
```

### Pattern 2: Form with Submission
```tsx
// Before
export default function MyForm() {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    try {
      await saveData();
    } finally {
      setIsPending(false);
    }
  };

  return <button disabled={isPending}>Save</button>;
}

// After
export default function MyForm() {
  const { isSubmitting, submit } = useFormSubmit();

  const handleSubmit = () => {
    submit(async () => {
      await saveData();
    });
  };

  return <button disabled={isSubmitting}>
    {isSubmitting ? 'Saving...' : 'Save'}
  </button>;
}
```

### Pattern 3: Combined Load and Submit
```tsx
export default function EditProfilePage() {
  const {
    isLoading,
    isSubmitting,
    loadData,
    submitForm
  } = usePageLoadingAndSubmit();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadData(async () => {
      const user = await getUser();
      const data = await getProfile(user.id);
      setProfile(data);
    });
  }, []);

  const handleSave = () => {
    submitForm(async () => {
      await updateProfile(profile);
      toast.success('Profile updated!');
    });
  };

  if (isLoading) return <ProfileEditFormSkeleton />;

  return (
    <form>
      {/* Form fields */}
      <button disabled={isSubmitting} onClick={handleSave}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
```

## Route-Level Loading (loading.tsx)

For Next.js App Router, create `loading.tsx` files:

```tsx
// app/profile/enhance/loading.tsx
import { ProfileEditFormSkeleton } from '@/components/ProfileEditFormSkeleton';

export default function Loading() {
  return (
    <div className="container mx-auto p-6">
      <ProfileEditFormSkeleton />
    </div>
  );
}
```

## Pages Requiring Loading States

### High Priority (11 pages)
Profile Enhancement Pages:
- [ ] `/app/profile/enhance/review/page.tsx`
- [ ] `/app/profile/enhance/about/page.tsx`
- [ ] `/app/profile/enhance/values/page.tsx`
- [ ] `/app/profile/enhance/preferences/page.tsx`
- [ ] `/app/profile/enhance/hobbies/page.tsx`
- [ ] `/app/profile/enhance/personality/page.tsx`
- [ ] `/app/profile/enhance-resident/verification/page.tsx`
- [ ] `/app/profile/enhance-resident/lifestyle/page.tsx`
- [ ] `/app/profile/enhance-resident/personality/page.tsx`
- [ ] `/app/profile/enhance-owner/review/page.tsx`
- [ ] `/app/profile/enhance-owner/bio/page.tsx`

### Medium Priority (10 pages)
Onboarding Pages:
- [ ] `/app/onboarding/resident/basic-info/page.tsx`
- [ ] `/app/onboarding/resident/lifestyle/page.tsx`
- [ ] `/app/onboarding/resident/living-situation/page.tsx`
- [ ] `/app/onboarding/resident/personality/page.tsx`
- [ ] `/app/onboarding/owner/basic-info/page.tsx`
- [ ] `/app/onboarding/owner/property-info/page.tsx`
- [ ] `/app/onboarding/owner/about/page.tsx`
- [ ] `/app/onboarding/searcher/basic-info/page.tsx`
- [ ] `/app/onboarding/searcher/create-group/page.tsx`
- [ ] `/app/onboarding/searcher/join-group/page.tsx`

### Low Priority (4 pages)
Other Pages:
- [ ] `/app/dashboard/settings/preferences/page.tsx`
- [ ] `/app/community/page.tsx`
- [ ] `/app/forgot-password/page.tsx`
- [ ] `/app/signup/page.tsx`

## Testing Loading States

### Manual Testing
1. Use Chrome DevTools Network throttling (Slow 3G)
2. Verify skeleton appears before content
3. Check that layout doesn't jump when content loads
4. Ensure skeleton matches actual content structure

### Automated Testing
```tsx
// Example Playwright test
test('shows loading skeleton', async ({ page }) => {
  await page.goto('/profile/enhance/about');
  await expect(page.locator('[data-testid="form-skeleton"]')).toBeVisible();
  await expect(page.locator('form')).toBeVisible();
  await expect(page.locator('[data-testid="form-skeleton"]')).not.toBeVisible();
});
```

## Best Practices

1. **Match Skeleton to Content**: Skeleton should mirror actual content layout
2. **Quick Transitions**: Keep loading states brief; optimize data fetching
3. **Progressive Loading**: Show partial content if possible
4. **Error States**: Always handle errors gracefully
5. **Accessibility**: Ensure loading states are announced to screen readers
6. **Consistent Duration**: Most skeletons should show 300-1500ms
7. **No Spinners for Forms**: Use skeletons instead of generic spinners

## Common Mistakes to Avoid

1. ❌ Using generic spinners instead of skeletons
2. ❌ Not handling error states
3. ❌ Skeleton doesn't match content layout
4. ❌ Missing loading states on slow operations
5. ❌ Loading states that never complete
6. ❌ Multiple sequential loads without intermediate feedback
7. ❌ Forgetting to disable buttons during submission

## Performance Tips

1. Combine multiple Supabase queries into one when possible
2. Use React Suspense for component-level loading
3. Implement pagination for large lists
4. Cache frequently accessed data
5. Use optimistic updates where appropriate
6. Show stale data while revalidating

## Resources

- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [Skeleton Screens](https://www.lukew.com/ff/entry.asp?1797)
