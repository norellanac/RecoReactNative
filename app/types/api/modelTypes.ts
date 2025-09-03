export type ProductService = {
  id: number;
  name: string;
  description: string;
  type: number;
  price: number;
  urlImage: string;
  specialPrice: number;
  location: string;
  latitude: number;
  longitude: number;
  userId: number;
  averageRating: number;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
  categories: Category[];
  details: Detail[];
  locations: Location[];
  reviews: Review[];
  user: User;
};

export type Category = {
  id: number;
  name: string;
  description: string;
  icon: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  ProductCategory: ProductCategory;
};

export type ProductCategory = {
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  productServiceId: number;
};

export type Detail = {
  id: number;
  productServiceId: number;
  label: string;
  value: string;
  description: string;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
};

export type Location = {
  id: number;
  productServiceId: number;
  name: string;
  description: string;
  type: number;
  cityId: number;
  latitude: number;
  longitude: number;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
};

export type Review = {
  id: number;
  productServiceId: number;
  userId: number;
  rating: number;
  comment: string;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  averageRating: number | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | Date | string;
    password?: string;
  roles: Role[] | number[];
};

export interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | Date | string;
  UserRole: UserRole;
}

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | Date | string;
}

export type ChatMessage = {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string; 
  updatedAt: string;
  deletedAt: null;
  Reactions: any[];
};

export type ChatReaction = {
  id: number;
  messageId: number;
  userId: number;
  emoji: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
};

export type ChatConversation = {
  id: number;
  user1Id: number;
  user2Id: number;
  createdAt: string;
  updatedAt: string;
   deletedAt: string | null;
  messages: ChatMessage[];
  user1: User;
  user2: User;
};

export type ChatStartResponse = {
  message: string;
  conversationId: number;
};

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type ChatConversationsResponse = ApiResponse<ChatConversation[]>;
export type ChatMessagesResponse = ApiResponse<ChatMessage[]>;
export type ChatStartResponseWrapper = ApiResponse<ChatStartResponse>;
