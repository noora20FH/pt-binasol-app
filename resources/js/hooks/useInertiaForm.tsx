// Mock implementation of Inertia.js useForm hook
// In your actual Laravel project, you would import this from '@inertiajs/react'
// This is a demonstration implementation for the Figma Make environment

import React, { useState } from 'react';
import { InertiaFormProps, InertiaSubmitOptions } from '@/types/inertia';

export function useForm<T extends Record<string, any>>(initialData: T): InertiaFormProps<T> {
  const [data, setDataState] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [processing, setProcessing] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);
  const [transformCallback, setTransformCallback] = useState<((data: T) => any) | null>(null);

  const setData = (key: keyof T | Partial<T> | ((data: T) => T), value?: any) => {
    if (typeof key === 'function') {
      setDataState(key);
    } else if (typeof key === 'object') {
      setDataState((prev) => ({ ...prev, ...key }));
    } else {
      setDataState((prev) => ({ ...prev, [key]: value }));
    }
  };

  const reset = (...fields: (keyof T)[]) => {
    if (fields.length === 0) {
      setDataState(initialData);
    } else {
      setDataState((prev) => {
        const newData = { ...prev };
        fields.forEach((field) => {
          newData[field] = initialData[field];
        });
        return newData;
      });
    }
  };

  const clearErrors = (...fields: (keyof T)[]) => {
    if (fields.length === 0) {
      setErrors({});
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        fields.forEach((field) => {
          delete newErrors[field];
        });
        return newErrors;
      });
    }
  };

  const transform = (callback: (data: T) => any) => {
    setTransformCallback(() => callback);
  };

  const submit = (method: 'post' | 'put' | 'delete') => (url: string, options?: InertiaSubmitOptions) => {
    setProcessing(true);
    setWasSuccessful(false);
    clearErrors();

    // Simulate API call
    setTimeout(() => {
      // Mock success response
      console.log(`[Inertia Mock] ${method.toUpperCase()} ${url}`, {
        data: transformCallback ? transformCallback(data) : data,
        options,
      });

      setProcessing(false);
      setWasSuccessful(true);
      setRecentlySuccessful(true);

      // Call success callback
      if (options?.onSuccess) {
        options.onSuccess({});
      }

      // Call finish callback
      if (options?.onFinish) {
        options.onFinish();
      }

      // Reset recentlySuccessful after 2 seconds
      setTimeout(() => {
        setRecentlySuccessful(false);
      }, 2000);
    }, 1000);
  };

  return {
    data,
    setData,
    post: submit('post'),
    put: submit('put'),
    delete: submit('delete'),
    reset,
    clearErrors,
    errors,
    processing,
    wasSuccessful,
    recentlySuccessful,
    transform,
  };
}

// Mock Inertia router
export const router = {
  visit: (url: string, options?: any) => {
    console.log('[Inertia Mock] router.visit', url, options);
  },
  get: (url: string, data?: any, options?: any) => {
    console.log('[Inertia Mock] router.get', url, data, options);
  },
  post: (url: string, data?: any, options?: any) => {
    console.log('[Inertia Mock] router.post', url, data, options);
  },
  put: (url: string, data?: any, options?: any) => {
    console.log('[Inertia Mock] router.put', url, data, options);
  },
  delete: (url: string, options?: any) => {
    console.log('[Inertia Mock] router.delete', url, options);
  },
};

// Mock Link component
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function Link({
  href,
  children,
  className,
  ...props
}: LinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        router.visit(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
