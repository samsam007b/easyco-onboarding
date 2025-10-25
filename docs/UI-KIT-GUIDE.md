# EasyCo UI Kit - Complete Guide

This document provides comprehensive documentation for the EasyCo UI Kit components, utilities, hooks, and schemas.

## Table of Contents
1. [Installation](#installation)
2. [UI Components](#ui-components)
3. [Layout Components](#layout-components)
4. [Utilities](#utilities)
5. [Custom Hooks](#custom-hooks)
6. [TypeScript Types](#typescript-types)
7. [Validation Schemas](#validation-schemas)
8. [Examples](#examples)

---

## Installation

The UI Kit is already integrated into the project. Dependencies installed:
- `clsx` - Conditional class names
- `tailwind-merge` - Merge Tailwind classes intelligently

---

## UI Components

### Button

Versatile button component with multiple variants and states.

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'`
- `size`: `'sm' | 'md' | 'lg'`
- `fullWidth`: `boolean`
- `loading`: `boolean`
- `leftIcon`, `rightIcon`: `React.ReactNode`

**Example:**
```tsx
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

<Button variant="primary" size="md">
  Click me
</Button>

<Button variant="secondary" leftIcon={<Plus />} loading>
  Adding...
</Button>

<Button variant="outline" fullWidth>
  Full Width Button
</Button>
```

---

### Input

Text input with label, error handling, and icons.

**Props:**
- `label`: `string`
- `error`: `string`
- `helperText`: `string`
- `leftIcon`, `rightIcon`: `React.ReactNode`
- `fullWidth`: `boolean`

**Example:**
```tsx
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  leftIcon={<Mail />}
  error={errors.email}
  required
/>
```

---

### Textarea

Multi-line text input with character counter.

**Props:**
- `label`: `string`
- `error`: `string`
- `helperText`: `string`
- `showCount`: `boolean`
- `fullWidth`: `boolean`

**Example:**
```tsx
import { Textarea } from '@/components/ui/textarea'

<Textarea
  label="Description"
  placeholder="Tell us about yourself"
  maxLength={500}
  showCount
  rows={5}
/>
```

---

### Select

Dropdown select with custom options.

**Props:**
- `label`: `string`
- `options`: `SelectOption[]`
- `placeholder`: `string`
- `error`: `string`

**Example:**
```tsx
import { Select } from '@/components/ui/select'

const options = [
  { value: 'paris', label: 'Paris' },
  { value: 'lyon', label: 'Lyon' },
  { value: 'marseille', label: 'Marseille' },
]

<Select
  label="City"
  options={options}
  placeholder="Select a city"
/>
```

---

### Checkbox

Checkbox with label and error handling.

**Props:**
- `label`: `React.ReactNode`
- `error`: `string`
- `size`: `'sm' | 'md' | 'lg'`

**Example:**
```tsx
import { Checkbox } from '@/components/ui/checkbox'

<Checkbox
  label="I agree to the terms and conditions"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
```

---

### Radio

Radio button group component.

**Props:**
- `name`: `string`
- `label`: `string`
- `options`: `RadioOption[]`
- `value`: `string`
- `onChange`: `(value: string) => void`
- `orientation`: `'vertical' | 'horizontal'`

**Example:**
```tsx
import { Radio } from '@/components/ui/radio'

const options = [
  { value: 'searcher', label: 'Searcher', description: 'Looking for a place' },
  { value: 'owner', label: 'Owner', description: 'Have a property' },
]

<Radio
  name="userType"
  label="I am a..."
  options={options}
  value={userType}
  onChange={setUserType}
/>
```

---

### Badge

Small label component for status indicators.

**Props:**
- `variant`: `'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'`
- `size`: `'sm' | 'md' | 'lg'`
- `dismissible`: `boolean`
- `onDismiss`: `() => void`
- `icon`: `React.ReactNode`

**Example:**
```tsx
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

<Badge variant="success" icon={<Check />}>
  Verified
</Badge>

<Badge variant="warning" dismissible onDismiss={() => {}}>
  Pending
</Badge>
```

---

### Card

Container component with sub-components for structured content.

**Sub-components:**
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`

**Props:**
- `variant`: `'default' | 'bordered' | 'elevated'`
- `padding`: `'none' | 'sm' | 'md' | 'lg'`
- `interactive`: `boolean`
- `fullHeight`: `boolean`

**Example:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Welcome!</CardTitle>
    <CardDescription>Get started with your profile</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Get Started</Button>
  </CardFooter>
</Card>
```

---

### Modal

Dialog/modal component with customizable content.

**Props:**
- `open`: `boolean`
- `onClose`: `() => void`
- `title`: `string`
- `description`: `string`
- `size`: `'sm' | 'md' | 'lg' | 'xl' | 'full'`
- `showClose`: `boolean`
- `closeOnOverlayClick`: `boolean`
- `closeOnEscape`: `boolean`
- `footer`: `React.ReactNode`

**Example:**
```tsx
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  footer={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  <p>This action cannot be undone.</p>
</Modal>
```

---

## Layout Components

### PageHeader

Standardized page header with title, breadcrumbs, and actions.

**Example:**
```tsx
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'

<PageHeader
  title="Properties"
  description="Manage your coliving properties"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Properties' },
  ]}
  actions={
    <Button variant="primary">Add Property</Button>
  }
/>
```

---

### PageContainer

Max-width container with responsive padding.

**Example:**
```tsx
import { PageContainer } from '@/components/layout/PageContainer'

<PageContainer maxWidth="xl" padding="md" center>
  {/* Page content */}
</PageContainer>
```

---

### Section

Content section with title and optional divider.

**Example:**
```tsx
import { Section } from '@/components/layout/Section'

<Section
  title="Recent Activity"
  description="Your latest interactions"
  divider
>
  {/* Section content */}
</Section>
```

---

### Grid

Responsive grid layout system.

**Example:**
```tsx
import { Grid, GridItem } from '@/components/layout/Grid'

<Grid cols={3} gap="md" responsive={{ sm: 1, md: 2, lg: 3 }}>
  <GridItem colSpan={2}>
    <Card>Content</Card>
  </GridItem>
  <GridItem>
    <Card>Sidebar</Card>
  </GridItem>
</Grid>
```

---

## Utilities

### cn (Class Name Utility)

Merge Tailwind classes intelligently.

```tsx
import { cn } from '@/lib/utils/cn'

<div className={cn(
  'px-4 py-2',
  'bg-white',
  isActive && 'bg-blue-500',
  className
)}>
  Content
</div>
```

---

### Formatters

**Available formatters:**
- `formatCurrency(amount, currency?, locale?)`
- `formatDate(date, style?, locale?)`
- `formatRelativeTime(date, locale?)`
- `formatPhoneNumber(phone)`
- `formatFileSize(bytes, decimals?)`
- `truncate(str, maxLength, suffix?)`
- `capitalize(str)`
- `formatNumber(num, decimals?, locale?)`

**Examples:**
```tsx
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils/formatters'

formatCurrency(1250)                    // "1 250 €"
formatDate(new Date(), 'long')          // "25 octobre 2024"
formatRelativeTime(new Date())          // "il y a quelques secondes"
```

---

### Validators

**Available validators:**
- `isValidPhoneNumber(phone)`
- `isValidPostalCode(postalCode)`
- `isValidEmail(email)`
- `isValidUrl(url)`
- `validatePasswordStrength(password)`
- `isLegalAge(birthDate, minAge?)`

**Example:**
```tsx
import { isValidEmail, validatePasswordStrength } from '@/lib/utils/validators'

if (!isValidEmail(email)) {
  setError('Invalid email')
}

const { isValid, strength, checks } = validatePasswordStrength(password)
// strength: 'weak' | 'medium' | 'strong'
// checks: { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar }
```

---

## Custom Hooks

### useDebounce

Delay updating a value until after a delay.

```tsx
import { useDebounce } from '@/lib/hooks/useDebounce'

const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 500)

useEffect(() => {
  // API call with debouncedSearch
  fetchResults(debouncedSearch)
}, [debouncedSearch])
```

---

### useLocalStorage

Persist state in localStorage.

```tsx
import { useLocalStorage } from '@/lib/hooks/useLocalStorage'

const [theme, setTheme] = useLocalStorage('theme', 'light')
```

---

### useMediaQuery

Responsive breakpoint detection.

```tsx
import { useMediaQuery, useIsMobile } from '@/lib/hooks/useMediaQuery'

const isMobile = useIsMobile()
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)')
```

---

### useClickOutside

Detect clicks outside an element.

```tsx
import { useClickOutside } from '@/lib/hooks/useClickOutside'
import { useRef } from 'react'

const ref = useRef<HTMLDivElement>(null)
useClickOutside(ref, () => setIsOpen(false))

<div ref={ref}>Dropdown content</div>
```

---

### useToggle

Boolean state management.

```tsx
import { useToggle } from '@/lib/hooks/useToggle'

const [isOpen, toggle, setIsOpen] = useToggle(false)

<button onClick={toggle}>Toggle</button>
<button onClick={() => setIsOpen(true)}>Open</button>
```

---

## TypeScript Types

All types are located in the `/types` directory:

**User Types:**
```tsx
import { User, UserType, SearcherProfile, OwnerProfile } from '@/types/user.types'
```

**Common Types:**
```tsx
import { ApiResponse, PaginatedResponse, Status, SelectOption } from '@/types/common.types'
```

---

## Validation Schemas

Zod schemas for form validation located in `/lib/schemas/validation.schemas.ts`:

**Example with React Hook Form:**
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/schemas/validation.schemas'

const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema)
})

const onSubmit = (data: LoginFormData) => {
  // data is type-safe and validated
}
```

**Available Schemas:**
- `loginSchema`
- `signupSchema`
- `forgotPasswordSchema`
- `resetPasswordSchema`
- `changePasswordSchema`
- `updateProfileSchema`
- `addPropertySchema`
- `contactFormSchema`

---

## Complete Form Example

Here's a complete example combining components, hooks, and validation:

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupFormData } from '@/lib/schemas/validation.schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Radio } from '@/components/ui/radio'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Mail, Lock, User } from 'lucide-react'

export function SignupForm() {
  const [userType, setUserType] = useState<'searcher' | 'owner'>('searcher')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = async (data: SignupFormData) => {
    // Handle signup
    console.log(data)
  }

  const userTypeOptions = [
    { value: 'searcher', label: 'Searcher', description: 'Looking for a place' },
    { value: 'owner', label: 'Owner', description: 'Have a property to list' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            leftIcon={<User />}
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <Input
            label="Email"
            type="email"
            leftIcon={<Mail />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            leftIcon={<Lock />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            leftIcon={<Lock />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Radio
            name="userType"
            label="I am a..."
            options={userTypeOptions}
            value={userType}
            onChange={(value) => setUserType(value as 'searcher' | 'owner')}
          />

          <Checkbox
            label="I agree to the terms and conditions"
            error={errors.agreedToTerms?.message}
            {...register('agreedToTerms')}
          />

          <Button type="submit" fullWidth loading={isSubmitting}>
            Sign Up
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

---

## Design System

The UI Kit follows the EasyCo design system:

**Colors:**
- Primary (Purple): `#4A148C`
- Secondary (Yellow): `#FFD600`

**Border Radius:**
- Rounded: `2rem` (full rounded buttons/inputs)
- Cards: `3rem`

**Spacing:**
- Small: `4px`
- Medium: `8px`
- Large: `16px`

---

## Next Steps

1. **Integration**: Start using components in your pages
2. **Customization**: Extend components as needed
3. **Testing**: Test components with different props
4. **Feedback**: Report issues or suggestions

For questions or contributions, please refer to the main project documentation.
