// Type definitions for Inertia.js patterns
// These types match the Inertia.js API for Laravel integration

export interface InertiaFormProps<T> {
  data: T;
  setData: (key: keyof T | Partial<T> | ((data: T) => T), value?: any) => void;
  post: (url: string, options?: InertiaSubmitOptions) => void;
  put: (url: string, options?: InertiaSubmitOptions) => void;
  delete: (url: string, options?: InertiaSubmitOptions) => void;
  reset: (...fields: (keyof T)[]) => void;
  clearErrors: (...fields: (keyof T)[]) => void;
  errors: Partial<Record<keyof T, string>>;
  processing: boolean;
  wasSuccessful: boolean;
  recentlySuccessful: boolean;
  transform: (callback: (data: T) => any) => void;
}

export interface InertiaSubmitOptions {
  forceFormData?: boolean;
  preserveScroll?: boolean;
  preserveState?: boolean;
  onSuccess?: (page: any) => void;
  onError?: (errors: any) => void;
  onFinish?: () => void;
}

// Movie related types
export interface MovieGenre {
  id: number;
  name: string;
}

export interface MovieCategory {
  id: number;
  title: string;
  description: string | null;
}

export interface MovieCastMember {
  id?: number;
  movie_id?: number;
  name: string;
  role: string;
  image: string | File | null;
  sort_order: number;
  _destroy?: boolean;
}

export interface MovieEpisode {
  id?: number;
  movie_id?: number;
  number: number;
  title: string;
  duration: string;
  thumbnail: string | File | null;
  video_url: string;
  sort_order: number;
  _destroy?: boolean;
}

export interface MovieFormData {
  title: string;
  description: string;
  rating: number | string;
  year: number | string;
  poster: File | string | null;
  banner: File | string | null;
  trailer_url: string;
  featured: boolean;
  genre_ids: number[];
  category_ids: number[];
  movie_cast: MovieCastMember[];
  movie_episodes: MovieEpisode[];
}

export interface Movie extends Omit<MovieFormData, 'genre_ids' | 'category_ids' | 'movie_cast' | 'movie_episodes'> {
  id: number;
  created_at: string;
  updated_at: string;
  genres?: MovieGenre[];
  categories?: MovieCategory[];
  cast?: MovieCastMember[];
  episodes?: MovieEpisode[];
}

// Retail types
export interface RetailCategory {
  id: number;
  name: string;
  icon: string | null;
  description: string | null;
}

export interface RetailProduct {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  image: string | null;
  badge: string | null;
  stock: number;
  created_at: string;
  updated_at: string;
}

// Construction types
export interface ConstructionCategory {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  icon: string | null;
}

export interface ConstructionProduct {
  id: number;
  category_id: number;
  name: string;
  specifications: string | null;
  price: number | null;
  image: string | null;
  stock: number;
  created_at: string;
  updated_at: string;
}

// Order types
export interface Order {
  id: number;
  user_id: number | null;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string | null;
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_type: 'retail' | 'construction';
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
}

// Team member types
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
