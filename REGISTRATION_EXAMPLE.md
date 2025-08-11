# Contoh Penggunaan Fitur Registrasi

Dokumentasi ini menjelaskan cara menggunakan fitur registrasi dengan format request dan response yang telah diperbarui.

## Format Request Body

Untuk melakukan registrasi, gunakan format request body berikut:

```json
{
  "name": "dev",
  "email": "dev@dev.com",
  "password": "password123",
  "confirm_password": "password123",
  "phone": "+62-812-3456-7889",
  "terms_accepted": true
}
```

### Field yang Wajib:
- `name`: Nama lengkap pengguna
- `email`: Email yang valid
- `password`: Password minimal 8 karakter
- `confirm_password`: Konfirmasi password (harus sama dengan password)
- `phone`: Nomor telepon dengan format internasional
- `terms_accepted`: Harus `true` untuk menyetujui syarat dan ketentuan

## Format Response

Setelah registrasi berhasil, server akan mengembalikan response berikut:

```json
{
  "user": {
    "id": "6894e1d38b2dfb2d5e37d6f0",
    "created_at": "2025-08-08T00:26:43.607000",
    "updated_at": "2025-08-07T17:26:43.610000",
    "name": "dev",
    "email": "dev@dev.com",
    "phone": "+62-812-3456-7889",
    "role": "parent",
    "profile_picture": null,
    "address": null,
    "date_of_birth": null,
    "gender": null,
    "occupation": null,
    "is_active": true,
    "is_verified": false,
    "email_verified": false,
    "phone_verified": false,
    "last_login": null,
    "login_count": 0
  },
  "verification_token": "76Xnn3EdChc50jQORCAQFxn_0tI6orNnDbJSb9aqkCU",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 1800,
  "token_type": "Bearer"
}
```

## Contoh Penggunaan dengan React Hook

### 1. Import Hook

```typescript
import { useRegister } from '@/hooks/useAuth';
```

### 2. Gunakan Hook dalam Komponen

```typescript
const RegisterForm = () => {
  const registerMutation = useRegister();
  
  const handleSubmit = async (formData: RegisterData) => {
    try {
      const result = await registerMutation.mutateAsync(formData);
      
      // Registrasi berhasil
      console.log('User registered:', result.user);
      console.log('Verification token:', result.verification_token);
      
      // Token sudah otomatis disimpan di localStorage
      // Redirect ke halaman verifikasi email
      router.push('/verify-email');
      
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? 'Mendaftar...' : 'Daftar'}
      </button>
    </form>
  );
};
```

### 3. Validasi Form

```typescript
const validateRegistrationData = (data: RegisterData): string[] => {
  const errors: string[] = [];
  
  if (!data.name.trim()) {
    errors.push('Nama wajib diisi');
  }
  
  if (!data.email.includes('@')) {
    errors.push('Email tidak valid');
  }
  
  if (data.password.length < 8) {
    errors.push('Password minimal 8 karakter');
  }
  
  if (data.password !== data.confirm_password) {
    errors.push('Konfirmasi password tidak cocok');
  }
  
  if (!data.phone.startsWith('+')) {
    errors.push('Nomor telepon harus menggunakan format internasional');
  }
  
  if (!data.terms_accepted) {
    errors.push('Anda harus menyetujui syarat dan ketentuan');
  }
  
  return errors;
};
```

## Penanganan Error

Hook `useRegister` akan menangani berbagai jenis error:

- **409 Conflict**: Email sudah terdaftar
- **422 Unprocessable Entity**: Data validasi gagal
- **500 Internal Server Error**: Error server

```typescript
const registerMutation = useRegister({
  onError: (error) => {
    if (error.message.includes('Email sudah terdaftar')) {
      setEmailError('Email ini sudah digunakan');
    } else {
      setGeneralError(error.message);
    }
  },
  onSuccess: (data) => {
    // Registrasi berhasil
    toast.success('Registrasi berhasil! Silakan cek email untuk verifikasi.');
  }
});
```

## Langkah Selanjutnya

Setelah registrasi berhasil:

1. **Verifikasi Email**: Gunakan `verification_token` untuk verifikasi email
2. **Auto Login**: Token akses sudah disimpan, pengguna otomatis login
3. **Redirect**: Arahkan ke halaman dashboard atau verifikasi email
4. **Update Profile**: Pengguna dapat melengkapi profil mereka

## Interface TypeScript

```typescript
// Request
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone: string;
  terms_accepted: boolean;
}

// Response
export interface RegisterResponse {
  user: User;
  verification_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}
```

Dengan format ini, fitur registrasi sudah siap digunakan dan terintegrasi dengan sistem autentikasi yang ada.