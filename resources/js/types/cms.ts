// TypeScript interfaces matching the exact database schema

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  type: 'construction' | 'retail';
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Film {
  id: number;
  title: string;
  description: string | null;
  genres: string | null;
  rating: number | null;
  year: number | null;
  poster: string | null;
  banner: string | null;
  is_featured: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  casts?: Cast[];
  episodes?: Episode[];
}

export interface Cast {
  id: number;
  film_id: number;
  name: string;
  role: string | null;
  image: string | null;
  deleted_at: string | null;
}

export interface Episode {
  id: number;
  film_id: number;
  number: number;
  title: string;
  duration: string | null;
  thumbnail: string | null;
  deleted_at: string | null;
  platforms?: EpisodePlatform[];
}

export interface EpisodePlatform {
  id: number;
  episode_id: number;
  platform_name: string;
  url: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  badge: string | null;
  stock: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  specifications?: ProductSpecification[];
  images?: ProductImage[];
  testimonials?: Testimonial[];
}

export interface ProductSpecification {
  id: number;
  product_id: number;
  property: string;
  value: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_path: string;
  is_primary: boolean;
}

export interface Testimonial {
  id: number;
  product_id: number;
  name: string;
  rating: number | null;
  comment: string | null;
  image: string | null;
  deleted_at: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number | null;
  total_amount: number;
  payment_status: 'pending' | 'settlement' | 'expire' | 'cancel';
  payment_type: string | null;
  snap_token: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_address: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string | null;
  image: string | null;
  order_priority: number;
  deleted_at: string | null;
}

export interface CarouselSlide {
  id: number;
  title: string | null;
  subtitle: string | null;
  image: string;
  link: string | null;
  theme: 'light' | 'dark' | null;
  deleted_at: string | null;
}

// Form data types (for useForm)
export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image: File | null;
  icon: File | null;
  type: 'construction' | 'retail';
}

export interface FilmFormData {
  title: string;
  description: string;
  genres: string;
  rating: number | null;
  year: number | null;
  poster: File | null;
  banner: File | null;
  is_featured: boolean;
  casts: Array<{
    id?: number;
    name: string;
    role: string;
    image: File | null;
    _destroy?: boolean;
  }>;
  episodes: Array<{
    id?: number;
    number: number;
    title: string;
    duration: string;
    thumbnail: File | null;
    platforms: Array<{
      id?: number;
      platform_name: string;
      url: string;
      _destroy?: boolean;
    }>;
    _destroy?: boolean;
  }>;
}

export interface ProductFormData {
  category_id: number | null;
  name: string;
  slug: string;
  description: string;
  price: number | string;
  original_price: number | string;
  badge: string;
  stock: number | string;
  specifications: Array<{
    id?: number;
    property: string;
    value: string;
    _destroy?: boolean;
  }>;
  images: Array<{
    id?: number;
    image_path: File | null;
    is_primary: boolean;
    _destroy?: boolean;
  }>;
  testimonials: Array<{
    id?: number;
    name: string;
    rating: number | null;
    comment: string;
    image: File | null;
    _destroy?: boolean;
  }>;
}

export interface OrderFormData {
  order_number: string;
  user_id: number | null;
  total_amount: number | string;
  payment_status: 'pending' | 'settlement' | 'expire' | 'cancel';
  payment_type: string;
  snap_token: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  items: Array<{
    id?: number;
    product_id: number | null;
    quantity: number | string;
    price: number | string;
    _destroy?: boolean;
  }>;
}
